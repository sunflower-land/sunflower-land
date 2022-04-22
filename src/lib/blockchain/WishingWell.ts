import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem, fromWei, toWei } from "web3-utils";
import WishingWellJSON from "./abis/WishingWell.json";
import { estimateGasPrice } from "./utils";

const address = CONFIG.WISHING_WELL_CONTRACT;

/**
 * WishingWell contract
 */
export class WishingWell {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      WishingWellJSON as AbiItem[],
      address as string
    );
  }

  public async wish() {
    const gasPrice = await estimateGasPrice(this.web3);
    return new Promise((resolve, reject) => {
      this.contract.methods
        .wish()
        .send({ from: this.account, gasPrice })
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

  public async collectFromWell({
    signature,
    tokens,
    deadline,
  }: {
    signature: string;
    tokens: string;
    deadline: number;
  }) {
    const gasPrice = await estimateGasPrice(this.web3);

    return new Promise((resolve, reject) => {
      this.contract.methods
        .collectFromWell(signature, tokens, deadline)
        .send({ from: this.account, gasPrice })
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

  public async getBalance() {
    const balance = await this.contract.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    console.log({ balance });
    return balance;
  }

  public async canCollect(): Promise<boolean> {
    const canCollect = await this.contract.methods
      .canCollect(this.account)
      .call({ from: this.account });

    return canCollect;
  }

  public async lastCollected(): Promise<number> {
    const lastUpdatedAt = await this.contract.methods
      .lastUpdatedAt(this.account)
      .call({ from: this.account });

    return lastUpdatedAt;
  }
}
