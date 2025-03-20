import { CONFIG } from "lib/config";
import ABI from "./abis/Auction";
import { getNextSessionId, getSessionId } from "./Session";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { saveTxHash } from "features/game/types/transactions";
import { polygonAmoy } from "viem/chains";
import { polygon } from "viem/chains";

const address = CONFIG.AUCTION_CONTRACT;

export type MintBidParams = {
  signature: string;
  deadline: number;
  farmId: string | number;
  sender: string;
  sessionId: string;
  nextSessionId: string;
  mintId: string | number;
  supply: string | number;
  fee: string;
};

export async function mintAuctionCollectible({
  sender,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  mintId,
  supply,
  fee,
}: MintBidParams): Promise<string> {
  const oldSessionId = await getSessionId(farmId as number);

  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: ABI,
    address: address as `0x${string}`,
    functionName: "mintCollectible",
    args: [
      signature as `0x${string}`,
      sessionId as `0x${string}`,
      nextSessionId as `0x${string}`,
      BigInt(deadline),
      BigInt(farmId),
      BigInt(fee),
      BigInt(mintId),
      BigInt(supply),
    ],
    value: BigInt(fee),
    account: sender as `0x${string}`,
  });
  saveTxHash({ event: "transaction.bidMinted", hash, sessionId, deadline });

  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(sender, farmId as number, oldSessionId);
}

export async function mintAuctionWearable({
  sender,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  mintId,
  supply,
  fee,
}: MintBidParams): Promise<string> {
  const oldSessionId = await getSessionId(farmId as number);

  const hash = await writeContract(config, {
    chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
    abi: ABI,
    address: address as `0x${string}`,
    functionName: "mintWearable",
    args: [
      signature as `0x${string}`,
      sessionId as `0x${string}`,
      nextSessionId as `0x${string}`,
      BigInt(deadline),
      BigInt(farmId),
      BigInt(fee),
      BigInt(mintId),
      BigInt(supply),
    ],
    account: sender as `0x${string}`,
  });
  saveTxHash({ event: "transaction.bidMinted", hash, sessionId, deadline });
  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(sender, farmId as number, oldSessionId);
}
