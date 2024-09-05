import { SyncProgressParams } from "lib/blockchain/Game";
import { GameState, InventoryItemName, Wardrobe } from "./game";
import { MintBidParams } from "lib/blockchain/Auction";
import {
  WithdrawBudsParams,
  WithdrawItemsParams,
  WithdrawSFLParams,
  WithdrawWearablesParams,
} from "lib/blockchain/Withdrawals";

export type BidMintedTransaction = {
  event: "transaction.bidMinted";
  createdAt: number;
  data: {
    bid: GameState["auctioneer"]["bid"];
    params: MintBidParams;
  };
};

export type SFLWithdrawnTransaction = {
  event: "transaction.sflWithdrawn";
  createdAt: number;
  data: {
    sfl: number;
    params: WithdrawSFLParams;
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

export type GameTransaction =
  | ProgressSyncedTransaction
  | WearablesWithdrawnTransaction
  | ItemsWithdrawnTransaction
  | BudWithdrawnTransaction
  | SFLWithdrawnTransaction
  | BidMintedTransaction;

export type TransactionName = Extract<
  GameTransaction,
  { event: string }
>["event"];

type TransactionHash = {
  // deadline: number;
  sessionId: string;
  hash: string;
  event: TransactionName;
};

export const DEADLINE_MS = 5 * 60 * 1000;

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `sb_wiz.hash.v.${host}-${window.location.pathname}`;

export function saveTxHash({
  hash,
  event,
  // deadline,
  sessionId,
}: {
  hash: string;
  sessionId: string;
  event: TransactionName;
  // deadline: number;
}) {
  const txHash: TransactionHash = {
    hash,
    event,
    sessionId,
    // deadline,
  };

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(txHash));
}

export function loadActiveTxHash({
  event,
  sessionId,
}: {
  event: TransactionName;
  sessionId: string;
}) {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!item) return null;

  const txHash = JSON.parse(item) as TransactionHash;

  if (txHash.event !== event) return null;

  if (txHash.sessionId !== sessionId) return null;

  // const hasExpired = txHash.deadline * 1000 + DEADLINE_MS < Date.now();

  // if (hasExpired) return null;

  return txHash;
}
