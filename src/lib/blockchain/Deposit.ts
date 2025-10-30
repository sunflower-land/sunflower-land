import { CONFIG } from "lib/config";
import DepositV2Abi from "./abis/DepositV2";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon } from "viem/chains";
import { polygonAmoy } from "viem/chains";

export interface DepositArgs {
  account: `0x${string}`;
  farmId: number;
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
  itemIds,
  itemAmounts,
  wearableAmounts,
  wearableIds,
  budIds,
  petIds,
}: Exclude<DepositArgs, "sfl">) {
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
