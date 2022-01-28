// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


import "./Inventory.sol";
import "./Token.sol";
import "./Farm.sol";

// Do we need Ownable - what would happen if we renounced ownership?

contract SunflowerLand is Ownable {
    using ECDSA for bytes32;

    mapping(bytes32 => bool) public executed;

    // Farm ID to saved timestamp
    mapping(uint => bytes32) public sessions;

    function deposit() external payable {}

    address private signer;
    SunflowerLandInventory inventory;
    SunflowerLandToken token;
    SunflowerLandFarm farm;

    constructor(SunflowerLandInventory _inventory, SunflowerLandToken _token, SunflowerLandFarm _farm) payable {
        inventory = _inventory;
        token = _token;
        farm = _farm;
        signer = _msgSender();
    }

    function transferSigner(address _signer) public onlyOwner {
        signer = _signer;
    }

    // A unique nonce identifer for the account
    function generateSessionId(uint tokenId) public view returns(bytes32) {
        return keccak256(abi.encodePacked(_msgSender(), sessions[tokenId], block.timestamp)).toEthSignedMessageHash();
    }

    function verify(bytes32 hash, bytes memory signature) public view returns (bool) {
        bytes32 ethSignedHash = hash.toEthSignedMessageHash();
        return ethSignedHash.recover(signature) == signer;
    }
    
    function createFarm(
        // Verification
        bytes memory signature,
        // Data
        address charity,
        uint amount
    ) public payable {
        // Verify
        bytes32 txHash = keccak256(abi.encodePacked(charity, amount, _msgSender()));
        require(!executed[txHash], "SunflowerLand: Tx Executed");
        require(verify(txHash, signature), "SunflowerLand: Unauthorised");

        executed[txHash] = true;

        if (amount > 0) {
            (bool sent,) = charity.call{value: amount}("");
            require(sent, "SunflowerLand: Donation Failed");
        }

        farm.mint(_msgSender());
    }

    /**
     * Bring off chain data on chain
     */
    function save(
        // Verification
        bytes memory signature,
        bytes32 sessionId,
        // Data
        uint farmId,
        uint256[] memory mintIds,
        uint256[] memory mintAmounts,
        uint256[] memory burnIds,
        uint256[] memory burnAmounts,
        uint256 mintTokens,
        uint256 burnTokens
    ) public {
        // Check the session is new or has not changed (already saved or withdrew funds)
        bytes32 farmSessionId = sessions[farmId];
        require(
            farmSessionId == sessionId,
            "SunflowerLand: Session has changed"
        );

        // Start a new session
        sessions[farmId] = generateSessionId(farmId);

        // Verify
        bytes32 txHash = keccak256(abi.encodePacked(sessionId, farmId, mintIds, mintAmounts, burnIds, burnAmounts, mintTokens, burnTokens));
        require(!executed[txHash], "SunflowerLand: Tx Executed");
        require(verify(txHash, signature), "SunflowerLand: Unauthorised");
        executed[txHash] = true;

        address farmOwner = farm.ownerOf(farmId);

        // Check they own the farm
        require(
            farmOwner == _msgSender(),
            "SunflowerLand: You do not own this farm"
        );


        // Get the holding address of the farm
        Farm memory farmNFT = farm.getFarm(farmId);

        // Update tokens
        MintInput memory input = MintInput({
            to: farmNFT.account,
            ids: mintIds,
            amounts: mintAmounts,
            data: signature
        });

        inventory.gameMint(input);
        inventory.gameBurn(farmNFT.account, burnIds, burnAmounts);

        if (mintTokens > 0) {
            token.gameMint(farmNFT.account, mintTokens);
        }
        
        if (burnTokens > 0) {
            // Send to the burn address so total supply keeps increasing
            token.gameTransfer(farmNFT.account, 0x000000000000000000000000000000000000dEaD, burnTokens);
        }
    }

    // Withdraw resources from farm to another account
    function withdraw(
        uint256 farmId,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        uint256 tokenAmount
    ) public  {
        // Start a new session
        sessions[farmId] = generateSessionId(farmId);

        address farmOwner = farm.ownerOf(farmId);

        // Check they own the farm
        require(
            farmOwner == _msgSender(),
            "SunflowerLand: You do not own this farm"
        );



        // Get the holding address of the tokens
        Farm memory farmNFT = farm.getFarm(farmId);

        // Withdraw from farm
        inventory.gameTransferFrom(farmNFT.account, to, ids, amounts, "");
        token.gameTransfer(farmNFT.account, to, tokenAmount);
    }

    function getSessionId(uint tokenId) public view returns(bytes32) {
        return sessions[tokenId];
    }
}