import { CONFIG } from "lib/config";
import BudDepositAbi from "./abis/BudDeposit";
import { writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

const budsDepositAddress = CONFIG.BUD_DEPOSIT_CONTRACT;

export interface DepositArgs {
  account: `0x${string}`;
  farmId: number;
  sfl: string;
  itemIds: number[];
  itemAmounts: string[];
  wearableIds: number[];
  wearableAmounts: number[];
  budIds: number[];
}

export async function depositToFarm({
  account,
  farmId,
  sfl,
  itemIds,
  itemAmounts,
  wearableAmounts,
  wearableIds,
  budIds,
}: DepositArgs) {
  return await writeContract(config, {
    abi: BudDepositAbi,
    address: budsDepositAddress as `0x${string}`,
    functionName: "depositToFarm",
    account,
    args: [
      BigInt(farmId),
      BigInt(sfl),
      itemIds.map(BigInt),
      itemAmounts.map(BigInt),
      wearableIds.map(BigInt),
      wearableAmounts.map(BigInt),
      budIds.map(BigInt),
    ],
  });
}
