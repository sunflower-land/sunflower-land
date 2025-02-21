import { CONFIG } from "lib/config";
import GameABI from "./abis/SunflowerLandGame";
import { getNextSessionId, getSessionId } from "./Session";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { saveTxHash } from "features/game/types/transactions";
import { polygon } from "viem/chains";
import { polygonAmoy } from "viem/chains";

const address = CONFIG.GAME_CONTRACT;

export type SyncProgressParams = {
  signature: string;
  sessionId: string;
  nextSessionId: string;
  farmId: number;
  sender: string;
  deadline: number;
  fee: string;
  progress: {
    wearableIds: number[];
    wearableAmounts: number[];
    wearableBurnIds: number[];
    wearableBurnAmounts: number[];
    mintIds: number[];
    mintAmounts: string[];
    burnIds: number[];
    burnAmounts: string[];
    tokens: string;
  };
};

export async function syncProgress({
  sender,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  progress,
  fee,
}: SyncProgressParams): Promise<string> {
  const oldSessionId = await getSessionId(farmId);

  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: GameABI,
    functionName: "syncProgress",
    address,
    args: [
      {
        signature: signature as `0x${string}`,
        farmId: BigInt(farmId),
        deadline: BigInt(deadline),
        sessionId: sessionId as `0x${string}`,
        nextSessionId: nextSessionId as `0x${string}`,
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
    account: sender as `0x${string}`,
  });

  saveTxHash({
    event: "transaction.progressSynced",
    hash,
    deadline,
    sessionId,
  });

  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(sender, farmId, oldSessionId);
}
