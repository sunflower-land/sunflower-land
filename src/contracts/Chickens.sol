// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract Egg is ERC20, ERC20Burnable {
  address private _farm;
  address private _chicken;


  event MinterChanged(address indexed from, address to);

  constructor(address farm) payable ERC20("Sunflower Land Eggs", "SLE") {
    _farm = farm;
    _chicken = msg.sender;
  }

  function passMinterRole(address chicken) public returns (bool) {
    require(msg.sender==_chicken, "You are not the chicken");
    _chicken = chicken;

    return true;
  }

  function mint(address account, uint256 amount) public {
    require(msg.sender == _chicken, "You are not a chicken");

	  _mint(account, amount);
	}

  function burn(address account, uint256 amount) public {
    require(msg.sender == _farm, "You are not the farm");
	  _burn(account, amount);
  }
}

contract Chicken is ERC20, ERC20Burnable {
  address private _minter;
  address private _coop;
  address private _egg;

  mapping(address => uint) _hatchedAt;

  constructor(address coop, address egg) payable ERC20("Sunflower Land Chicken", "SLC") {
    _coop = coop;
    _minter = msg.sender;
    _egg = egg;
  }

  function passMinterRole(address farm) public returns (bool) {
    require(msg.sender==_minter, "You are not minter");
    _minter = farm;

    return true;
  }

  function mint(address account, uint256 amount) public {
    require(msg.sender == _minter, "You are not the farm");

	  _mint(account, amount);
	}

  function hatchTime(address account) public returns (uint) {
    return _hatchedAt[msg.sender];
  }

  function collectEggs() public {
    uint chickens = super.balanceOf(msg.sender);
    require(chickens > 0, "You have no chickens");
    require(block.timestamp - _hatchedAt[msg.sender] > 60 * 60 * 24, "You have to wait 24 hours before you can collect eggs");

    // It is actually ERC721 but same principle
    uint coop = ERC20(_coop).balanceOf(msg.sender);

    uint multiplier = 1;
    if (coop >= 1) {
      multiplier = 3;
    }

    _hatchedAt[msg.sender] = block.timestamp;

    Egg(_egg).mint(msg.sender, chickens * multiplier);
  }

  function burn(address account, uint256 amount) public {
    require(msg.sender == _minter, "You are not the farm");
	  _burn(account, amount);
  }

  function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
      require(false, "The chickens like this farm and won't move!");
      return false;
  }

  function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
      require(false, "The chickens like this farm and won't move!");

      return false;
    }
}
