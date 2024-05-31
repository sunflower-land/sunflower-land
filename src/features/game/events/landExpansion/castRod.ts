import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";
import {
  CHUM_AMOUNTS,
  Chum,
  FishingBait,
  FishingLocation,
  getDailyFishingCount,
  getDailyFishingLimit,
} from "features/game/types/fishing";
import Decimal from "decimal.js-light";
import { isWearableActive } from "features/game/lib/wearables";
import { translate } from "lib/i18n/translate";
import { trackActivity } from "features/game/types/bumpkinActivity";

export type CastRodAction = {
  type: "rod.casted";
  bait: FishingBait;
  location: FishingLocation;
  chum?: Chum;
};

type Options = {
  state: Readonly<GameState>;
  action: CastRodAction;
  createdAt?: number;
};

export function castRod({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;
  const { bumpkin } = game;
  const now = new Date(createdAt);
  const today = new Date(now).toISOString().split("T")[0];
  const location = action.location;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin!");
  }

  if (getDailyFishingCount(game) >= getDailyFishingLimit(game)) {
    throw new Error(translate("error.dailyAttemptsExhausted"));
  }

  const rodCount = game.inventory.Rod ?? new Decimal(0);
  // Requires Rod
  if (rodCount.lt(1) && !isWearableActive({ name: "Ancient Rod", game })) {
    throw new Error(translate("error.missingRod"));
  }

  // Requires Bait
  const baitCount = game.inventory[action.bait] ?? new Decimal(0);
  if (baitCount.lt(1)) {
    throw new Error(`Missing ${action.bait}`);
  }

  if (game.fishing[location].castedAt) {
    throw new Error(translate("error.alreadyCasted"));
  }

  // Subtract Chum
  if (action.chum) {
    const chumAmount = CHUM_AMOUNTS[action.chum] ?? 0;
    if (!chumAmount) {
      throw new Error(`${action.chum} Axe is not a supported chum`);
    }

    const inventoryChum = game.inventory[action.chum] ?? new Decimal(0);

    if (inventoryChum.lt(chumAmount)) {
      throw new Error(`${translate("error.insufficientChum")}: ${action.chum}`);
    }

    game.inventory[action.chum] = inventoryChum.sub(chumAmount);
  }

  // Subtracts Rod
  if (!isWearableActive({ name: "Ancient Rod", game })) {
    game.inventory.Rod = rodCount.sub(1);
  }

  // Subtracts Bait
  game.inventory[action.bait] = baitCount.sub(1);

  // Casts Rod
  game.fishing = {
    ...game.fishing,
    [location]: {
      castedAt: createdAt,
      bait: action.bait,
      chum: action.chum,
    },
  };

  // Track daily attempts
  if (game.fishing.dailyAttempts && game.fishing.dailyAttempts[today]) {
    game.fishing.dailyAttempts[today] += 1;
  } else {
    game.fishing.dailyAttempts = {
      [today]: 1,
    };
  }

  bumpkin.activity = trackActivity("Rod Casted", bumpkin.activity);

  return {
    ...game,
  };
}
