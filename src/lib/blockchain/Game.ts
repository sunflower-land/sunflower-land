import { CONFIG } from "lib/config";
import { fromWei } from "web3-utils";
import GameABI from "./abis/SunflowerLandGame.json";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { getNextSessionId, getSessionId } from "./Session";
import { writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

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
  const oldSessionId = await getSessionId(farmId);

  await writeContract(config, {
    abi: GameABI,
    functionName: "syncProgress",
    address,
    args: [
      {
        signature,
        farmId,
        deadline,
        sessionId,
        nextSessionId,
        progress,
        fee,
      },
    ],
  });

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

  return await getNextSessionId(account, farmId, oldSessionId);
}
