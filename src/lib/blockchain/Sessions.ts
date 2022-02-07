import Decimal from "decimal.js-light";
import Web3 from "web3";
import { AbiItem, toWei } from "web3-utils";
import SessionABI from "./abis/Session.json";

const address = import.meta.env.VITE_SESSION_CONTRACT;
const NETWORK = import.meta.env.VITE_NETWORK;

/**
 * Sessions contract
 */
export class SessionManager {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      SessionABI as AbiItem[],
      address as string
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
    deadline,
    farmId,
    mintIds,
    mintAmounts,
    burnIds,
    burnAmounts,
    tokens,
  }: {
    signature: string;
    sessionId: string;
    deadline: number;
    // Data
    farmId: number;
    mintIds: number[];
    mintAmounts: number[];
    burnIds: number[];
    burnAmounts: number[];
    tokens: number;
  }) {
    if (NETWORK === "mainnet") {
      throw new Error("NOT IMPLEMENTED");
    }
    return new Promise(async (resolve, reject) => {
      this.contract.methods
        .sync(
          signature,
          sessionId,
          deadline,
          farmId,
          mintIds,
          mintAmounts,
          burnIds,
          burnAmounts,
          tokens
        )
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
