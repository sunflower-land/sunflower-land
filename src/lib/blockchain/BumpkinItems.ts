import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BumpkinItemsJSON from "./abis/BumpkinItems.json";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
import { BumpkinItems as IBumpkinItems } from "./types/BumpkinItems";

const address = CONFIG.INVENTORY_CONTRACT;

/**
 * Inventory contract
 */
export class BumpkinItems {
  private web3: Web3;
  private account: string;

  private contract: IBumpkinItems;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      BumpkinItemsJSON as AbiItem[],
      address as string
    ) as unknown as IBumpkinItems;
  }

  public async loadSupplyBatch(ids: number[], attempts = 0): Promise<string[]> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const supplies: string[] = await this.contract.methods
        .totalSupplyBatch(ids)
        .call({ from: this.account });

      return supplies;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.loadSupplyBatch(ids, attempts + 1);
      }

      throw error;
    }
  }
}
