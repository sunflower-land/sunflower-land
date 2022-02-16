import Web3 from "web3";
import { AbiItem, toWei } from "web3-utils";
import SessionABI from "./abis/Session.json";

const address = import.meta.env.VITE_SESSION_CONTRACT;
const NETWORK = import.meta.env.VITE_NETWORK;

type SessionChangedEvent = {
  owner: string;
  sessionId: string;
  farmId: number;
};
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
  }): Promise<SessionChangedEvent> {
    if (NETWORK === "mainnet") {
      throw new Error("NOT IMPLEMENTED");
    }

    const fee = toWei("0.1");

    const latest = await this.web3.eth.getBlockNumber();
    const options = {
      filter: { account: [this.account] },
      fromBlock: latest,
    };

    return new Promise((resolve, reject) => {
      // We resolve once the session changed event comes through
      const timer = setInterval(() => {
        this.contract
          .getPastEvents("SessionChanged", options)
          .then((results: any) => {
            if (results.length > 0) {
              clearInterval(timer);
              resolve(results[0].returnValues);
            }
          })
          .catch((err: any) => {
            clearInterval(timer);
            console.log({ err });
            reject(err);
          });
      }, 1000);

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
        .send({ from: this.account, value: fee })
        .on("error", function (error: any) {
          console.log({ error });
          clearInterval(timer);

          reject(error);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
        });
    });
  }

  public async withdraw({
    signature,
    sessionId,
    deadline,
    farmId,
    ids,
    amounts,
    tax,
    sfl,
  }: {
    signature: string;
    sessionId: string;
    deadline: number;
    // Data
    farmId: number;
    ids: number[];
    amounts: number[];
    sfl: number;
    tax: number;
  }): Promise<SessionChangedEvent> {
    if (NETWORK === "mainnet") {
      throw new Error("NOT IMPLEMENTED");
    }

    const latest = await this.web3.eth.getBlockNumber();
    const options = {
      filter: { account: [this.account] },
      fromBlock: latest,
    };

    return new Promise((resolve, reject) => {
      // We resolve once the session changed event comes through
      const timer = setInterval(() => {
        this.contract
          .getPastEvents("SessionChanged", options)
          .then((results: any) => {
            if (results.length > 0) {
              clearInterval(timer);
              resolve(results[0].returnValues);
            }
          })
          .catch((err: any) => {
            clearInterval(timer);
            console.log({ err });
            reject(err);
          });
      }, 1000);

      this.contract.methods
        .withdraw(
          signature,
          sessionId,
          deadline,
          farmId,
          ids,
          amounts,
          sfl,
          tax
        )
        .send({ from: this.account })
        .on("error", function (error: any) {
          console.log({ error });
          clearInterval(timer);

          reject(error);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
        });
    });
  }
}
