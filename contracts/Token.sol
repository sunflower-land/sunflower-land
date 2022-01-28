
   
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "./GameOwner.sol";

contract SunflowerLandToken is ERC20Pausable, GameOwner {
  address private team;

  constructor() payable ERC20("Sunflower Land", "SFL") {
      team = msg.sender;
  }

  function passTeamRole(address _team) public onlyOwner returns (bool) {
    team = _team;

    return true;
  }
  
  function gameMint(address account, uint256 amount) public onlyGame {
	_mint(account, amount);
 }

  function gameBurn(address account, uint256 amount) public onlyGame {
	_burn(account, amount);
  }

  function gameTransfer(address from, address to, uint256 amount) public onlyGame {
	_transfer(from, to, amount);
  }

  function gameApprove(address spender, uint256 amount) public onlyGame returns (bool) {
    _approve(_msgSender(), spender, amount);
    return true;
  }
}
