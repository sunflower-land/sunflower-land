export default [
  {
    inputs: [
      {
        internalType: "contract Bumpkin",
        name: "_bumpkinContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_game", type: "address" }],
    name: "addGameRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_game", type: "address" }],
    name: "gameAddGameRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_game", type: "address" }],
    name: "gameRemoveGameRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "gameRoles",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "getBumpkin",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "string", name: "tokenURI", type: "string" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "address", name: "createdBy", type: "address" },
          { internalType: "address", name: "wardrobe", type: "address" },
        ],
        internalType: "struct BumpkinDetails.Bumpkin",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" },
    ],
    name: "getBumpkinBatch",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "string", name: "tokenURI", type: "string" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "address", name: "createdBy", type: "address" },
          { internalType: "address", name: "wardrobe", type: "address" },
        ],
        internalType: "struct BumpkinDetails.Bumpkin[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_bumpkinOwner", type: "address" },
    ],
    name: "loadBumpkins",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "string", name: "tokenURI", type: "string" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "address", name: "createdBy", type: "address" },
          { internalType: "address", name: "wardrobe", type: "address" },
        ],
        internalType: "struct BumpkinDetails.Bumpkin[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_bumpkinOwners",
        type: "address[]",
      },
    ],
    name: "loadBumpkinsBatch",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "string", name: "tokenURI", type: "string" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "address", name: "createdBy", type: "address" },
          { internalType: "address", name: "wardrobe", type: "address" },
        ],
        internalType: "struct BumpkinDetails.Bumpkin[][]",
        name: "",
        type: "tuple[][]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_game", type: "address" }],
    name: "removeGameRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      {
        components: [
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "address", name: "createdBy", type: "address" },
          { internalType: "address", name: "wardrobe", type: "address" },
        ],
        internalType: "struct BumpkinDetails.Details",
        name: "_details",
        type: "tuple",
      },
    ],
    name: "updateBumpkinDetails",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" },
      {
        components: [
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "address", name: "createdBy", type: "address" },
          { internalType: "address", name: "wardrobe", type: "address" },
        ],
        internalType: "struct BumpkinDetails.Details[]",
        name: "_details",
        type: "tuple[]",
      },
    ],
    name: "updateBumpkinDetailsBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
