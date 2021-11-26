// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/access/Ownable.sol";

contract SunflowerFarmersStatue is ERC721, Ownable {
    address public minter;

    constructor() public ERC721("Sunflower Farmers Statue", "SFS") {}

    function passMinterRole(address farm) public returns (bool) {
        require(msg.sender==minter, "You are not minter");
        minter = farm;

        return true;
    }

    function baseTokenURI() public view returns (string memory) {
        return "https://sunflower-farmers.com/play/nfts/statue/";
    }

    function mint(address account, uint256 amount) public {
        require(msg.sender == minter, "You are not the minter");

        uint supply = totalSupply();
        require(supply < 1000, "Only 1000 statues can be minted");


        require(balanceOf(account) < 1, "A farm can only have 1 statue");

        uint256 tokenId = supply + 1;
        _mint(account, tokenId);
	}
}