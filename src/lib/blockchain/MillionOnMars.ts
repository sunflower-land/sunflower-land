/**
 * A cross chain cross-over!
 */
import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import MillionOnMarsABI from "./abis/MillionOnMars.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.MOM_CONTRACT;

/**
 * Million on Mars NFT contract
 */
export class MillionOnMars {
  private web3: Web3;
  private account: string;

  private contract: any;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      MillionOnMarsABI as AbiItem[],
      address as string
    );
  }

  /**
   * Once a user has completed the mission on Million on Mars, they will have an NFT
   */
  public async hasCompletedMission(): Promise<boolean> {
    const amount = await this.contract.methods.balanceOf(this.account).call();
    return Number(amount) > 0;
  }

  /**
   * Trade the MoM NFT for a Sunflower Land Observatory
   * Players must sync after trading for the observatory to show
   */
  public async trade(farmId: number) {
    const tokenId = await this.contract.methods
      .tokenOfOwnerByIndex(this.account, 0)
      .call();

    const gasPrice = await estimateGasPrice(this.web3);

    return new Promise((resolve, reject) => {
      this.contract.methods
        .trade(tokenId, farmId)
        .send({ from: this.account, gasPrice })
        .on("error", function (error: any) {
          console.log({ error });

          reject(parseMetamaskError(error));
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
