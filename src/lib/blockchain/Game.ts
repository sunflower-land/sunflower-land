import { CONFIG } from "lib/config";
import { fromWei } from "web3-utils";
import GameABI from "./abis/SunflowerLandGame";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { getNextSessionId, getSessionId } from "./Session";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
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
  account: `0x${string}`;
  signature: `0x${string}`;
  sender: `0x${string}`;
  farmId: number;
  deadline: number;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
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

  const hash = await writeContract(config, {
    abi: GameABI,
    functionName: "syncProgress",
    address,
    args: [
      {
        signature,
        farmId: BigInt(farmId),
        deadline: BigInt(deadline),
        sessionId,
        nextSessionId,
        progress: {
          mintIds: progress.mintIds.map(BigInt),
          mintAmounts: progress.mintAmounts.map(BigInt),
          burnIds: progress.burnIds.map(BigInt),
          burnAmounts: progress.burnAmounts.map(BigInt),
          wearableIds: progress.wearableIds.map(BigInt),
          wearableAmounts: progress.wearableAmounts.map(BigInt),
          wearableBurnIds: progress.wearableBurnIds.map(BigInt),
          wearableBurnAmounts: progress.wearableBurnAmounts.map(BigInt),
          tokens: BigInt(progress.tokens),
        },
        fee: BigInt(fee),
      },
    ],
    account,
  });
  await waitForTransactionReceipt(config, { hash });

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
