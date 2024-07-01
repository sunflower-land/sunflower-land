import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BumpkinDetailsABI from "./abis/BumpkinDetails.json";
import { BumpkinDetails as IBumpkinDetails } from "./types/BumpkinDetails";

const address = CONFIG.BUMPKIN_DETAILS_CONTRACT;

export type OnChainBumpkin = {
  tokenId: string;
  tokenURI: string;
  owner: string;
  createdAt: string;
  createdBy: string;
  nonce: string;
  metadata: string;
  wardrobe: string;
};

export async function loadBumpkins(
  web3: Web3,
  account: string,
): Promise<OnChainBumpkin[]> {
  return (
    new web3.eth.Contract(
      BumpkinDetailsABI as AbiItem[],
      address as string,
    ) as unknown as IBumpkinDetails
  ).methods
    .loadBumpkins(account)
    .call({ from: account });
}
