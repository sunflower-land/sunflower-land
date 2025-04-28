import { CONFIG } from "lib/config";
import WithdrawalABI from "./abis/Withdrawals";
import SunflowerLandWithdrawFlowerABI from "./abis/SunflowerLandWithdrawFlower";
import { getNextSessionId, getSessionId } from "./Session";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { saveTxHash } from "features/game/types/transactions";
import { base, baseSepolia, polygon, polygonAmoy } from "viem/chains";

const address = CONFIG.WITHDRAWAL_CONTRACT;
const withdrawFlowerAddress = CONFIG.WITHDRAW_FLOWER_CONTRACT;

export type WithdrawItemsParams = {
  signature: string;
  sessionId: string;
  nextSessionId: string;
  farmId: number;
  sender: string;
  deadline: number;
  ids: number[];
  amounts: string[];
};

export async function withdrawItemsTransaction({
  sender,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  ids,
  amounts,
}: WithdrawItemsParams): Promise<string> {
  const oldSessionId = sessionId;

  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawItems",
    args: [
      signature as `0x${string}`,
      sessionId as `0x${string}`,
      nextSessionId as `0x${string}`,
      BigInt(deadline),
      BigInt(farmId),
      ids.map(BigInt),
      amounts.map(BigInt),
    ],
    account: sender as `0x${string}`,
  });
  saveTxHash({
    event: "transaction.itemsWithdrawn",
    hash,
    sessionId,
    deadline,
  });
  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(sender, farmId, oldSessionId);
}

export type WithdrawWearablesParams = {
  signature: string;
  sessionId: string;
  nextSessionId: string;
  farmId: number;
  ids: number[];
  amounts: number[];
  sender: string;
  deadline: number;
};

export async function withdrawWearablesTransaction({
  sender,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  ids,
  amounts,
}: WithdrawWearablesParams): Promise<string> {
  const oldSessionId = await getSessionId(farmId);

  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawWearables",
    args: [
      signature as `0x${string}`,
      sessionId as `0x${string}`,
      nextSessionId as `0x${string}`,
      BigInt(deadline),
      BigInt(farmId),
      ids.map(BigInt),
      amounts.map(BigInt),
    ],
    account: sender as `0x${string}`,
  });
  saveTxHash({
    event: "transaction.wearablesWithdrawn",
    hash,
    sessionId,
    deadline,
  });
  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(sender, farmId, oldSessionId);
}

export type WithdrawBudsParams = {
  signature: string;
  sessionId: string;
  nextSessionId: string;
  farmId: number;
  sender: string;
  deadline: number;
  budIds: number[];
};

export async function withdrawBudsTransaction({
  sender,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  budIds,
}: WithdrawBudsParams): Promise<string> {
  const oldSessionId = await getSessionId(farmId);

  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawBuds",
    args: [
      signature as `0x${string}`,
      sessionId as `0x${string}`,
      nextSessionId as `0x${string}`,
      BigInt(deadline),
      BigInt(farmId),
      budIds.map(BigInt),
    ],
    account: sender as `0x${string}`,
  });
  saveTxHash({ event: "transaction.budWithdrawn", hash, sessionId, deadline });
  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(sender, farmId, oldSessionId);
}

export type WithdrawFlowerParams = {
  signature: string;
  chainId: number;
  sender: string;
  withdrawId: string;
  amount: number | string;
  farmOwner: string;
  deadline: number;
};

export async function withdrawFlowerTransaction({
  sender,
  signature,
  withdrawId,
  amount,
  deadline,
}: WithdrawFlowerParams): Promise<void> {
  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? base.id : baseSepolia.id,
    abi: SunflowerLandWithdrawFlowerABI,
    address: withdrawFlowerAddress as `0x${string}`,
    functionName: "withdrawFlower",
    args: [
      signature as `0x${string}`,
      BigInt(deadline),
      withdrawId,
      BigInt(amount),
    ],
    account: sender as `0x${string}`,
  });

  saveTxHash({
    event: "transaction.flowerWithdrawn",
    hash,
    deadline,
    withdrawId,
  });
  await waitForTransactionReceipt(config, { hash });
}
