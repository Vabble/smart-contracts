// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "../lib/ERC20.sol";
import {IFxERC20} from "./IFxERC20.sol";

contract FxERC20 is IFxERC20, ERC20 {
    address internal _fxManager;
    address internal _connectedToken;
    address internal _owner;

    uint256 public constant faucetLimit = 500000000 * 10**18;

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier onlyManager() {
        require(msg.sender == _fxManager, "Invalid Manager");
        _;
    }

    function clear() public onlyOwner {
        _fxManager = address(0x0);
        _connectedToken = address(0x0);
    }

    function faucet(uint256 _amount) external onlyOwner {
        require(_amount <= faucetLimit, "Faucet limit error");
        _mint(msg.sender, _amount);
    }

    function burn(uint256 _amount) external onlyOwner {
        require(_amount > 0, "burn amount must be greater than zero");
        require(_amount <= balanceOf(msg.sender), "burn amount exceeds balance");
        _burn(msg.sender, _amount);
    }

    function initialize(
        address owner_,
        address fxManager_,
        address connectedToken_,
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) public override {
        require(_fxManager == address(0x0) && _connectedToken == address(0x0), "Token is already initialized");
        _owner = owner_;
        _fxManager = fxManager_;
        _connectedToken = connectedToken_;

        // setup meta data
        _setupMetaData(name_, symbol_, decimals_);
    }

    // fxManager returns fx manager
    function fxManager() public view override returns (address) {
        return _fxManager;
    }

    // connectedToken returns root token
    function connectedToken() public view override returns (address) {
        return _connectedToken;
    }

    // setup name, symbol and decimals
    function setupMetaData(string memory _name, string memory _symbol, uint8 _decimals) public onlyManager {        
        _setupMetaData(_name, _symbol, _decimals);
    }

    function mint(address user, uint256 amount) public override onlyManager {
        _mint(user, amount);
    }

    function burn(address user, uint256 amount) public override onlyManager {
        _burn(user, amount);
    }
}
