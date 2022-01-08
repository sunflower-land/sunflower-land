// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC20/ERC20Burnable.sol";


contract Axe is ERC20, ERC20Burnable, Minter {
  address private owner;

  constructor() payable ERC20("Sunflower Land Axe", "SLA") {
    minter = msg.sender;
    owner = msg.sender;
  }
  
  function getOwner() public view returns (address) {
      return owner;
  }

  function mint(address account, uint256 amount) public onlyMinter {
	_mint(account, amount);
	}

  function burn(address account, uint256 amount) public onlyMinter {
	_burn(account, amount);
  }
  
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override onlyMinter returns (bool) {
        _transfer(sender, recipient, amount);
    }
}
