import Web3 from "web3";
import { AbiItem } from "web3-utils";
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
      //"0x5101CBCBe1b8D591950B0890609A080a5A1F0830"
      "0x94D0B644ba90602f8fcA74904F72BC67C8FCab47"
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
    mintIds,
    mintAmounts,
    burnIds,
    burnAmounts,
    mintTokens,
    burnTokens,
  }: {
    signature: string;
    sessionId: string;
    farmId: number;
    mintIds: number[];
    mintAmounts: number[];
    burnIds: number[];
    burnAmounts: number[];
    mintTokens: number;
    burnTokens: number;
  }): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this.contract.methods
        .save(
          signature,
          sessionId,
          farmId,
          mintIds,
          mintAmounts,
          burnIds,
          burnAmounts,
          mintTokens,
          burnTokens
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
        });
    });
  }
}
