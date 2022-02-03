import Decimal from "decimal.js-light";
import Web3 from "web3";
import { AbiItem, toWei } from "web3-utils";
import SunflowerLandABI from "./abis/SunflowerLand.json";

/**
 * Sunflower Land contract
 */
export class SunflowerLand {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      SunflowerLandABI as AbiItem[],
      // Testnet
      "0xD0020634bC7146fA7cA305EA04dE184Fc474b51E"
    );
  }

  public async getSessionId(farmId: number): Promise<string> {
    const sessionId = await this.contract.methods
      .getSessionId(farmId)
      .call({ from: this.account });

    return sessionId;
  }

  public async sync({
    signature,
    sessionId,
    farmId,
    sfl,
    ids,
    amounts,
  }: {
    signature: string;
    sessionId: string;
    farmId: number;
    sfl: number[];
    ids: number[];
    amounts: number[];
  }): Promise<string> {
    throw new Error("NOT IMPLEMENTED");
    // return new Promise(async (resolve, reject) => {
    //   this.contract.methods
    //     .save(
    //       signature,
    //       sessionId,
    //       farmId,
    //       mintIds,
    //       mintAmounts,
    //       burnIds,
    //       burnAmounts,
    //       mintTokens,
    //       burnTokens
    //     )
    //     .send({ from: this.account })
    //     .on("error", function (error: any) {
    //       console.log({ error });

    //       reject(error);
    //     })
    //     .on("transactionHash", function (transactionHash: any) {
    //       console.log({ transactionHash });
    //     })
    //     .on("receipt", function (receipt: any) {
    //       console.log({ receipt });
    //       resolve(receipt);
    //     });
    // });
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

  public async withdraw({
    farmId,
    to,
    ids,
    amounts,
    tokens,
  }: {
    farmId: number;
    to: string;
    ids: number[];
    amounts: Decimal[];
    tokens: Decimal;
  }): Promise<string> {
    const weiAmounts = amounts.map((amount) =>
      toWei(amount.toString(), "ether")
    );
    const weiTokens = toWei(tokens.toString(), "ether");

    console.log({ farmId, to, ids, amounts, tokens });
    return new Promise(async (resolve, reject) => {
      this.contract.methods
        .withdraw(farmId, to, ids, weiAmounts, weiTokens)
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
