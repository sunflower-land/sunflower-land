import { CONFIG } from "lib/config";
import BumpkinDetailsABI from "./abis/BumpkinDetails";
import { readContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon, polygonAmoy } from "viem/chains";

const address = CONFIG.BUMPKIN_DETAILS_CONTRACT;

export type OnChainBumpkin = {
  tokenId: bigint;
  tokenURI: string;
  owner: string;
  createdAt: bigint;
  createdBy: string;
  wardrobe: `0x${string}`;
};

export async function loadBumpkins(
  account: `0x${string}`,
): Promise<OnChainBumpkin[]> {
  return (await readContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: BumpkinDetailsABI,
    address: address as `0x${string}`,
    functionName: "loadBumpkins",
    args: [account],
    account,
  })) as OnChainBumpkin[];
}
