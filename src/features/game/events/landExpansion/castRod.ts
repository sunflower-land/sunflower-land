import { BoostName, GameState } from "../../types/game";
import {
  CHUM_AMOUNTS,
  Chum,
  FishName,
  FishingBait,
  getDailyFishingLimit,
  getSeasonalGuaranteedCatch,
  isGuaranteedBait,
} from "features/game/types/fishing";
import Decimal from "decimal.js-light";
import { isWearableActive } from "features/game/lib/wearables";
import { translate } from "lib/i18n/translate";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { hasVipAccess } from "features/game/lib/vipAccess";

export type CastRodAction = {
  type: "rod.casted";
  bait: FishingBait;
  chum?: Chum;
  guaranteedCatch?: FishName;
  location?: string;
  reelPacksToBuy?: number;
  /**
   * Number of simultaneous casts. VIP only when > 1.
   */
  multiplier?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: CastRodAction;
  createdAt?: number;
};

const ALLOWED_MULTIPLIERS = new Set([1, 5, 10, 25]);
export const EXTRA_REELS_AMOUNT = 5;

export const getRemainingReels = (state: GameState, now = new Date()) => {
  const date = now.toISOString().split("T")[0];
  const { fishing } = state;
  const reelCount = fishing.dailyAttempts?.[date] ?? 0;
  const { extraReels = { count: 0 } } = fishing;
  const { limit: regularMaxReels } = getDailyFishingLimit(state, now.getTime());
  let reelsLeft = regularMaxReels - reelCount;

  if (reelsLeft < 0) {
    reelsLeft = 0;
  }

  reelsLeft += extraReels.count;

  return reelsLeft;
};

export function getReelsPackGemPrice({
  state,
  packs,
  createdAt = Date.now(),
}: {
  state: GameState;
  packs: number; // number of 5-reel packs
  createdAt?: number;
}): number {
  const today = new Date(createdAt).toISOString().split("T")[0];

  const { extraReels = { count: 0 } } = state.fishing;
  const { timesBought = {} } = extraReels;

  const basePrice = 10;
  const gemMultiplier = 2;

  const timesBoughtToday = timesBought[today] ?? 0;

  // Sum the cost of each pack at the incremented price scale
  let totalPrice = 0;
  for (let i = 0; i < packs; i++) {
    totalPrice += basePrice * gemMultiplier ** (timesBoughtToday + i);
  }

  return totalPrice;
}

export function castRod({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const now = new Date(createdAt);
    const today = new Date(now).toISOString().split("T")[0];

    // Initialize extraReels on game.fishing if it doesn't exist
    if (!game.fishing.extraReels) {
      game.fishing.extraReels = { count: 0 };
    }
    const extraReels = game.fishing.extraReels;

    const { limit: fishingLimit, boostsUsed: fishingBoostsUsed } =
      getDailyFishingLimit(game, createdAt);
    const boostsUsed: BoostName[] = [];
    boostsUsed.push(...fishingBoostsUsed);

    const multiplier = Math.max(1, Math.floor(action.multiplier ?? 1));

    if (!ALLOWED_MULTIPLIERS.has(multiplier)) {
      throw new Error("Invalid multiplier");
    }

    if (multiplier < 1) {
      throw new Error("Invalid multiplier");
    }

    // VIP gated feature
    if (multiplier > 1 && !hasVipAccess({ game, now: createdAt })) {
      throw new Error("VIP is required");
    }

    if (action.reelPacksToBuy) {
      const gemPrice = getReelsPackGemPrice({
        state,
        packs: action.reelPacksToBuy,
      });
      const gemsInventory = game.inventory.Gem ?? new Decimal(0);

      if (gemsInventory.lt(gemPrice)) {
        throw new Error("Player does not have enough Gems to buy more reels");
      }

      game.inventory.Gem = gemsInventory.sub(gemPrice);

      const packsBought = action.reelPacksToBuy ?? 0;

      if (extraReels.timesBought) {
        extraReels.timesBought[today] =
          (extraReels.timesBought[today] ?? 0) + packsBought;
      } else {
        extraReels.timesBought = {
          [today]: packsBought,
        };
      }

      extraReels.count += EXTRA_REELS_AMOUNT * packsBought;
    }

    const todayAttempts = game.fishing.dailyAttempts?.[today] ?? 0;
    const regularReelsRemaining = Math.max(0, fishingLimit - todayAttempts);
    const totalReelsAvailable = regularReelsRemaining + extraReels.count;

    if (totalReelsAvailable <= 0 || multiplier > totalReelsAvailable) {
      throw new Error(`Daily attempts exhausted`);
    }

    const rodCount = game.inventory.Rod ?? new Decimal(0);
    // Requires Rod
    if (
      rodCount.lt(multiplier) &&
      !isWearableActive({ name: "Ancient Rod", game })
    ) {
      throw new Error(translate("error.missingRod"));
    }

    // Requires Bait
    const baitCount = game.inventory[action.bait] ?? new Decimal(0);
    if (baitCount.lt(multiplier)) {
      throw new Error(`Missing ${action.bait}`);
    }

    if (action.guaranteedCatch && !isGuaranteedBait(action.bait)) {
      throw new Error("Invalid guaranteed catch");
    }

    if (isGuaranteedBait(action.bait)) {
      if (!action.guaranteedCatch) {
        throw new Error("Missing guaranteed catch");
      }

      const allowedFish = getSeasonalGuaranteedCatch(action.bait);

      if (!allowedFish.includes(action.guaranteedCatch)) {
        throw new Error("Invalid guaranteed catch");
      }
      // Chum has no effect with guaranteed bait—block it to prevent waste
      if (action.chum) {
        throw new Error("Chum cannot be used with guaranteed bait");
      }
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
      const chumRequired = chumAmount * multiplier;

      if (inventoryChum.lt(chumRequired)) {
        throw new Error(
          `${translate("error.insufficientChum")}: ${action.chum}`,
        );
      }

      game.inventory[action.chum] = inventoryChum.sub(chumRequired);
    }

    // Subtracts Rod
    if (!isWearableActive({ name: "Ancient Rod", game })) {
      game.inventory.Rod = rodCount.sub(multiplier);
    } else {
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: ["Ancient Rod"],
        createdAt,
      });
    }

    // Subtracts Bait
    game.inventory[action.bait] = baitCount.sub(multiplier);

    // Casts Rod
    game.fishing = {
      ...game.fishing,
      wharf: {
        castedAt: createdAt,
        bait: action.bait,
        chum: action.chum,
        multiplier,
        guaranteedCatch: action.guaranteedCatch,
      },
    };

    // Track daily attempts
    const attemptsBefore = todayAttempts;
    const attemptsAfter = todayAttempts + multiplier;
    const overBefore = Math.max(0, attemptsBefore - fishingLimit);
    const overAfter = Math.max(0, attemptsAfter - fishingLimit);
    const extraReelsUsed = Math.max(0, overAfter - overBefore);

    if (extraReelsUsed > 0) {
      extraReels.count -= extraReelsUsed;
    }

    if (game.fishing.dailyAttempts && game.fishing.dailyAttempts[today]) {
      game.fishing.dailyAttempts[today] += multiplier;
    } else {
      game.fishing.dailyAttempts = {
        [today]: multiplier,
      };
    }

    game.farmActivity = trackFarmActivity(
      "Rod Casted",
      game.farmActivity,
      new Decimal(multiplier),
    );

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: [...boostsUsed],
      createdAt,
    });
  });
}
