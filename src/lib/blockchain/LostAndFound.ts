import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import LostAndFoundJSON from "./abis/LostAndFound.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { LostAndFound as ILostAndFound } from "./types/LostAndFound";

const address = CONFIG.LOST_AND_FOUND_CONTRACT;

export async function transferLostItems(
  web3: Web3,
  account: string,
  wearableIds: number[],
  wearableAmounts: number[],
  farmId: number
): Promise<any> {
  const gasPrice = await estimateGasPrice(web3);

  return await new Promise((resolve, reject) =>
    (
      new web3.eth.Contract(
        LostAndFoundJSON as AbiItem[],
        address as string
      ) as unknown as ILostAndFound
    ).methods
      .transferLostItems(wearableIds, wearableAmounts, farmId)
      .send({ from: account, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        try {
          // Sequence wallet doesn't resolve the receipt. Therefore
          // We try to fetch it after we have a tx hash returned
          // From Sequence.
          const receipt = await web3.eth.getTransactionReceipt(transactionHash);

          if (receipt) resolve(receipt);
        } catch (e) {
          reject(e);
        }
      })
      .on("receipt", function (receipt: any) {
        resolve(receipt);
      })
  );
}
