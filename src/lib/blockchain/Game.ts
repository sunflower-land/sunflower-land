import { CONFIG } from "lib/config";
import Web3 from "web3";
import { AbiItem, fromWei } from "web3-utils";
import GameABI from "./abis/SunflowerLandGame.json";
import { estimateGasPrice, parseMetamaskError } from "./utils";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { getNextSessionId, getSessionId } from "./Session";
import { SunflowerLandGame } from "./types/SunflowerLandGame";

const address = CONFIG.GAME_CONTRACT;

type ProgressData = {
  mintIds: number[];
  mintAmounts: string[];
  burnIds: number[];
  burnAmounts: string[];
  wearableIds: number[];
  wearableAmounts: number[];
  wearableBurnIds: number[];
  wearableBurnAmounts: number[];
  tokens: string;
};

export type SyncProgressArgs = {
  web3: Web3;
  account: string;
  signature: string;
  sender: string;
  farmId: number;
  deadline: number;
  sessionId: string;
  nextSessionId: string;
  progress: ProgressData;
  fee: string;
  purchase: {
    name: string;
    amount: number;
  };
};

export async function syncProgress({
  web3,
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  progress,
  fee,
  purchase,
}: SyncProgressArgs): Promise<string> {
  const oldSessionId = await getSessionId(web3, farmId);
  const gasPrice = await estimateGasPrice(web3);

  await new Promise((resolve, reject) => {
    (
      new web3.eth.Contract(
        GameABI as AbiItem[],
        address as string,
      ) as unknown as SunflowerLandGame
    ).methods
      .syncProgress({
        signature,
        farmId,
        deadline,
        sessionId,
        nextSessionId,
        progress,
        fee,
      })
      .send({ from: account, value: fee, gasPrice })
      .on("error", function (error: any) {
        const parsed = parseMetamaskError(error);
        reject(parsed);
      })
      .on("transactionHash", async (transactionHash: any) => {
        if (purchase) {
          // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?sjid=11955999175679069053-AP&client_type=gtag#purchase
          onboardingAnalytics.logEvent("purchase", {
            currency: "MATIC",
            // Unique ID to prevent duplicate events
            transaction_id: `${sessionId}-${farmId}`,
            value: Number(fromWei(fee)),
            items: [
              {
                item_id: purchase.name.split(" ").join("_"),
                item_name: purchase.name,
                quantity: purchase.amount,
              },
            ],
          });
        }

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
      });
  });

  const newSessionId = await getNextSessionId(
    web3,
    account,
    farmId,
    oldSessionId,
  );
  return newSessionId;
}
