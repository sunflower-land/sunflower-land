// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

contract Minter {
  address public minter;

  event MinterChanged(address indexed from, address to);

  modifier onlyMinter() {
    require(minter==address(0) || msg.sender == minter, "You are not minter");
    _;
  }

  function passMinterRole(address farm) public onlyMinter returns (bool) {
    minter = farm;

    emit MinterChanged(msg.sender, farm);
    return true;
  }
}
