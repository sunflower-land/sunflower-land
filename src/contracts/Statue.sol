// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC20/ERC20Burnable.sol";


contract Stone is ERC20, ERC20Burnable {
    constructor(address _proxyRegistryAddress) TradeableERC721Token("Sunflower Farmers Statue", "SFS", _proxyRegistryAddress) public {  }

  function baseTokenURI() public view returns (string memory) {
    return "https://sunflower-farmers/";
  }
}
