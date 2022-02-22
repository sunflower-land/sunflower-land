import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BetaJSON from "./abis/Beta.json";

const address = CONFIG.BETA_CONTRACT;
const MINIMUM_GAS_PRICE = 40;

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

  public async estimate(incr = 1) {
    const e = await this.web3.eth.getGasPrice();
    let gasPrice = e ? Number(e) * incr : undefined;
    const minimum = MINIMUM_GAS_PRICE * 1000000000;
    if (!gasPrice || gasPrice < minimum) {
      gasPrice = minimum;
    }
    console.log({ gasPrice });
    return gasPrice;
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
    const gasPrice = await this.estimate();
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
