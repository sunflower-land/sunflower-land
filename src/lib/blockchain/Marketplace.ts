import { CONFIG } from "lib/config";
import MarketplaceABI from "./abis/Marketplace";
import { getNextSessionId } from "./Session";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

const address = CONFIG.MARKETPLACE_CONTRACT;

export async function acceptOfferTransaction({
  account,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  offer,
  fee,
}: {
  account: `0x${string}`;
  signature: `0x${string}`;
  sessionId: `0x${string}`;
  nextSessionId: `0x${string}`;
  deadline: number;
  // Data
  farmId: number;
  fee: string;
  offer: {
    farmId: number;
    tradeId: string;
    collection: string;
    id: number;
    name: string;
    sfl: number;
    signature: string;
  };
}): Promise<string> {
  const oldSessionId = sessionId;

  console.log(
    signature,
    sessionId,
    nextSessionId,
    BigInt(deadline),
    BigInt(farmId),
    BigInt(fee),
    offer,
  );

  const hash = await writeContract(config, {
    abi: MarketplaceABI,
    address: address as `0x${string}`,
    functionName: "acceptOffer",
    args: [
      signature,
      sessionId,
      nextSessionId,
      BigInt(deadline),
      BigInt(farmId),
      BigInt(fee),
      offer,
    ],
    account,
  });
  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(account, farmId, oldSessionId);
}
