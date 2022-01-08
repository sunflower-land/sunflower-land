// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;


// Example NFT contract
import "./Minter.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC721/ERC721.sol";

contract Armor is ERC721, Minter {
  address private owner;

  constructor() payable ERC721("Armour", "ARM") {
    minter = msg.sender;
    owner = msg.sender;
  }
  
  function getOwner() public view returns (address) {
      return owner;
  }

  function mint(address account, uint256 tokenId) public onlyMinter{
    _safeMint(account, tokenId, "");
  }

  function burn(address account, uint256 amount) public onlyMinter {
	_burn(amount);
  }
  
    function transferFrom(
        address sender,
        address recipient,
        uint256 tokenId
    ) public virtual override onlyMinter {
        _transfer(sender, recipient, tokenId);
    }

}
