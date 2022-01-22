import Web3 from "web3";
import { AbiItem } from "web3-utils";
import FarmABI from "./abis/Farm.json";

type FarmAccount = {
  account: string;
  owner: string;
  tokenId: number;
};

/**
 * Farm NFT contract
 */
export class Farm {
  private web3: Web3;
  private account: string;

  private farm: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.farm = new this.web3.eth.Contract(
      FarmABI as AbiItem[],
      // Testnet
      "0x7f6279D037587d647b529F1C6ACA43E4E314d392"
    );
  }

  // TODO - simplify the smart contract to fetch this in 1 call
  public async getFarms(): Promise<FarmAccount[]> {
    const accounts = await this.farm.methods
      .getFarms(this.account)
      .call({ from: this.account });

    return accounts;
  }
}
