// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC20/ERC20Burnable.sol";


contract Wood is ERC20, ERC20Burnable {
  address public minter;
  address private owner;
  
  // Wood replenishes every 6 minutes
  uint RECOVERY_RATE = 6;
  // TODO - decimals?
  uint WOOD_COUNT = 10 * (10**18);
  
  mapping(address => uint) recoveryTime;

  event MinterChanged(address indexed from, address to);

  constructor() payable ERC20("Wood Beta", "Wood") {
    minter = msg.sender;
    owner = msg.sender;
  }

  function passMinterRole(address farm) public returns (bool) {
    require(msg.sender==minter, "You are not minter");
    minter = farm;

    emit MinterChanged(msg.sender, farm);
    return true;
  }
  
  function getOwner() public view returns (address) {
      return owner;
  }


  function burn(address account, uint256 amount) public {
    require(msg.sender == minter, "You are not the minter");
	_burn(account, amount);
  }
  
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        require(msg.sender == minter, "You are not the minter");
        
        _transfer(sender, recipient, amount);
        
        return true;
    }
    
    function getAvailable(address account) public view returns (uint) {
        uint recoveredAt = recoveryTime[account];
        
        if (block.timestamp > recoveredAt) {
            return WOOD_COUNT;
        }
        
        // A portion of the wood is available
        uint difference = recoveredAt - block.timestamp;
        uint available = difference / (RECOVERY_RATE * 60);
        
        return available;
    }
    
    function stake(address account, uint amount) public {
        require(msg.sender == minter, "You are not the minter");
        
        uint availableWood = getAvailable(account);
        require(availableWood >= amount, "The wood has not replenished");
        
        uint left = availableWood - amount;
        uint woodToRecover = WOOD_COUNT - left;
        
        // Recover each piece of wood 
        recoveryTime[account] = block.timestamp + (woodToRecover * RECOVERY_RATE * 60);
        
        
        // TODO: Do proper reflection
        _mint(account, amount * 3);
    }
}
