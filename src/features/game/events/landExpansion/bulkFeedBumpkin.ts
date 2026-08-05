import Decimal from "decimal.js-light";

import {
  CONSUMABLES,
  type ConsumableName,
} from "features/game/types/consumables";
import type { GameState } from "features/game/types/game";
import { getObjectEntries } from "lib/object";
import { produce } from "immer";
import { feedBumpkin, FEED_BUMPKIN_ERRORS } from "./feedBumpkin";

export type BulkFeedBumpkinAction = {
  type: "bumpkin.bulkFeed";
  items: {
    food: ConsumableName;
    amount: number;
  }[];
};

type Options = {
  state: Readonly<GameState>;
  action: BulkFeedBumpkinAction;
  createdAt?: number;
};

export function bulkFeedBumpkin({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const { items } = action;

  if (state.bumpkin === undefined) {
    throw new Error(FEED_BUMPKIN_ERRORS.MISSING_BUMPKIN);
  }

  if (items.length === 0) {
    throw new Error(FEED_BUMPKIN_ERRORS.INVALID_AMOUNT);
  }

  // Aggregate per food in case the same food appears in more than one entry,
  // and validate the whole batch upfront so a partial mid-batch failure
  // can't leave the player short-changed on inventory.
  //
  // `item.food` is only trustworthy as an object key once it's confirmed to
  // be a real, own-property entry of the consumables registry - otherwise a
  // name like "toString" or "constructor" would resolve to an inherited,
  // non-Decimal value on `acc` and throw on `.add()` before validation.
  const foodRequired = items.reduce<Partial<Record<ConsumableName, Decimal>>>(
    (acc, item) => {
      if (!Object.prototype.hasOwnProperty.call(CONSUMABLES, item.food)) {
        throw new Error(FEED_BUMPKIN_ERRORS.NOT_ENOUGH_FOOD);
      }

      if (!Number.isFinite(item.amount) || item.amount <= 0) {
        throw new Error(FEED_BUMPKIN_ERRORS.INVALID_AMOUNT);
      }

      acc[item.food] = (acc[item.food] ?? new Decimal(0)).add(item.amount);
      return acc;
    },
    {},
  );

  getObjectEntries(foodRequired).forEach(([food, amount]) => {
    const inInventory = state.inventory[food] ?? new Decimal(0);
    if (inInventory.lessThan(amount ?? 0)) {
      throw new Error(FEED_BUMPKIN_ERRORS.NOT_ENOUGH_FOOD);
    }
  });

  return produce(state, (stateCopy) => {
    let result: GameState = stateCopy;

    getObjectEntries(foodRequired).forEach(([food, amount]) => {
      result = feedBumpkin({
        state: result,
        action: {
          type: "bumpkin.feed",
          food,
          amount: (amount as Decimal).toNumber(),
        },
        createdAt,
      });
    });

    return result;
  });
}
