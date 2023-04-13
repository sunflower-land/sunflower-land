import Web3 from "web3";
import { AbiItem, fromWei } from "web3-utils";

import { CONFIG } from "lib/config";

import TraderJSON from "./abis/Trader.json";
import { InventoryItemName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { KNOWN_IDS, KNOWN_ITEMS } from "features/game/types";
import { SunflowerLandTrader } from "./types";
import { Purchased } from "./types/SunflowerLandTrader";
import { getItemUnit } from "features/game/lib/conversion";

const address = CONFIG.TRADER_CONTRACT;

export type ItemLimits = Record<InventoryItemName, Decimal>;

export enum ListingStatus {
  EMPTY,
  LISTED,
  CANCELLED,
  PURCHASED,
}

export type Listing = {
  id: number;
  status: ListingStatus;
  resourceId: number;
  resourceAmount: number;
  sfl: number;
  tax: number;
  purchasedAt: number;
  purchasedById: number;
};

export type FarmSlot = {
  slotId: number;
  listing?: Listing;
};

export async function getFarmSlots(
  web3: Web3,
  farmId: number
): Promise<FarmSlot[]> {
  const farmSlots = await (
    new web3.eth.Contract(
      TraderJSON as AbiItem[],
      address as string
    ) as unknown as SunflowerLandTrader
  ).methods
    .getFarmSlots(farmId, 3)
    .call();

  return farmSlots.map((slot, index) => {
    if (slot.status == "0") {
      return { slotId: index };
    }
    return {
      slotId: index,
      listing: {
        id: Number(slot.listingId),
        status: Number(slot.status),
        resourceId: Number(slot.resourceId),
        resourceAmount: Number(
          fromWei(
            slot.resourceAmount,
            getItemUnit(KNOWN_ITEMS[slot.resourceId])
          )
        ),
        sfl: Number(fromWei(slot.sfl)),
        tax: Number(slot.tax) / 1000,
        purchasedAt: Number(slot.purchasedAt),
        purchasedById: Number(slot.purchasedById),
      },
    };
  });
}

export async function getRemainingListings(
  web3: Web3,
  farmId: number
): Promise<number> {
  return Number(
    await (
      new web3.eth.Contract(
        TraderJSON as AbiItem[],
        address as string
      ) as unknown as SunflowerLandTrader
    ).methods
      .getRemainingListings(farmId)
      .call()
  );
}

export async function getLimits(web3: Web3): Promise<ItemLimits> {
  const ids = Object.values(KNOWN_IDS);
  const names = Object.keys(KNOWN_IDS) as InventoryItemName[];

  const limits: string[] = await (
    new web3.eth.Contract(
      TraderJSON as AbiItem[],
      address as string
    ) as unknown as SunflowerLandTrader
  ).methods
    .getLimitBatch(ids)
    .call();

  return limits.reduce(
    (items, limit, index) => ({
      ...items,
      [names[index]]: new Decimal(
        fromWei(String(limit), getItemUnit(names[index]))
      ),
    }),
    {} as ItemLimits
  );
}

export async function getPastTrades(
  web3: Web3,
  account: string,
  farmId: number,
  fromBlock: number
) {
  const events: Purchased[] = await new Promise((res, rej) => {
    (
      new web3.eth.Contract(
        TraderJSON as AbiItem[],
        address as string
      ) as unknown as SunflowerLandTrader
    ).getPastEvents(
      "Purchased",
      {
        filter: {
          sellerFarmId: farmId,
        },
        fromBlock,
        toBlock: "latest",
      },
      function (error, events) {
        if (error) {
          rej(error);
        }

        res(events as unknown as Purchased[]);
      }
    );
  });

  return events;
}
