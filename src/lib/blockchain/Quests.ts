import Web3 from "web3";
import { AbiItem } from "web3-utils";
import ABI from "./abis/Quest.json";
import { CONFIG } from "lib/config";
import { parseMetamaskError } from "./utils";
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
}
