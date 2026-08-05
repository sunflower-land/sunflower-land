import { produce } from "immer";
import type {
  AnimalFoodName,
  AnimalMedicineName,
  GameState,
} from "features/game/types/game";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { getKeys } from "lib/object";
import { applyMix } from "./feedMixed";

export type BulkMixFeedAction = {
  type: "feeds.bulkMixed";
  feeds: {
    item: AnimalFoodName | AnimalMedicineName;
    amount: number;
  }[];
};

type Options = {
  state: Readonly<GameState>;
  action: BulkMixFeedAction;
};

// Defensive upper bounds matching the backend autosave schema, so the handler
// rejects malformed input early regardless of where it is called (the FE path
// has no schema validation).
const MAX_BULK_MIX_ENTRIES = getKeys(ANIMAL_FOODS).length;
const MAX_BULK_MIX_AMOUNT = 1000;

export function bulkMixFeed({ state, action }: Options) {
  if (action.feeds.length < 1 || action.feeds.length > MAX_BULK_MIX_ENTRIES) {
    throw new Error("Invalid bulk mix entries");
  }

  // One entry per feed - repeating an item would multiply the per-feed cap.
  const items = new Set(action.feeds.map(({ item }) => item));

  if (items.size !== action.feeds.length) {
    throw new Error("Invalid bulk mix entries");
  }

  action.feeds.forEach(({ amount }) => {
    if (
      !Number.isInteger(amount) ||
      amount < 1 ||
      amount > MAX_BULK_MIX_AMOUNT
    ) {
      throw new Error("Invalid bulk mix amount");
    }
  });

  // Every feed is applied to a single Immer draft, so one draft/finalize cycle
  // covers the whole mix. Throwing part way through discards the draft, which
  // rejects the whole event rather than committing a partial mix.
  return produce(state, (copy) => {
    action.feeds.forEach((feed) => applyMix(copy, feed));
  });
}
