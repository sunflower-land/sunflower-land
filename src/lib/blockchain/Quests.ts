import Web3 from "web3";
import { AbiItem } from "web3-utils";
import ABI from "./abis/Quest.json";
import { CONFIG } from "lib/config";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { BumpkinQuest } from "./types/BumpkinQuest";

const address = CONFIG.QUEST_CONTRACT;

export async function hasCompletedQuest(
  web3: Web3,
  account: string,
  questIds: number[],
  bumpkinId: number,
  attempts = 0,
): Promise<boolean[]> {
  await new Promise((res) => setTimeout(res, 3000 * attempts));

  try {
    const statues: boolean[] = await (
      new web3.eth.Contract(
        ABI as AbiItem[],
        address as string,
      ) as unknown as BumpkinQuest
    ).methods
      .questStatuses(questIds, bumpkinId)
      .call({ from: account });

    return statues;
  } catch (e) {
    const error = parseMetamaskError(e);
    if (attempts < 3) {
      return hasCompletedQuest(
        web3,
        account,
        questIds,
        bumpkinId,
        attempts + 1,
      );
    }

    throw error;
  }
}

export async function mintQuestItemOnChain({
  web3,
  account,
  questId,
  bumpkinId,
  deadline,
  signature,
}: {
  web3: Web3;
  account: string;
  questId: number;
  bumpkinId: number;
  deadline: number;
  signature: string;
}): Promise<void> {
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        ABI as AbiItem[],
        address as string,
      ) as unknown as BumpkinQuest
    ).methods
      .mint(signature, questId, bumpkinId, deadline)
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        // eslint-disable-next-line no-console
        console.log({ error });
        const parsed = parseMetamaskError(error);
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        // eslint-disable-next-line no-console
        console.log({ transactionHash });
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt: any =
            await web3.eth.getTransactionReceipt(transactionHash);

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
