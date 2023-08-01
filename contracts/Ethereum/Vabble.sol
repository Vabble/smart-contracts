// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vabble is ERC20 {
    constructor() ERC20("Vabble", "VAB") {
        _mint(msg.sender, 1456250000 * 10 ** decimals());
    }
}
