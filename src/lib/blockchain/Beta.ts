import Decimal from "decimal.js-light";
import Web3 from "web3";
import { AbiItem, toWei } from "web3-utils";
import BetaJSON from "./abis/Beta.json";

/**
 * Beta contract
 */
export class Beta {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      BetaJSON as AbiItem[],
      // Testnet
      "0x38D138b1eaA6c4769401c5A79D86fF484b23DD2d"
    );
  }

  public async createFarm({
    signature,
    charity,
    amount,
  }: {
    signature: string;
    charity: string;
    amount: number;
  }): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this.contract.methods
        .createFarm(signature, charity, amount)
        .send({ from: this.account, value: amount })
        .on("error", function (error: any) {
          console.log({ error });

          reject(error);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
          resolve(receipt);
        });
    });
  }
}
