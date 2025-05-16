import { syncProgress, SyncProgressParams } from "lib/blockchain/Game";
import { GameState, InventoryItemName, Wardrobe } from "./game";
import {
  mintAuctionCollectible,
  mintAuctionWearable,
  MintBidParams,
} from "lib/blockchain/Auction";
import {
  WithdrawBudsParams,
  withdrawBudsTransaction,
  WithdrawFlowerParams,
  withdrawFlowerTransaction,
  WithdrawItemsParams,
  withdrawItemsTransaction,
  WithdrawWearablesParams,
  withdrawWearablesTransaction,
} from "lib/blockchain/Withdrawals";
import { sync } from "../actions/sync";
import { mintAuctionItemRequest } from "../actions/mintAuctionItem";
import {
  AcceptOfferParams,
  acceptOfferTransaction,
  ListingPurchasedParams,
  listingPurchasedTransaction,
} from "lib/blockchain/Marketplace";
import { postEffect } from "../actions/effect";

export type BidMintedTransaction = {
  event: "transaction.bidMinted";
  createdAt: number;
  data: {
    bid: GameState["auctioneer"]["bid"];
    params: MintBidParams;
  };
};

export type BudWithdrawnTransaction = {
  event: "transaction.budWithdrawn";
  createdAt: number;
  data: {
    buds: GameState["buds"];
    params: WithdrawBudsParams;
  };
};

export type ItemsWithdrawnTransaction = {
  event: "transaction.itemsWithdrawn";
  createdAt: number;
  data: {
    items: Partial<Record<InventoryItemName, number>>;
    params: WithdrawItemsParams;
  };
};

export type WearablesWithdrawnTransaction = {
  event: "transaction.wearablesWithdrawn";
  createdAt: number;
  data: {
    wearables: Wardrobe;
    params: WithdrawWearablesParams;
  };
};

export type ProgressSyncedTransaction = {
  event: "transaction.progressSynced";
  createdAt: number;
  data: {
    params: SyncProgressParams;
  };
};

export type AcceptOfferTransaction = {
  event: "transaction.offerAccepted";
  createdAt: number;
  data: {
    params: AcceptOfferParams;
    buds: GameState["buds"];
  };
};

export type FlowerWithdrawnTransaction = {
  event: "transaction.flowerWithdrawn";
  createdAt: number;
  data: {
    amount: string;
    params: WithdrawFlowerParams;
  };
};

export type ListingPurchasedTransaction = {
  event: "transaction.listingPurchased";
  createdAt: number;
  data: {
    buds: GameState["buds"];
    params: ListingPurchasedParams;
  };
};

export type GameTransaction =
  | ProgressSyncedTransaction
  | WearablesWithdrawnTransaction
  | ItemsWithdrawnTransaction
  | BudWithdrawnTransaction
  | BidMintedTransaction
  | AcceptOfferTransaction
  | ListingPurchasedTransaction
  | FlowerWithdrawnTransaction;

export type TransactionName = Extract<
  GameTransaction,
  { event: string }
>["event"];

type TransactionHash = {
  deadline: number;
  hash: string;
  event: TransactionName;
} & (
  | {
      sessionId: string;
      withdrawId: never;
    }
  | {
      sessionId: never;
      withdrawId: string;
    }
);
export const DEADLINE_MS = 5 * 60 * 1000;
export const DEADLINE_BUFFER_MS = 1 * 60 * 1000;
const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `sb_wiz.hash.v.${host}-${window.location.pathname}`;

type Identifier =
  | {
      sessionId: string;
      withdrawId?: never;
    }
  | {
      sessionId?: never;
      withdrawId: string;
    };

type SaveTxHash = {
  hash: string;
  event: TransactionName;
  deadline: number;
} & Identifier;

type LoadActiveTxHash = {
  event: TransactionName;
} & Identifier;

export function saveTxHash({
  hash,
  event,
  deadline,
  sessionId,
  withdrawId,
}: SaveTxHash) {
  const txHash = {
    hash,
    event,
    deadline,
    ...(sessionId ? { sessionId } : { withdrawId }),
  } as TransactionHash;

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(txHash));
}

export function loadActiveTxHash({
  event,
  sessionId,
  withdrawId,
}: LoadActiveTxHash) {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!item) return null;

  const txHash = JSON.parse(item) as TransactionHash;

  if (txHash.event !== event) {
    return null;
  }

  if (sessionId && txHash.sessionId !== sessionId) {
    return null;
  }

  if (withdrawId && txHash.withdrawId !== withdrawId) {
    return null;
  }

  if (txHash.deadline * 1000 < Date.now()) {
    return null;
  }

  return txHash;
}

export type TransactionHandler = {
  [Name in GameTransaction["event"]]: (
    data: Extract<GameTransaction, { event: Name }>["data"],
  ) => Promise<string>;
};

export const ONCHAIN_TRANSACTIONS: TransactionHandler = {
  "transaction.offerAccepted": (data) => acceptOfferTransaction(data.params),
  "transaction.listingPurchased": (data) =>
    listingPurchasedTransaction(data.params),
  "transaction.budWithdrawn": (data) => withdrawBudsTransaction(data.params),
  "transaction.itemsWithdrawn": (data) => withdrawItemsTransaction(data.params),
  "transaction.progressSynced": (data) => syncProgress(data.params),
  "transaction.wearablesWithdrawn": (data) =>
    withdrawWearablesTransaction(data.params),
  "transaction.flowerWithdrawn": (data) =>
    withdrawFlowerTransaction(data.params),

  // Minting a bid has 2 separate contract methods
  "transaction.bidMinted": (data) => {
    if (data.bid?.collectible) {
      return mintAuctionCollectible(data.params);
    }

    return mintAuctionWearable(data.params);
  },
};

export type SignatureHandler = {
  [Name in GameTransaction["event"]]: (
    data: Extract<GameTransaction, { event: Name }>["data"],
  ) => Promise<string>;
};

type TransactionRequest = Record<
  TransactionName,
  (_: any) => Promise<{ gameState: GameState; data?: any }>
>;

export const TRANSACTION_SIGNATURES: TransactionRequest = {
  "transaction.offerAccepted": () => ({}) as any, // uses new effect flow
  "transaction.listingPurchased": () => ({}) as any, // uses new effect flow
  "transaction.progressSynced": sync,
  "transaction.bidMinted": mintAuctionItemRequest,
  "transaction.budWithdrawn": postEffect,
  "transaction.itemsWithdrawn": postEffect,
  "transaction.wearablesWithdrawn": postEffect,
  "transaction.flowerWithdrawn": postEffect,
};
