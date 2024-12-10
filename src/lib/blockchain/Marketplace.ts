import { CONFIG } from "lib/config";
import MarketplaceABI from "./abis/Marketplace";
import QuoterABI from "./abis/Quoter";
import { getNextSessionId } from "./Session";
import {
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { saveTxHash } from "features/game/types/transactions";
import { parseEther } from "viem";

const address = CONFIG.MARKETPLACE_CONTRACT;

export type AcceptOfferParams = {
  signature: string;
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  sender: string;
  farmId: number;
  playerAmount: number | string;
  teamAmount: number | string;
  offer: {
    tradeId: string;
    signature: string;
    farmId: number;
    id: number;
    sfl: number;
    collection: "collectibles" | "buds" | "wearables" | "resources";
    name: string;
  };
};

export async function acceptOfferTransaction({
  sender,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  offer,
  playerAmount,
  teamAmount,
}: AcceptOfferParams): Promise<string> {
  const oldSessionId = sessionId;

  const quote = await simulateContract(config, {
    abi: QuoterABI,
    address: CONFIG.ALGEBRA_QUOTER_CONTRACT as `0x${string}`,
    functionName: "quoteExactInputSingle",
    args: [
      CONFIG.TOKEN_CONTRACT as `0x${string}`,
      CONFIG.USDC_CONTRACT as `0x${string}`,
      BigInt(offer.sfl),
      BigInt(0),
    ],
  });

  const amountOutMinimum = (BigInt(quote.result[0]) * BigInt(99)) / BigInt(100); // 1% slippage

  const hash = await writeContract(config, {
    abi: MarketplaceABI,
    address: address as `0x${string}`,
    functionName: "acceptOffer",
    args: [
      signature as `0x${string}`,
      sessionId as `0x${string}`,
      nextSessionId as `0x${string}`,
      BigInt(deadline),
      BigInt(farmId),
      BigInt(playerAmount),
      BigInt(teamAmount),
      amountOutMinimum,
      {
        signature: offer.signature as `0x${string}`,
        tradeId: offer.tradeId,
        farmId: BigInt(offer.farmId),
        id: BigInt(offer.id),
        sfl: BigInt(offer.sfl),
        collection: offer.collection,
        name: offer.name,
      },
    ],
    account: sender as `0x${string}`,
  });

  saveTxHash({ event: "transaction.offerAccepted", hash, sessionId, deadline });
  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(sender, farmId, oldSessionId);
}

export type ListingPurchasedParams = {
  sessionId: string;
  nextSessionId: string;
  deadline: number;
  sender: string;
  farmId: number;
  playerAmount: number | string;
  teamAmount: number | string;
  signature: string;
  listing: {
    signature: string;
    id: string;
    farmId: number;
    itemId: number;
    sfl: number;
    quantity: number;
    collection: string;
    itemName: string;
  };
  mintAmounts: {
    sfl: number | string;
    items: number | string;
  };
};

export async function listingPurchasedTransaction({
  sender,
  signature,
  sessionId,
  nextSessionId,
  deadline,
  farmId,
  listing,
  playerAmount,
  teamAmount,
  mintAmounts,
}: ListingPurchasedParams): Promise<string> {
  const oldSessionId = sessionId;

  const quote = await simulateContract(config, {
    abi: QuoterABI,
    address: CONFIG.ALGEBRA_QUOTER_CONTRACT as `0x${string}`,
    functionName: "quoteExactInputSingle",
    args: [
      CONFIG.TOKEN_CONTRACT as `0x${string}`,
      CONFIG.USDC_CONTRACT as `0x${string}`,
      parseEther(listing.sfl.toString()),
      BigInt(0),
    ],
  });
  const amountOutMinimum = (BigInt(quote.result[0]) * BigInt(99)) / BigInt(100); // 1% slippage

  const hash = await writeContract(config, {
    abi: MarketplaceABI,
    address: address as `0x${string}`,
    functionName: "purchaseListing",
    args: [
      {
        listing: {
          signature: listing.signature as `0x${string}`,
          id: listing.id,
          farmId: BigInt(listing.farmId),
          itemId: BigInt(listing.itemId),
          sfl: parseEther(listing.sfl.toString()),
          quantity: BigInt(listing.quantity),
          collection: listing.collection,
          itemName: listing.itemName,
        },
        sessionId: sessionId as `0x${string}`,
        nextSessionId: nextSessionId as `0x${string}`,
        buyerFarmId: BigInt(farmId),
        deadline: BigInt(deadline),
        playerAmount: BigInt(playerAmount),
        teamAmount: BigInt(teamAmount),
        signature: signature as `0x${string}`,
        amountOutMinimum,
        mintAmounts: {
          sfl: parseEther(mintAmounts.sfl.toString()),
          items: BigInt(mintAmounts.items),
        },
      },
    ],
    account: sender as `0x${string}`,
  });

  saveTxHash({
    event: "transaction.listingPurchased",
    hash,
    sessionId,
    deadline,
  });
  await waitForTransactionReceipt(config, { hash });

  return await getNextSessionId(sender, farmId, oldSessionId);
}
