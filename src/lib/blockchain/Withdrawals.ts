import { CONFIG } from "lib/config";
import WithdrawalABI from "./abis/Withdrawals";
import WithdrawSFLABI from "./abis/WithdrawSFL";
import QuoterABI from "./abis/Quoter";
import { getNextSessionId, getSessionId } from "./Session";
import {
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { saveTxHash } from "features/game/types/transactions";

const address = CONFIG.WITHDRAWAL_CONTRACT;

export type WithdrawSFLParams = {
  signature: string;
  sessionId: string;
  nextSessionId: string;
  farmId: number;
  sender: string;
  sfl: string;
  deadline: number;
  playerAmount: string;
  teamAmount: string;
};

export async function withdrawSFLTransaction({
  sender,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  playerAmount,
  teamAmount,
  sfl,
}: WithdrawSFLParams): Promise<string> {
  const oldSessionId = sessionId;

  const quote = await simulateContract(config, {
    abi: QuoterABI,
    address: CONFIG.ALGEBRA_QUOTER_CONTRACT as `0x${string}`,
    functionName: "quoteExactInputSingle",
    args: [
      CONFIG.TOKEN_CONTRACT as `0x${string}`,
      CONFIG.USDC_CONTRACT as `0x${string}`,
      BigInt(sfl),
      BigInt(0),
    ],
  });
  const amountOutMinimum = BigInt(quote.result[0]) * BigInt(0.99); // 1% slippage

  const hash = await writeContract(config, {
    abi: WithdrawSFLABI,
    address: CONFIG.WITHDRAW_SFL_CONTRACT as `0x${string}`,
    functionName: "withdrawSFL",
    args: [
      signature as `0x${string}`,
      sessionId as `0x${string}`,
      nextSessionId as `0x${string}`,
      BigInt(deadline),
      BigInt(farmId),
      BigInt(sfl),
      BigInt(playerAmount),
      BigInt(teamAmount),
      amountOutMinimum,
    ],
    account: sender as `0x${string}`,
  });
  saveTxHash({ event: "transaction.sflWithdrawn", hash, sessionId, deadline });

  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(sender, farmId, oldSessionId);
}

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
