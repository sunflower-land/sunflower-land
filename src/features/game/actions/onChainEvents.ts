import { wallet } from "lib/blockchain/wallet";

import { ITEM_DETAILS } from "../types/images";
import { KNOWN_ITEMS } from "../types";
import { getFarmSlots, ListingStatus } from "lib/blockchain/Trader";
import { CONFIG } from "lib/config";
import i18n from "lib/i18n";

export type OnChainEvent = {
  icon: string;
  message: string;
  timestamp: number;
};

type LoadPastEventArgs = {
  farmId: number;
  farmAddress: string;
  block: BlockInfo;
};

/**
 * Load On Chain events and transform them into OnChainEvent[]
 */
async function loadPastEvents({ farmId }: LoadPastEventArgs) {
  const farmTrades = await getFarmSlots(wallet.web3Provider, farmId);

  const recentPurchases = farmTrades.filter(
    (farmTrade) => farmTrade.listing?.status === ListingStatus.PURCHASED,
  );

  const tradeEvents: OnChainEvent[] = recentPurchases.map(({ listing }) => {
    const item = KNOWN_ITEMS[Number(listing?.resourceId)];
    const t = i18n.t;
    return {
      icon: ITEM_DETAILS[item].image,
      timestamp: listing?.purchasedAt || 0,
      message: `${t("land")} #${listing?.purchasedById} ${t(
        "purchased",
      )} ${Number(listing?.resourceAmount.toString())} ${item}`,
    };
  });

  const sorted = tradeEvents.sort((a, b) =>
    a.timestamp - b.timestamp > 0 ? -1 : 1,
  );

  return sorted;
}

/**
 * Load new events
 */
export async function unseenEvents({
  farmAddress,
  farmId,
}: {
  farmAddress: string;
  farmId: number;
}) {
  if (!CONFIG.API_URL) {
    return [];
  }

  const lastBlock = getLastBlock();
  const block = await getCurrentBlock();

  // First time playing the game, so no new events!
  if (!lastBlock) {
    storeLastBlock(block);
    return [];
  }

  const pastEvents = await loadPastEvents({
    farmAddress,
    farmId,
    block: lastBlock,
  });

  const unseen = pastEvents.filter(
    (event) => event.timestamp > lastBlock.timestamp / 1000,
  );
  storeLastBlock(block);

  return unseen;
}

// Last time they opened the game what the block was
const LOCAL_STORAGE_KEY = "last_block";

interface BlockInfo {
  blockNumber: number;
  timestamp: number;
}

function getLastBlock(): BlockInfo | null {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!item) {
    return null;
  }

  try {
    return JSON.parse(item) as BlockInfo;
  } catch {
    return null;
  }
}

function storeLastBlock(block: BlockInfo) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(block));
}

async function getCurrentBlock() {
  const blockNumber = await wallet.getBlockNumber();

  return {
    blockNumber,
    timestamp: Date.now(),
  };
}
