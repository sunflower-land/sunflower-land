import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import FarmMinterABI from "./abis/FarmMinter.json";
import { SunflowerLandFarmMinter } from "./types/SunflowerLandFarmMinter";
import { estimateGasPrice, parseMetamaskError } from "./utils";

const address = CONFIG.FARM_MINTER_CONTRACT;

/**
 * Bumpkin minter contract
 */
export class BumpkinMinter {
  private web3: Web3;
  private account: string;

  // TODO
  private contract: SunflowerLandFarmMinter;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;

    // TODO
    this.contract = new this.web3.eth.Contract(
      FarmMinterABI as AbiItem[],
      address as string
    ) as unknown as SunflowerLandFarmMinter;
  }

  public async createBumpkin({
    signature,
    deadline,
  }: {
    signature: string;
    deadline: number;
    fee: string;
    partIds: number[];
    farmId: number;
    tokenUri: string;
  }): Promise<string> {
    const gasPrice = await estimateGasPrice(this.web3);

    return new Promise((resolve, reject) => {
      this.contract.methods
        .createBumpkin(signature, deadline, fee, farmId, partIds, tokenUri)
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
