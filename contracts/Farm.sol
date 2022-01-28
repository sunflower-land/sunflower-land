// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./GameOwner.sol";

struct Farm {
    address owner;
    address account;
    uint256 tokenId;
}

// Should we make pausable as well?
contract SunflowerLandFarm is ERC721Enumerable, GameOwner {
    /*
     * Each farm has its own contract address deployed
     * This enables the NFT to actually own the resources and tokens
    */
    mapping (uint => address) farms;

    string private baseURI = "https://sunflower-land.com/api/nfts/farm/";

    constructor() ERC721("Sunflower Land Farm", "SLF") {
        gameRoles[msg.sender] = true;
    }

    function setBaseUri(string memory uri) public onlyOwner {
        baseURI = uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }


    function mint(address account) public onlyGame {
        uint256 tokenId = totalSupply() + 1;

        // Create identifiable farm contract
        FarmHolder farm = new FarmHolder();
        farms[tokenId] = address(farm);

        _mint(account, tokenId);
	}

    function gameTransfer(address from, address to, uint256 tokenId) public onlyGame {
        safeTransferFrom(from, to, tokenId, "");
    }

    function gameApprove(address to, uint256 tokenId) public onlyGame {
        _approve(to, tokenId);
    }
    

    function getFarm(uint256 tokenId) public view returns (Farm memory) {
        address account = farms[tokenId];
        address owner = ownerOf(tokenId);

        return Farm({
            account: account,
            owner: owner,
            tokenId: tokenId
        });
    }

    function getFarms(address account) public view returns (Farm[] memory) {
        uint balance = balanceOf(account);

        Farm[] memory accountFarms = new Farm[](balance);
        for (uint i = 0; i < balance; i++) {
            uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
            accountFarms[i] = Farm({
                tokenId: tokenId,
                account: farms[tokenId],
                owner: account
            });
        }

        return accountFarms;
    }
}

contract FarmHolder is ERC165, IERC1155Receiver {
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }
}