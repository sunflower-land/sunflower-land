import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import FarmMinterABI from "./abis/FarmMinter.json";
import { metamask } from "./metamask";
import { SunflowerLandFarmMinter } from "./types/SunflowerLandFarmMinter";

const address = CONFIG.FARM_MINTER_CONTRACT;

export type OnChainBumpkin = {
  tokenId: number;
  tokenURI: string;
  owner: string;
  createdAt: number;
  createdBy: string;
  nonce: string;
  metadata: string;
  wardrobe: string;
};

/*
 * Bumpkin details contract
 */
export class BumpkinDetails {
  private web3: Web3;
  private account: string;

  // TODO
  private contract: SunflowerLandFarmMinter;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;

    // TODO
    this.contract = new this.web3.eth.Contract(
      FarmMinterABI as AbiItem[],
      address as string
    ) as unknown as SunflowerLandFarmMinter;
  }

  public async loadBumpkins(): Promise<OnChainBumpkin[]> {
    return [];

    // TODO
    return this.contract.methods
      .loadBumpkins(metamask.myAccount)
      .call({ from: this.account });
  }
}
