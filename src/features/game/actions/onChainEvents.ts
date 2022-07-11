import { fromWei } from "web3-utils";

import { metamask } from "lib/blockchain/metamask";
import { shortAddress } from "lib/utils/shortAddress";

import heart from "assets/icons/heart.png";

import { ITEM_DETAILS } from "../types/images";
import { KNOWN_ITEMS } from "../types";

export type OnChainEvent = {
  icon: string;
  message: string;
  blockNumber: number;
  transactionHash: string;
};

type LoadPastEventArgs = {
  farmId: number;
  farmAddress: string;
};

async function loadPastEvents({ farmId, farmAddress }: LoadPastEventArgs) {
  const pastTradeEvents = await metamask.getTrader().getPastTrades(farmId);
  const tradeEvents: OnChainEvent[] = pastTradeEvents.map((event) => {
    const item = KNOWN_ITEMS[Number(event.returnValues.resourceId)];

    return {
      icon: ITEM_DETAILS[item].image,
      blockNumber: 100000,
      message: `Farm #${event.returnValues.buyerFarmId} purchased ${Number(
        fromWei(event.returnValues.resourceAmount)
      )} ${item}`,
      transactionHash: "0x1239120321",
    };
  });

  const pastDeposits = await metamask.getToken().getPastDeposits(farmAddress);
  const depositEvents: OnChainEvent[] = pastDeposits.map((event) => ({
    icon: heart,
    message: `${shortAddress(event.returnValues.from)} deposited ${Number(
      fromWei(event.returnValues.value)
    ).toFixed(2)} SFL`,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  }));

  const sorted = [...tradeEvents, ...depositEvents].sort((a, b) =>
    a.blockNumber - b.blockNumber > 0 ? 1 : -1
  );

  return sorted;
}

/**
 * Load new events
 */
export async function unseenEvents({ farmAddress, farmId }: LoadPastEventArgs) {
  const [block, pastEvents] = await Promise.all([
    getCurrentBlock(),
    loadPastEvents({ farmAddress, farmId }),
  ]);

  const lastBlock = getLastBlock();
  //   const lastBlockNumber = lastBlock?.blockNumber || block.blockNumber;
  const lastBlockNumber = lastBlock?.blockNumber || 0;

  const unseen = pastEvents.filter(
    (event) => event.blockNumber > lastBlockNumber
  );

  //   storeLastBlock(block);

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
    console.error(`Unable to parse ${LOCAL_STORAGE_KEY}`);
    return null;
  }
}

function storeLastBlock(block: BlockInfo) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(block));
}

async function getCurrentBlock() {
  const blockNumber = await metamask.getBlockNumber();

  return {
    blockNumber,
    timestamp: Date.now(),
  };
}
