import { CONFIG } from "lib/config";
import WithdrawalABI from "./abis/Withdrawals";
import { getNextSessionId, getSessionId } from "./Session";
import { writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

const address = CONFIG.WITHDRAWAL_CONTRACT;

export async function withdrawSFLTransaction({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  tax,
  sfl,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  sfl: number;
  tax: number;
}): Promise<string> {
  const oldSessionId = sessionId;

  await writeContract(config, {
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawSFL",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      BigInt(sfl),
      BigInt(tax),
    ],
    account,
  });

  return await getNextSessionId(account, farmId, oldSessionId);
}

export async function withdrawItemsTransaction({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  ids,
  amounts,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  ids: number[];
  amounts: number[];
}): Promise<string> {
  const oldSessionId = sessionId;

  writeContract(config, {
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawItems",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      ids.map(BigInt),
      amounts.map(BigInt),
    ],
    account,
  });

  return await getNextSessionId(account, farmId, oldSessionId);
}

export async function withdrawWearablesTransaction({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  ids,
  amounts,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  ids: number[];
  amounts: number[];
}): Promise<string> {
  const oldSessionId = await getSessionId(farmId);

  await writeContract(config, {
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawWearables",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      ids.map(BigInt),
      amounts.map(BigInt),
    ],
    account,
  });

  return await getNextSessionId(account, farmId, oldSessionId);
}

export async function withdrawBudsTransaction({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  budIds,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  budIds: number[];
}): Promise<string> {
  const oldSessionId = await getSessionId(farmId);

  await writeContract(config, {
    abi: WithdrawalABI,
    address: address as `0x${string}`,
    functionName: "withdrawBuds",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      budIds.map(BigInt),
    ],
    account,
  });

  return await getNextSessionId(account, farmId, oldSessionId);
}
