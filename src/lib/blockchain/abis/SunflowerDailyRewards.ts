export default [
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "counts",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "count", type: "uint8" }],
    name: "reward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
