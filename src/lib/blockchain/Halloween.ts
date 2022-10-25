import Web3 from "web3";
import { AbiItem } from "web3-utils";

import { CONFIG } from "lib/config";

import ABI from "./abis/Halloween.json";
import { SunflowerHalloween } from "./types/SunflowerHalloween";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.TRADER_CONTRACT;

/**
 * Halloween contract
 */
export class Halloween {
  private web3: Web3;
  private account: string;

  private contract: SunflowerHalloween;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      ABI as AbiItem[],
      address as string
    ) as unknown as SunflowerHalloween;
  }

  public async hasMinted(farmId: number): Promise<boolean> {
    const mintedAt = await this.contract.methods.mintedAt(farmId).call();
    return Number(mintedAt) > 0;
  }

  public async mint(farmId: number) {
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .mint(farmId)
        .send({ from: this.account, gasPrice })
        .on("error", function (error: any) {
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
  }
}
