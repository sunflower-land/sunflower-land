import Web3 from "web3";
import { AbiItem } from "web3-utils";
import BumpkinMinterABI from "./abis/BumpkinMinter.json";
import BumpkinABI from "./abis/Bumpkin.json"; // TODO Remove
import { metamask } from "./metamask";
import { BumpkinMinter as IBumpkinMinter } from "./types/BumpkinMinter";
import { estimateGasPrice, parseMetamaskError } from "./utils";

// TODO - currently bumpkin address
const address = "0x74648cbC60333fc46F35E820A8Bd1732394fc8a5";

/**
 * Bumpkin minter contract
 */
export class BumpkinMinter {
  private web3: Web3;
  private account: string;

  private contract: IBumpkinMinter;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;

    // TODO
    this.contract = new this.web3.eth.Contract(
      BumpkinMinterABI as AbiItem[],
      address as string
    ) as unknown as IBumpkinMinter;
  }

  public async createBumpkin({
    signature,
    deadline,
    fee,
    partIds,
    farmId,
    tokenUri,
  }: {
    signature: string;
    deadline: number;
    fee: string;
    partIds: number[];
    farmId: number;
    tokenUri: string;
  }): Promise<string> {
    const gasPrice = await estimateGasPrice(this.web3);

    // Not currently working so using Bumpkin directly
    return new Promise((resolve, reject) => {
      new this.web3.eth.Contract(
        BumpkinABI as AbiItem[],
        "0x74648cbC60333fc46F35E820A8Bd1732394fc8a5"
      ).methods
        .gameMint(metamask.myAccount)
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

    // TODO add tokenURI
    const quanities = partIds.map((_) => 1);
    return new Promise((resolve, reject) => {
      this.contract.methods
        .mintBumpkin(signature, deadline, fee, farmId, partIds, quanities)
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
}
