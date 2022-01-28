import Web3 from "web3";
import { AbiItem } from "web3-utils";
import FarmABI from "./abis/Legacy.json";

/**
 * Legacy Farm contract used for Beta mode
 */
export class LegacyFarm {
  private web3: Web3;
  private account: string;
  // TODO - any
  private farm: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.farm = new this.web3.eth.Contract(
      FarmABI as AbiItem[],
      "0x6e5Fa679211d7F6b54e14E187D34bA547c5d3fe0"
    );
  }

  public async hasFarm(): Promise<boolean> {
    const fields = await this.farm.methods
      .getLand(this.account)
      .call({ from: this.account });

    return fields.length > 0;
  }
}
