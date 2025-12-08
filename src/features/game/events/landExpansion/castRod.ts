import { BoostName, GameState } from "../../types/game";
import {
  CHUM_AMOUNTS,
  Chum,
  FishingBait,
  getDailyFishingCount,
  getDailyFishingLimit,
} from "features/game/types/fishing";
import Decimal from "decimal.js-light";
import { isWearableActive } from "features/game/lib/wearables";
import { translate } from "lib/i18n/translate";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type CastRodAction = {
  type: "rod.casted";
  bait: FishingBait;
  chum?: Chum;
  location?: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CastRodAction;
  createdAt?: number;
};

export const getRemainingReels = (state: GameState, now = new Date()) => {
  const date = now.toISOString().split("T")[0];
  const { fishing } = state;
  const reelCount = fishing.dailyAttempts?.[date] ?? 0;
  const { extraReels = { count: 0 } } = fishing;
  const { limit: regularMaxReels } = getDailyFishingLimit(state);
  let reelsLeft = regularMaxReels - reelCount;

  if (reelsLeft < 0) {
    reelsLeft = 0;
  }

  reelsLeft += extraReels.count;

  return reelsLeft;
};

export function castRod({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { bumpkin } = game;
    const now = new Date(createdAt);
    const today = new Date(now).toISOString().split("T")[0];

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }
    const { extraReels = { count: 0 } } = game.fishing;
    const { limit: fishingLimit, boostsUsed: fishingBoostsUsed } =
      getDailyFishingLimit(game);
    const boostsUsed: BoostName[] = [];
    boostsUsed.push(...fishingBoostsUsed);
    if (getDailyFishingCount(game) >= fishingLimit && extraReels.count === 0) {
      throw new Error(`Daily attempts exhausted`);
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

    if (game.fishing.wharf.castedAt) {
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
        throw new Error(
          `${translate("error.insufficientChum")}: ${action.chum}`,
        );
      }

      game.inventory[action.chum] = inventoryChum.sub(chumAmount);
    }

    // Subtracts Rod
    if (!isWearableActive({ name: "Ancient Rod", game })) {
      game.inventory.Rod = rodCount.sub(1);
    } else {
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: ["Ancient Rod"],
        createdAt,
      });
    }

    // Subtracts Bait
    game.inventory[action.bait] = baitCount.sub(1);

    // Casts Rod
    game.fishing = {
      ...game.fishing,
      wharf: {
        castedAt: createdAt,
        bait: action.bait,
        chum: action.chum,
      },
    };

    if (getDailyFishingCount(game) >= fishingLimit) {
      extraReels.count -= 1;
    }

    // Track daily attempts
    if (game.fishing.dailyAttempts && game.fishing.dailyAttempts[today]) {
      game.fishing.dailyAttempts[today] += 1;
    } else {
      game.fishing.dailyAttempts = {
        [today]: 1,
      };
    }

    game.farmActivity = trackFarmActivity("Rod Casted", game.farmActivity);

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: [...boostsUsed],
      createdAt,
    });

    return game;
  });
}
