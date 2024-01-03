// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {FxBaseChildTunnel} from "../tunnel/FxBaseChildTunnel.sol";
import {Create2} from "../lib/Create2.sol";
import {IFxERC20} from "../tokens/IFxERC20.sol";

contract FxERC20ChildTunnel is FxBaseChildTunnel, Create2 {
    bytes32 public constant DEPOSIT = keccak256("DEPOSIT");
    bytes32 public constant MAP_TOKEN = keccak256("MAP_TOKEN");
    bytes32 public constant FACUCET = keccak256("FACUCET");
    
    event TokenMapped(address indexed rootToken, address indexed childToken); // event for token mapping
    event TokenFaucet(address indexed rootToken, uint256 amount); // event for token faucet
    
    mapping(address => address) public rootToChildToken; // root to child token
    mapping(address => address) public deployerMap;
    
    // slither-disable-next-line missing-zero-check
    constructor(
        address _fxChild
    ) FxBaseChildTunnel(_fxChild) {
        
    }

    function withdraw(address childToken, uint256 amount) public {
        _withdraw(childToken, msg.sender, amount);
    }

    function withdrawTo(address childToken, address receiver, uint256 amount) public {
        _withdraw(childToken, receiver, amount);
    }

    //
    // Internal methods
    //

    function _processMessageFromRoot(
        uint256 /* stateId */,
        address sender,
        bytes memory data
    ) internal override validateSender(sender) {
        // decode incoming data
        (bytes32 syncType, bytes memory syncData) = abi.decode(data, (bytes32, bytes));

        if (syncType == DEPOSIT) {
            _syncDeposit(syncData);
        } else if (syncType == MAP_TOKEN) {
            _mapToken(syncData);
        } else if (syncType == FACUCET) {
            _faucet(syncData);
        } else {
            revert("FxERC20ChildTunnel: INVALID_SYNC_TYPE");
        }
    }

    function _mapToken(bytes memory syncData) internal returns (address) {
        (address rootToken, string memory name, string memory symbol, uint8 decimals, address childToken, address deployer) = abi.decode(
            syncData,
            (address, string, string, uint8, address, address)
        );

        // check if it's already mapped
        require(rootToChildToken[rootToken] == address(0x0) || deployerMap[rootToken] == deployer, "FxERC20ChildTunnel: ALREADY_MAPPED");

        // slither-disable-next-line reentrancy-no-eth
        IFxERC20(childToken).initialize(
            deployer, // set owner of this token
            address(this),            
            rootToken,
            // string(abi.encodePacked(name, SUFFIX_NAME)),
            // string(abi.encodePacked(PREFIX_SYMBOL, symbol)),
            name,
            symbol,
            decimals
        );

        // map the token
        rootToChildToken[rootToken] = childToken;
        deployerMap[rootToken] = deployer;
        
        emit TokenMapped(rootToken, childToken);

        // return new child token
        return childToken;
    }

    function _syncDeposit(bytes memory syncData) internal {
        (address rootToken, address depositor, address to, uint256 amount, bytes memory depositData) = abi.decode(
            syncData,
            (address, address, address, uint256, bytes)
        );
        address childToken = rootToChildToken[rootToken];

        // deposit tokens
        IFxERC20 childTokenContract = IFxERC20(childToken);
        childTokenContract.mint(to, amount);

        // call onTokenTransfer() on `to` with limit and ignore error
        if (_isContract(to)) {
            uint256 txGas = 2000000;
            bool success = false;
            bytes memory data = abi.encodeWithSignature(
                "onTokenTransfer(address,address,address,address,uint256,bytes)",
                rootToken,
                childToken,
                depositor,
                to,
                amount,
                depositData
            );
            // solium-disable-next-line security/no-inline-assembly
            assembly {
                success := call(txGas, to, 0, add(data, 0x20), mload(data), 0, 0)
            }
        }
    }

    function _faucet(bytes memory syncData) internal returns (address) {
        (address rootToken, uint256 amount) = abi.decode(
            syncData,
            (address, uint256)
        );

         // check if token is already mapped
        require(rootToChildToken[rootToken] != address(0x0), "FxERC20ChildTunnel: NOT_MAPPED");

        address childToken = rootToChildToken[rootToken];
        address deployer = deployerMap[rootToken];

        // slither-disable-next-line reentrancy-no-eth
        IFxERC20(childToken).faucet(
            deployer, // set owner of this token
            amount
        );

        emit TokenFaucet(rootToken, amount);

        // return new child token
        return childToken;
    }

    function _withdraw(address childToken, address receiver, uint256 amount) internal {
        IFxERC20 childTokenContract = IFxERC20(childToken);
        // child token contract will have root token
        address rootToken = childTokenContract.connectedToken();

        // validate root and child token mapping
        require(
            childToken != address(0x0) && rootToken != address(0x0) && childToken == rootToChildToken[rootToken],
            "FxERC20ChildTunnel: NO_MAPPED_TOKEN"
        );

        // withdraw tokens
        childTokenContract.burn(msg.sender, amount);

        // send message to root regarding token burn
        _sendMessageToRoot(abi.encode(rootToken, childToken, receiver, amount));
    }

    // check if address is contract
    function _isContract(address _addr) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }
}
