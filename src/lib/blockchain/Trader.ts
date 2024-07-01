import Web3 from "web3";
import { AbiItem, fromWei } from "web3-utils";

import { CONFIG } from "lib/config";

import TraderJSON from "./abis/Trader.json";
import { InventoryItemName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { KNOWN_ITEMS } from "features/game/types";
import { SunflowerLandTrader } from "./types";
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
  farmId: number,
): Promise<FarmSlot[]> {
  const farmSlots = await (
    new web3.eth.Contract(
      TraderJSON as AbiItem[],
      address as string,
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
            getItemUnit(KNOWN_ITEMS[slot.resourceId]),
          ),
        ),
        sfl: Number(fromWei(slot.sfl)),
        tax: Number(slot.tax) / 1000,
        purchasedAt: Number(slot.purchasedAt),
        purchasedById: Number(slot.purchasedById),
      },
    };
  });
}
