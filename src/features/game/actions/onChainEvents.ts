import { fromWei } from "web3-utils";

import { metamask } from "lib/blockchain/metamask";
import { shortAddress } from "lib/utils/shortAddress";

import token from "assets/icons/token.gif";

import { ITEM_DETAILS } from "../types/images";
import { KNOWN_ITEMS } from "../types";
import { getItemUnit } from "../lib/conversion";

export type OnChainEvent = {
  icon: string;
  message: string;
  blockNumber: number;
  transactionHash: string;
};

type LoadPastEventArgs = {
  farmId: number;
  farmAddress: string;
  blockNumber: number;
};

/**
 * Load On Chain events and transform them into OnChainEvent[]
 */
async function loadPastEvents({
  farmId,
  farmAddress,
  blockNumber,
}: LoadPastEventArgs) {
  const [
    pastTradeEvents,
    pastInventoryDeposits,
    pastInventoryBatchDeposits,
    pastSFLDeposits,
  ] = await Promise.all([
    metamask.getTrader().getPastTrades(farmId, blockNumber),
    metamask.getInventory().getTransfers(farmAddress, blockNumber),
    metamask.getInventory().getBatchTransfers(farmAddress, blockNumber),
    metamask.getToken().getPastDeposits(farmAddress, blockNumber),
  ]);

  const tradeEvents: OnChainEvent[] = pastTradeEvents.map((event) => {
    const item = KNOWN_ITEMS[Number(event.returnValues.resourceId)];

    return {
      icon: ITEM_DETAILS[item].image,
      blockNumber: event.blockNumber,
      message: `Farm #${event.returnValues.buyerFarmId} purchased ${Number(
        fromWei(event.returnValues.resourceAmount, getItemUnit(item))
      )} ${item}`,
      transactionHash: event.transactionHash,
    };
  });

  const inventoryDepositEvents: OnChainEvent[] = pastInventoryDeposits.map(
    (event) => {
      const item = KNOWN_ITEMS[Number(event.returnValues.id)];

      return {
        icon: ITEM_DETAILS[item].image,
        message: `${shortAddress(
          event.returnValues.from
        )} deposited ${parseFloat(
          Number(fromWei(event.returnValues.value, getItemUnit(item))).toFixed(
            2
          )
        )} ${item}`,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      };
    }
  );

  // For each item transferred in the batch, create a separate notification
  const batchEvents: OnChainEvent[] = pastInventoryBatchDeposits.reduce(
    (events, event) => {
      return [
        ...events,
        ...event.returnValues.ids.map((id, index) => {
          const item = KNOWN_ITEMS[Number(id)];
          return {
            icon: ITEM_DETAILS[item].image,
            message: `${shortAddress(
              event.returnValues.from
            )} deposited ${parseFloat(
              Number(
                fromWei(event.returnValues.values[index], getItemUnit(item))
              ).toFixed(2)
            )} ${item}`,
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
          };
        }),
      ];
    },
    [] as OnChainEvent[]
  );

  const sflDepositEvents: OnChainEvent[] = pastSFLDeposits.map((event) => ({
    icon: token,
    message: `${shortAddress(event.returnValues.from)} deposited ${parseFloat(
      Number(fromWei(event.returnValues.value)).toFixed(2)
    )} SFL`,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  }));

  const sorted = [
    ...tradeEvents,
    ...sflDepositEvents,
    ...inventoryDepositEvents,
    ...batchEvents,
  ].sort((a, b) => (a.blockNumber - b.blockNumber > 0 ? -1 : 1));

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
  const lastBlock = getLastBlock();

  // First time playing the game, so no new events!
  if (!lastBlock) {
    const block = await getCurrentBlock();
    storeLastBlock(block);
    return [];
  }

  const [block, pastEvents] = await Promise.all([
    getCurrentBlock(),
    loadPastEvents({
      farmAddress,
      farmId,
      blockNumber: lastBlock.blockNumber,
    }),
  ]);

  const lastBlockNumber = lastBlock?.blockNumber || block.blockNumber;

  const unseen = pastEvents.filter(
    (event) => event.blockNumber > lastBlockNumber
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
