import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import TraderJSON from "./abis/Trader.json";

const address = CONFIG.TRADER_CONTRACT;

/**
 * Trader contract
 */
export class Trader {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      TraderJSON as AbiItem[],
      address as string
    );
  }

  public async getListing(id: number) {
    const testListing = await this.contract.methods
      .listings(id)
      .call({ from: this.account });

    console.log({ testListing });
  }
}
