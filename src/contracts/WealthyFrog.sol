// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract SunflowerWealthyFrog is ERC721, Ownable {
    address public minter;
    uint public totalSupply;

    constructor() public ERC721("Sunflower Wealthy Frog", "SWF") {
        minter = msg.sender;
    }

    function passMinterRole(address farm) public returns (bool) {
        require(msg.sender==minter, "You are not minter");
        minter = farm;

        return true;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(tokenId <= 20);

        return "https://sunflower-farmers.com/play/nfts/wealthyfrog/metadata";
    }


    function mint(address account, uint256 amount) public {
        require(amount == 1);
        require(msg.sender == minter, "You are not the minter");
        require(totalSupply < 20, "Only 20 frogs can be minted");
        require(balanceOf(account) < 1, "A farm can only have 1 frog");

        uint256 tokenId = totalSupply + 1;
        _mint(account, tokenId);

        totalSupply = totalSupply + 1;
	}
}
