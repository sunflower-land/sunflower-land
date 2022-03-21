import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BetaJSON from "./abis/Beta.json";
import { estimateGasPrice } from "./utils";

const address = CONFIG.BETA_CONTRACT;

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
      address as string
    );
  }

  public async createFarm({
    signature,
    charity,
    donation,
  }: {
    signature: string;
    charity: string;
    donation: number;
  }): Promise<string> {
    const gasPrice = await estimateGasPrice(this.web3);

    return new Promise((resolve, reject) => {
      this.contract.methods
        .createFarm(signature, charity, donation)
        .send({ from: this.account, value: donation, gasPrice })
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
