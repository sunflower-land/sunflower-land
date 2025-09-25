import { CONFIG } from "lib/config";
import BudDepositAbi from "./abis/BudDeposit";
import DepositV2Abi from "./abis/DepositV2";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon } from "viem/chains";
import { polygonAmoy } from "viem/chains";
import { INITIAL_FARM } from "features/game/lib/constants";
import { hasFeatureAccess } from "lib/flags";

export interface DepositArgs {
  account: `0x${string}`;
  farmId: number;
  sfl: string;
  itemIds: number[];
  itemAmounts: string[];
  wearableIds: number[];
  wearableAmounts: number[];
  budIds: number[];
  petIds: number[];
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
  petIds,
}: DepositArgs) {
  if (hasFeatureAccess(INITIAL_FARM, "PET_NFT_DEPOSIT")) {
    return depositToFarmV2({
      account,
      farmId,
      sfl,
      itemIds,
      itemAmounts,
      wearableAmounts,
      wearableIds,
      budIds,
      petIds,
    });
  }

  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: BudDepositAbi,
    address: CONFIG.BUD_DEPOSIT_CONTRACT as `0x${string}`,
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
  await waitForTransactionReceipt(config, { hash });
}

export async function depositToFarmV2({
  account,
  farmId,
  itemIds,
  itemAmounts,
  wearableAmounts,
  wearableIds,
  budIds,
  petIds,
}: Exclude<DepositArgs, "sfl">) {
  if (!hasFeatureAccess(INITIAL_FARM, "PET_NFT_DEPOSIT")) {
    throw new Error("Deposit V2 is not available");
  }

  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: DepositV2Abi,
    address: CONFIG.DEPOSIT_V2_CONTRACT as `0x${string}`,
    functionName: "depositToFarm",
    account,
    args: [
      BigInt(farmId),
      itemIds.map(BigInt),
      itemAmounts.map(BigInt),
      wearableIds.map(BigInt),
      wearableAmounts.map(BigInt),
      budIds.map(BigInt),
      petIds.map(BigInt),
    ],
  });
  await waitForTransactionReceipt(config, { hash });
}
