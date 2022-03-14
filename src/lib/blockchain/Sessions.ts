import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import Web3 from "web3";
import { AbiItem, toWei } from "web3-utils";
import SessionABI from "./abis/Session.json";
import { metamask } from "./metamask";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.SESSION_CONTRACT;

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

  public async getSessionId(farmId: number, attempts = 0): Promise<string> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const sessionId = await this.contract.methods
        .getSessionId(farmId)
        .call({ from: this.account });

      return sessionId;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getSessionId(farmId, attempts + 1);
      }

      throw error;
    }
  }

  private async getNextSessionId(
    fromBlock: number,
    attempts = 1
  ): Promise<SessionChangedEvent> {
    const options = {
      filter: { account: [this.account] },
      fromBlock: fromBlock,
    };

    return new Promise((res, rej) => {
      // Every 3 seconds ping for the new SessionID
      const timer = setInterval(() => {
        this.contract
          .getPastEvents("SessionChanged", options)
          .then((results: any) => {
            if (results.length > 0) {
              clearInterval(timer);
              res(results[0].returnValues);
            }
          })
          .catch((err: any) => {
            clearInterval(timer);

            // Retry on fails
            if (attempts < 3) {
              console.log({ err });

              return this.getNextSessionId(fromBlock, attempts + 1);
            }
            rej(err);
          });
      }, 3000 * attempts);
    });
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
    const fee = toWei("0.1");

    const blocknumber = await metamask.getBlockNumber();
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
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
        .send({ from: this.account, value: fee, gasPrice })
        .on("error", function (error: any) {
          console.log({ error });
          const parsed = parseMetamaskError(error);
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(blocknumber);
    return newSessionId;
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
    const blocknumber = await metamask.getBlockNumber();
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
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
        .send({ from: this.account, gasPrice })
        .on("error", function (error: any) {
          const parsed = parseMetamaskError(error);
          console.log({ parsedIt: parsed });
          reject(parsed);
        })
        .on("transactionHash", function (transactionHash: any) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt: any) {
          console.log({ receipt });
          resolve(receipt);
        });
    });

    const newSessionId = await this.getNextSessionId(blocknumber);
    return newSessionId;
  }
}
