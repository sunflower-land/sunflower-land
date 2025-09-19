export default [
  {
    inputs: [
      { internalType: "address", name: "_signer", type: "address" },
      {
        internalType: "contract ISunflowerLandSessionManager",
        name: "_session",
        type: "address",
      },
      { internalType: "contract IFarm", name: "farm", type: "address" },
      { internalType: "contract Pet", name: "pet", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ECDSAInvalidSignature", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "length", type: "uint256" }],
    name: "ECDSAInvalidSignatureLength",
    type: "error",
  },
  {
    inputs: [{ internalType: "bytes32", name: "s", type: "bytes32" }],
    name: "ECDSAInvalidSignatureS",
    type: "error",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "executed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "signature", type: "bytes" },
      { internalType: "bytes32", name: "sessionId", type: "bytes32" },
      { internalType: "bytes32", name: "nextSessionId", type: "bytes32" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint256", name: "farmId", type: "uint256" },
      { internalType: "uint256[]", name: "petIds", type: "uint256[]" },
    ],
    name: "withdraw",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
