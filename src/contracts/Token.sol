// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract Token is ERC20, ERC20Burnable {
  address public minter;

  //add minter changed event
  event MinterChanged(address indexed from, address to);

  constructor() payable ERC20("Fruit Market Coin", "FMC") {
    minter = msg.sender;
  }

  //Add pass minter role function
  function passMinterRole(address dBank) public returns (bool) {
    require(msg.sender==minter, "You are not minter");
    minter = dBank;

    emit MinterChanged(msg.sender, dBank);
    return true;
  }

  function mint(address account, uint256 amount) public {
    require(msg.sender == minter, "You are not the minter");
		_mint(account, amount);
	}

  function burn(address account, uint256 amount) public {
    require(msg.sender == minter, "You are not the minter");
		_burn(account, amount);
	}
}
