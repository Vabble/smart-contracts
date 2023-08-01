// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VABTokenSwap is Ownable, ReentrancyGuard {

    event TokenSwapped(address customer, uint256 amount, uint256 time);
    event LiquidityAdded(address newVAB, uint256 amount, uint256 time);
    event OldTokenWithdraw(address oldVAB, uint256 amount, uint256 time);
    event NewTokenWithdraw(address newVAB, uint256 amount, uint256 time);
    event PairTokensAdded(address oldToken, address newToken, uint256 time);

    address public oldVAB;
    address public newVAB;
    
    constructor(address _oldVAB, address _newVAB) {
        require(_oldVAB != address(0), "zero old token address");
        oldVAB = _oldVAB;
        
        require(_newVAB != address(0), "zero new token address");
        newVAB = _newVAB;
    }
    
    function addPairTokens(address _oldToken, address _newToken) external nonReentrant onlyOwner {
        require(_oldToken != address(0), "zero old token address");
        require(__isContract(_oldToken), "old: not contract address");
        oldVAB = _oldToken;

        require(_newToken != address(0), "zero new token address");
        require(__isContract(_newToken), "new: not contract address");
        newVAB = _newToken;
        
        require(IERC20Metadata(_oldToken).decimals() == IERC20Metadata(_newToken).decimals(), "wrong decimals");

        emit PairTokensAdded(_oldToken, _newToken, block.timestamp);
    }

    function __isContract(address _address) private view returns(bool){
        uint32 size;
        assembly {
            size := extcodesize(_address)
        }
        return (size > 0);
    }

    function swap(uint256 _amount) external nonReentrant {
        // Transfer the old tokens from the sender to this contract
        require(IERC20(oldVAB).transferFrom(msg.sender, address(this), _amount), "Transfer of old tokens failed");
        
        require(IERC20(newVAB).balanceOf(address(this)) >= _amount, "Insufficient pool new tokens");

        // Transfer the equivalent amount of new tokens from this contract to the sender
        require(IERC20(newVAB).transfer(msg.sender, _amount), "Transfer of new tokens failed");

        emit TokenSwapped(msg.sender, _amount, block.timestamp);
    }
    
    function addLiquidity(uint256 _amount) external nonReentrant onlyOwner {
        require(_amount > 0, "zero amount");
        require(IERC20(newVAB).balanceOf(msg.sender) >= _amount, "Insufficient new tokens");

        // Transfer the new tokens from the owner to this contract
        require(IERC20(newVAB).transferFrom(msg.sender, address(this), _amount), "Transfer of new tokens failed");

        emit LiquidityAdded(newVAB, _amount, block.timestamp);
    }

    function withdrawOldVABToken(uint256 _amount) external nonReentrant onlyOwner {
        require(_amount > 0, "zero amount");
        require(IERC20(oldVAB).balanceOf(address(this)) >= _amount, "Insufficient old tokens");

        // Transfer the old tokens from this contract to the owner
        require(IERC20(oldVAB).transfer(msg.sender, _amount), "Transfer of old tokens failed");

        emit OldTokenWithdraw(oldVAB, _amount, block.timestamp);
    }
    
    function withdrawNewVABToken(uint256 _amount) external nonReentrant onlyOwner {
        require(_amount > 0, "zero amount");
        require(IERC20(newVAB).balanceOf(address(this)) >= _amount, "Insufficient new tokens");

        // Transfer the new tokens from this contract to the owner
        require(IERC20(newVAB).transfer(msg.sender, _amount), "Transfer of new tokens failed");

        emit NewTokenWithdraw(newVAB, _amount, block.timestamp);
    }
}
