The purpose of this directory is collaborate on the smart contracts which power the game.

**Disclaimer**

These contracts are used for educational purposes only. If you wish to use these in production do so at your own risk.

These contracts are not yet deployed and are a work in progress.

**Testnet addresses**

```
TESTNET_GAME_ADDRESS = "0xD0020634bC7146fA7cA305EA04dE184Fc474b51E";
TESTNET_TOKEN_ADDRESS = "0x74909542f6Aa557eC1ef30e633F3d027e18888E2";
TESTNET_FARM_ADDRESS = "0x7f6279D037587d647b529F1C6ACA43E4E314d392";
TESTNET_INVENTORY_ADDRESS = "0x28f123423a76443D45e4BA96A512ffd42759BBCb";
```

# Problems with Sunflower Farmers design

Sunflower Farmers was a great game, but the contract design was not perfect.

The main flaws included:

- There was no anti-botting mechanism
- Gas fees were high
- Users needed to frequently save to the Blockchain

The team and community aim to improve on this issues in the design of the Sunflower Land contracts. The industry standard approach is to introduce a mix of off-chain data and off chain verification to combat these issues.

# Architecture

Sunflower Land has 3 core contracts:

- `Token.sol` - The ERC20 SFL token
- `Inventory.sol` - The ERC1155 contract that holds NFTs, tools, resources etc.
- `Farm.sol` - The ERC721 NFT representation of the Farm

Each of these contracts acts as the data storage of the farms on the Blockchain. They perform very little business logic and instead pass minting rights over to the `Game` role.

_Game Role_

The team will deploy a Game Role contract with the following responsibilities:

- Verifying transactions
- Managing sessions
- Minting items in Token, Inventory and Farm

`SunflowerLand.sol` is an example of the first implementation of these behaviours. It orchestrates the minting (and burning) of tokens, inventory items and farm NFTs.

The Game Role will be **mutable** - this ensures that we can make continuous iterations and fix any known problems.

_Data Flow_

While the user is playing the game all of their data will be stored off-chain. When the player is ready to sync their data to the blockchain they make a request to the game server, which signs off on a transaction which includes their latest data. This signed transaction is sent to SunflowerLand.sol which verifies and then orchestrates the change of values in the respective contracts.

![SaveFlow drawio](https://user-images.githubusercontent.com/11745561/151601090-e5196d83-5da0-4e6d-8f73-86928a833e17.png)

## Farm.sol

This contract follows ERC721 guidelines and acts as a representation of a user's farm.

**Farm created**

When a user donates and plays the game, a Farm NFT is minted against their account. When this Farm is minted, we also deploy a `FarmHolder` smart contract. This is a very basic contract which is important for 2 reasons

1. It has an identifiable address on the Blockchain
2. It can hold the ERC20 token and ERC1155 inventory items that are sent to it.

When a user plays the game, the tokens and resources they earn are actually send to the farm's address. This means if they transfer the farm, all of the resources on it will be transferred as well.

## Token.sol

A basic ERC20 implementation = Simplicity is key. It is worth noting that this contract is pausable. In the event of an issue arising, the team would pause the transfer of tokens and fix the root cause.

## Inventory.sol

An basic ERC1155 which holds all of the in game items. This includes:

- NFTs
- Tools
- Resources

## SunflowerLand.sol

The _game role_. This contract verifies and manages user sessions.

_Sessions_

Whenever a farm is saved or tokens are withdrawn, we create a new session ID for the farm. This enables the game to identify when something in the game is out of sync with the Blockchain. It is also used to prevent double spends.

You can view these checks in `save` and `withdraw`

```
// Check the session is new or has not changed (already saved or withdrew funds)
bytes32 farmSessionId = sessions[farmId];
require(
    farmSessionId == sessionId,
    "SunflowerLand: Session has changed"
);

// Start a new session
sessions[farmId] = generateSessionId(farmId);
```

_Farm IDs_

For simplicity, you pass your `Farm.sol` NFT `tokenId` to the functions in this contract. This enables `SunflowerLand.sol` to:

1. Verify you are the owner of the NFT (`ownerOf`)
2. Get the blockchain address to send items to (`getFarm`)

**Verification**

`SunflowerLand.sol` uses the `ECDSA` implementation of encrypting signed transactions. It ensures that the data being sent is real and has come from the game engine.
