// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {FxBaseChildTunnel} from "../tunnel/FxBaseChildTunnel.sol";
import {Create2} from "../lib/Create2.sol";
import {IFxERC20} from "../tokens/IFxERC20.sol";

contract FxERC20ChildTunnel is FxBaseChildTunnel, Create2 {
    bytes32 public constant DEPOSIT = keccak256("DEPOSIT");
    bytes32 public constant MAP_TOKEN = keccak256("MAP_TOKEN");
    
    event TokenMapped(address indexed rootToken, address indexed childToken); // event for token mapping
    
    mapping(address => address) public rootToChildToken; // root to child token
    
    address public immutable tokenTemplate; // token template

    address public root_deployer;


    // slither-disable-next-line missing-zero-check
    constructor(address _fxChild, address _tokenTemplate) FxBaseChildTunnel(_fxChild) {
        tokenTemplate = _tokenTemplate;
        require(_isContract(_tokenTemplate), "Token template is not contract, Error");
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
        } else {
            revert("FxERC20ChildTunnel: INVALID_SYNC_TYPE");
        }
    }

    function _mapToken(bytes memory syncData) internal returns (address) {
        (address rootToken, string memory name, string memory symbol, uint8 decimals, address deployer) = abi.decode(
            syncData,
            (address, string, string, uint8, address)
        );

        // get root to child token
        address childToken = rootToChildToken[rootToken];

        // check if it's already mapped
        require(childToken == address(0x0), "FxERC20ChildTunnel: ALREADY_MAPPED");

        // deploy new child token
        bytes32 salt = keccak256(abi.encodePacked(rootToken));
        childToken = createClone(salt, tokenTemplate);

        root_deployer = deployer;

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
