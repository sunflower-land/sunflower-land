import Web3 from "web3";
import { AbiItem } from "web3-utils";
import ABI from "./abis/Quest.json";
import { CONFIG } from "lib/config";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { BumpkinQuest } from "./types/BumpkinQuest";

const address = CONFIG.QUEST_CONTRACT;

/**
 * Inventory contract
 */
export class QuestContract {
  private web3: Web3;
  private account: string;

  private contract: BumpkinQuest;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      ABI as AbiItem[],
      address as string
    ) as unknown as BumpkinQuest;
  }

  public async hasCompletedQuest(
    questIds: number[],
    bumpkinId: number,
    attempts = 0
  ): Promise<boolean[]> {
    await new Promise((res) => setTimeout(res, 3000 * attempts));

    try {
      const statues: boolean[] = await this.contract.methods
        .questStatuses(questIds, bumpkinId)
        .call({ from: this.account });

      return statues;
    } catch (e) {
      const error = parseMetamaskError(e);
      if (attempts < 3) {
        return this.hasCompletedQuest(questIds, bumpkinId, attempts + 1);
      }

      throw error;
    }
  }

  public async mintQuestItem({
    questId,
    bumpkinId,
    deadline,
    signature,
  }: {
    questId: number;
    bumpkinId: number;
    deadline: number;
    signature: string;
  }): Promise<void> {
    const gasPrice = await estimateGasPrice(this.web3);

    await new Promise((resolve, reject) => {
      this.contract.methods
        .mint(signature, questId, bumpkinId, deadline)
        .send({ from: this.account, gasPrice })
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
