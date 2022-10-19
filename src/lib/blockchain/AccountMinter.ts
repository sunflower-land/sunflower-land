import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import MinterABI from "./abis/AccountMinter.json";
import { AccountMinter as IAccountMinter } from "./types/AccountMinter";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.ACCOUNT_MINTER_CONTRACT;

/**
 * Account minter contract
 */
export class AccountMinter {
  private web3: Web3;
  private account: string;

  private contract: IAccountMinter;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      MinterABI as AbiItem[],
      address as string
    ) as unknown as IAccountMinter;
  }

  public async getCreatedAt(address: string, attempts = 1): Promise<number> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const createdAt = await this.contract.methods
        .farmCreatedAt(address)
        .call({ from: this.account });

      return Number(createdAt);
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.getCreatedAt(address, attempts + 1);
      }

      throw error;
    }
  }

  public async createAccount({
    signature,
    charity,
    deadline,
    fee,
    bumpkinWearableIds,
    bumpkinTokenUri,
  }: {
    signature: string;
    charity: string;
    deadline: number;
    fee: string;
    bumpkinWearableIds: number[];
    bumpkinTokenUri: string;
  }): Promise<string> {
    const gasPrice = await estimateGasPrice(this.web3);

    console.log({
      signature,
      charity,
      deadline,
      fee,
      bumpkinWearableIds,
      bumpkinTokenUri,
    });
    return new Promise((resolve, reject) => {
      this.contract.methods
        .mintAccount(
          signature,
          charity,
          deadline,
          fee,
          bumpkinWearableIds,
          bumpkinTokenUri
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
          console.log({ receipt });
          resolve(receipt);
        });
    });
  }

  public async getMaxSupply(attempts = 0): Promise<number> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    const maxSupply = await this.contract.methods
      .maxSupply()
      .call({ from: this.account });

    return Number(maxSupply);
  }
}
