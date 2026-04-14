import { CONFIG } from "lib/config";
import WishingWellJSON from "./abis/WishingWell";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { polygon, polygonAmoy } from "viem/chains";

const address = CONFIG.WISHING_WELL_CONTRACT;

export async function wish(account: `0x${string}`) {
  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: WishingWellJSON,
    address,
    functionName: "wish",
    account,
  });
  await waitForTransactionReceipt(config, { hash });
}

export async function collectFromWellOnChain({
  account,
  signature,
  tokens,
  deadline,
  farmId,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  tokens: string;
  deadline: number;
  farmId: number;
}) {
  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: WishingWellJSON,
    address: address,
    functionName: "collectFromWell",
    args: [signature, BigInt(tokens), BigInt(deadline), BigInt(farmId)],
    account,
  });
  await waitForTransactionReceipt(config, { hash });
}

export async function getWellBalance(account: `0x${string}`) {
  return await readContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: WishingWellJSON,
    address: address,
    functionName: "balanceOf",
    args: [account],
    account,
  });
}

export async function canCollectFromWell(
  account: `0x${string}`,
): Promise<boolean> {
  return await readContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: WishingWellJSON,
    address: address,
    functionName: "canCollect",
    args: [account],
    account,
  });
}

export async function lastCollectedFromWell(
  account: `0x${string}`,
): Promise<number> {
  return Number(
    await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: WishingWellJSON,
      address: address,
      functionName: "lastUpdatedAt",
      args: [account],
      account,
    }),
  );
}

export async function getLockedPeriod(account: `0x${string}`): Promise<number> {
  return Number(
    await readContract(config, {
      chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      abi: WishingWellJSON,
      address: address,
      functionName: "getLockedPeriod",
      account,
    }),
  );
}
