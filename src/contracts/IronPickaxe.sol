// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Minter.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract IronPickAxe is ERC20, ERC20Burnable, Minter {
  address private immutable owner;

  constructor() payable ERC20("Sunflower Land Iron PickAxe", "SLIP") {
    minter = msg.sender;
    owner = msg.sender;
  }
  
  function getOwner() public view returns (address) {
      return owner;
  }

  function mint(address account, uint256 amount) public onlyMinter {
	_mint(account, amount);
	}

  function burn(address account, uint256 amount) public {
	_burn(account, amount);
  }
}
