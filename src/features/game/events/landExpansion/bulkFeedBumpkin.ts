import Decimal from "decimal.js-light";

import type { ConsumableName } from "features/game/types/consumables";
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
  const foodRequired = items.reduce<Partial<Record<ConsumableName, Decimal>>>(
    (acc, item) => {
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
