import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem, toWei } from "web3-utils";
import PairJSON from "./abis/Pair.json";

const address = CONFIG.PAIR_CONTRACT;
const wishingWellAddress = CONFIG.WISHING_WELL_CONTRACT;

/**
 * Pair contract
 */
export class Pair {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      PairJSON as AbiItem[],
      address as string
    );
  }

  public async getBalance() {
    const balance: string = await this.contract.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    return balance;
  }

  public async mintTestnetTokens() {
    const amount = toWei("100");
    return new Promise((resolve, reject) => {
      this.contract.methods
        .mint(this.account, amount)
        .send({ from: this.account })
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
