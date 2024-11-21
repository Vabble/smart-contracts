// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vabble is ERC20 {
    constructor() ERC20("Vabble", "VFX") {
        _mint(msg.sender, 145625000 * 10 ** decimals());
    }
}
