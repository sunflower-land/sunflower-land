import Web3 from "web3";
import { AbiItem, fromWei } from "web3-utils";
import TokenJSON from "./abis/Token.json";

const address = import.meta.env.VITE_PAIR_CONTRACT;
const wishingWellAddress = import.meta.env.VITE_WISHING_WELL_CONTRACT;

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
      TokenJSON as AbiItem[],
      address as string
    );
  }

  public async balanceOf() {
    const balance: string = await this.contract.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    return Number(fromWei(balance));
  }

  public async approve(amount: number) {
    return new Promise(async (resolve, reject) => {
      this.contract.methods
        .approve(wishingWellAddress, amount)
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
