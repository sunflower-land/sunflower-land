import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BuySFLAbi from "./abis/BuySFL.json";
import { BuySFL as IBuySFL } from "./types/BuySFL";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.BUY_SFL_CONTRACT;

interface BuySFLArgs {
  signature: string;
  farmId: number;
  amountOutMin: number;
  deadline: number;
  feePercent: number;
  matic: number;
}

/*
 * Bumpkin details contract
 */
export class BuySFL {
  private web3: Web3;
  private account: string;

  private contract: IBuySFL;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;

    this.contract = new this.web3.eth.Contract(
      BuySFLAbi as AbiItem[],
      address as string
    ) as unknown as IBuySFL;
  }

  public async buySFL({
    signature,
    farmId,
    amountOutMin,
    deadline,
    feePercent,
    matic,
  }: BuySFLArgs) {
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .swap(signature, farmId, amountOutMin, deadline, feePercent)
        .send({ from: this.account, value: matic, gasPrice })
        .on("error", function (error: any) {
          console.log({ error });
          const parsed = parseMetamaskError(error);

          reject(parsed);
        })
        .on("transactionHash", async (transactionHash: any) => {
          console.log({ transactionHash });
          try {
            // Sequence wallet doesn't resolve the receipt. Therefore
            // We try to fetch it after we have a tx hash returned
            // From Sequence.
            const receipt: any = await this.web3.eth.getTransactionReceipt(
              transactionHash
            );

            if (receipt) resolve(receipt);
          } catch (e) {
            reject(e);
          }
        })
        .on("receipt", function (receipt: any) {
          resolve(receipt);
        });
    });
  }
}
