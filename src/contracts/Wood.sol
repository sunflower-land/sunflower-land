// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "./Minter.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC20/ERC20Burnable.sol";


contract Wood is ERC20, ERC20Burnable, Minter {
  // How long it takes
  uint constant RECOVERY_SECONDS = 3600;
  // How much wood a tree has
  uint constant STRENGTH = 10 * (10**18);
  
  mapping(address => uint) recoveryTime;

  constructor() payable ERC20("Sunflower Land Wood", "SLW") {
    minter = msg.sender;
  }

  function premine(address account, uint256 amount) public onlyMinter {
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
        
        return true;
    }
    
    function getAvailable(address account) public view returns (uint) {
        uint recoveredAt = recoveryTime[account];
        
        if (block.timestamp > recoveredAt) {
            return STRENGTH;
        }
        
        // A portion of the resource is available
        uint difference = recoveredAt - block.timestamp;
        uint secondsRecovered = RECOVERY_SECONDS - difference;
        
        return STRENGTH * secondsRecovered / RECOVERY_SECONDS;
    }
    
    function getRecoveryTime(address account) public view returns (uint) {
        return recoveryTime[account];
    }
    
    function stake(address account, uint amount) public onlyMinter {
        uint available = getAvailable(account);
        require(available >= amount, "The wood has not replenished");
        
        uint newAvailable = available - amount;
        uint amountToRecover = STRENGTH - newAvailable;

        // How long it will take to get back to full strength
        uint timeToRecover = (RECOVERY_SECONDS * amountToRecover) / STRENGTH;
        recoveryTime[account] = block.timestamp + timeToRecover;

        // Pseudo random multiplier
        uint multiplier = 3;
        
        // Total supply is even, increase multiplier
        uint circulatingSupply = totalSupply() / (10 ** 18);
        if (circulatingSupply % 2 == 0) {
            multiplier +=1;
        }
        
        // Seconds are even, increase multiplier
        if ((block.timestamp / 10) % 2 == 0) {
            multiplier +=1;
        }
        
        _mint(account, amount * multiplier);
    }
}
