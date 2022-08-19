// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LoveChainToken is ERC20 {
  constructor() ERC20("LoveChainToken", "LCT") {
    _mint(msg.sender, 10000000e18);
  }
}
