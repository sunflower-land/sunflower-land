import cloneDeep from "lodash.clonedeep";

import { Bumpkin, GameState, InventoryItemName } from "../../types/game";
import { CHUM_AMOUNTS, FishingBait } from "features/game/types/fishing";
import Decimal from "decimal.js-light";

export type CastRodAction = {
  type: "rod.casted";
  bait: FishingBait;
  chum?: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: CastRodAction;
  createdAt?: number;
};

const DAILY_FISHING_ATTEMPT_LIMIT = 20;

export function getDailyFishingLimit(bumpkin: Bumpkin): number {
  const { pants } = bumpkin.equipped;

  if (pants === "Angler Waders") {
    return DAILY_FISHING_ATTEMPT_LIMIT + 10;
  }

  return DAILY_FISHING_ATTEMPT_LIMIT;
}

export function castRod({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;
  const now = new Date(createdAt);
  const today = new Date(now).toISOString().split("T")[0];
  const { dailyAttempts = {} } = game.fishing;

  if (!game.bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (dailyAttempts[today] >= getDailyFishingLimit(game.bumpkin)) {
    throw new Error("Daily attempts exhausted");
  }

  const rodCount = game.inventory.Rod ?? new Decimal(0);
  // Requires Rod
  if (rodCount.lt(1)) {
    throw new Error("Missing rod");
  }

  // Requires Bait
  const baitCount = game.inventory[action.bait] ?? new Decimal(0);
  if (baitCount.lt(1)) {
    throw new Error(`Missing ${action.bait}`);
  }

  if (game.fishing.wharf.castedAt) {
    throw new Error("Already casted");
  }

  // Subtract Chum
  if (action.chum) {
    const chumAmount = CHUM_AMOUNTS[action.chum] ?? 0;
    if (!chumAmount) {
      throw new Error(`${action.chum} is not a supported chum`);
    }

    const inventoryChum = game.inventory[action.chum] ?? new Decimal(0);

    if (inventoryChum.lt(chumAmount)) {
      throw new Error(`Insufficient Chum: ${action.chum}`);
    }

    game.inventory[action.chum] = inventoryChum.sub(chumAmount);
  }

  // Subtracts Rod
  game.inventory.Rod = rodCount.sub(1);

  // Subtracts Bait
  game.inventory[action.bait] = baitCount.sub(1);

  // Casts Rod
  game.fishing = {
    ...game.fishing,
    wharf: {
      castedAt: createdAt,
      chum: action.chum,
    },
  };

  // Track daily attempts
  if (dailyAttempts[today]) {
    dailyAttempts[today] += 1;
  } else {
    dailyAttempts[today] = 1;
  }

  return {
    ...game,
  };
}
