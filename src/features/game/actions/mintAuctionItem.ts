import {
  mintAuctionCollectible,
  mintAuctionWearable,
} from "lib/blockchain/Auction";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { Bid, InventoryItemName } from "../types/game";
import { gameAnalytics } from "lib/gameAnalytics";
import { getSeasonalTicket } from "../types/seasons";

type Request = {
  farmId: number;
  auctionId: string;
  token: string;
  transactionId: string;
  bid?: Bid;
};

const API_URL = CONFIG.API_URL;

export async function mintAuctionItem(request: Request) {
  const response = await window.fetch(
    `${API_URL}/auction/mint/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
      body: JSON.stringify({
        auctionId: request.auctionId,
      }),
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  const transaction = await response.json();

  let sessionId;
  if (transaction.type === "collectible") {
    sessionId = await mintAuctionCollectible({
      ...transaction,
      web3: wallet.web3Provider,
      account: wallet.myAccount,
    });
  } else {
    sessionId = await mintAuctionWearable({
      ...transaction,
      web3: wallet.web3Provider,
      account: wallet.myAccount,
    });
  }

  // Fire off analytics - TODO migrate to backend
  const bid = request.bid;
  if (bid && bid.ingredients["Block Buck"]) {
    gameAnalytics.trackSink({
      currency: "Block Buck",
      amount: bid.ingredients["Block Buck"],
      item: bid.collectible ?? (bid.wearable as InventoryItemName),
      type: bid.collectible ? "Collectible" : "Wearable",
    });
  }

  if (bid && bid.ingredients[getSeasonalTicket()]) {
    gameAnalytics.trackSink({
      currency: "Seasonal Ticket",
      amount: bid.ingredients[getSeasonalTicket()] ?? 0,
      item: bid.collectible ?? (bid.wearable as InventoryItemName),
      type: bid.collectible ? "Collectible" : "Wearable",
    });
  }

  if (bid && bid.sfl) {
    gameAnalytics.trackSink({
      currency: "SFL",
      amount: bid.sfl ?? 0,
      item: bid.collectible ?? (bid.wearable as InventoryItemName),
      type: bid.collectible ? "Collectible" : "Wearable",
    });
  }

  return { sessionId, verified: true };
}
