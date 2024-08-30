import { CONFIG } from "lib/config";
import ABI from "./abis/Auction";
import { getNextSessionId, getSessionId } from "./Session";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

const address = CONFIG.AUCTION_CONTRACT;

export async function mintAuctionCollectible({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  mintId,
  supply,
  fee,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  mintId: number;
  supply: number;
  fee: number;
}): Promise<string> {
  const oldSessionId = await getSessionId(farmId);

  const hash = await writeContract(config, {
    abi: ABI,
    address: address as `0x${string}`,
    functionName: "mintCollectible",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      BigInt(fee),
      BigInt(mintId),
      BigInt(supply),
    ],
    value: BigInt(fee),
    account,
  });
  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(account, farmId, oldSessionId);
}

export async function mintAuctionWearable({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  mintId,
  supply,
  fee,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  mintId: number;
  supply: number;
  fee: number;
}): Promise<string> {
  const oldSessionId = await getSessionId(farmId);

  const hash = await writeContract(config, {
    abi: ABI,
    address: address as `0x${string}`,
    functionName: "mintWearable",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      BigInt(fee),
      BigInt(mintId),
      BigInt(supply),
    ],
    account,
  });
  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(account, farmId, oldSessionId);
}
