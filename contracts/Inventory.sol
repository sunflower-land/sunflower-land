// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "./GameOwner.sol";

struct MintInput {
    address to;
    uint256[] ids;
    uint256[] amounts;
    bytes data;
}

contract SunflowerLandInventory is ERC1155Pausable, GameOwner {
    address private game;

    constructor() ERC1155("https://sunflower-land/api/item/{id}.json") payable {}

    function passGameRole(address _game) public onlyOwner returns (bool) {
        game = _game;

        return true;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function gameMint(
        MintInput memory input
    ) public onlyGame {
        _mintBatch(input.to, input.ids, input.amounts, input.data);
    }

    function gameBurn(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public onlyGame {
        _burnBatch(to, ids, amounts);
    }

    function gameTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyGame {
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function gameSetApproval(
        address owner,
        address operator,
        bool approved
    ) internal virtual onlyGame {
        _setApprovalForAll(owner, operator, approved);
    }
}