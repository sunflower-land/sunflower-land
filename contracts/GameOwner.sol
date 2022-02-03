// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";


contract GameOwner is Ownable {
  mapping (address => bool) gameRoles;

  function addGameRole(address _game) public onlyOwner {
      gameRoles[_game] = true;
  }

  function removeGameRole(address _game) public onlyOwner {
      gameRoles[_game] = false;
  }

  modifier onlyGame {
    require(gameRoles[_msgSender()] == true, "SunflowerLandToken: You are not the game");
    _;
  }

}