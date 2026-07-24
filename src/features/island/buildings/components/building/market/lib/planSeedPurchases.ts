import Decimal from "decimal.js-light";

import type { GameState } from "features/game/types/game";
import { SEEDS, type SeedName } from "features/game/types/seeds";
import {
  getBuyPrice,
  isFullMoonBerry,
} from "features/game/events/landExpansion/seedBought";
import { isFullMoon } from "features/game/types/calendar";
import {
  CHAPTER_CROP_WEEK_SEED,
  isChapterCropWeekActive,
} from "features/game/types/chapterCropWeek";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import { setPrecision } from "lib/utils/formatNumber";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { makeBulkBuySeeds } from "./makeBulkBuyAmount";

export type SeedPurchase = {
  seedName: SeedName;
  amount: number;
  price: number;
};

export type SeedPurchasePlan = {
  purchases: SeedPurchase[];
  totalCost: number;
};

function isSeedLocked(seedName: SeedName, state: GameState) {
  return !meetsLevelRequirement(
    getAscensionLevel({
      experience: state.bumpkin?.experience ?? 0,
      ascensionLevel: state.island.ascensionLevel ?? 0,
    }),
    SEEDS[seedName].bumpkinLevel,
  );
}

/**
 * Greedily plans the maximum affordable amount of each seed, spending from
 * a single shared coin pool in the given order. Skips seeds that are
 * locked, out of stock, would exceed the inventory limit, whose planting
 * spot isn't owned yet, or that are already unaffordable by the time their
 * turn comes up.
 */
export function planSeedPurchases(
  state: GameState,
  seedNames: SeedName[],
): SeedPurchasePlan {
  let remainingCoins = state.coins;
  const purchases: SeedPurchase[] = [];
  const seen = new Set<SeedName>();
  // state doesn't change during the loop, so this only needs computing once
  // instead of once per candidate seed.
  const inventoryLimits = INVENTORY_LIMIT(state);

  seedNames.forEach((seedName) => {
    if (seen.has(seedName)) return;
    seen.add(seedName);

    const seed = SEEDS[seedName];

    // Mirrors seedBought.ts exactly: full moon seeds are only purchasable
    // during a Full Moon. In practice their stock is 0 outside one anyway,
    // but asserting this directly avoids relying on that as an implicit
    // guarantee.
    if (isFullMoonBerry(seedName) && !isFullMoon(state)) return;

    // Mirrors seedBought.ts exactly: the Chapter Crop Week event seed is
    // only purchasable while the event is active.
    if (
      seedName === CHAPTER_CROP_WEEK_SEED &&
      !isChapterCropWeekActive(Date.now())
    ) {
      return;
    }

    // Mirrors the planting-spot check in seedBought.ts exactly: skip when
    // the spot is required and either missing from inventory entirely or
    // present with less than 1.
    const requiredPlantingSpot = seed.plantingSpot;
    if (
      requiredPlantingSpot &&
      (state.inventory[requiredPlantingSpot] ?? new Decimal(0)).lessThan(1)
    ) {
      return;
    }
    if (isSeedLocked(seedName, state)) return;

    const stock = state.stock[seedName] ?? new Decimal(0);
    const inventoryLimit = inventoryLimits[seedName] ?? new Decimal(0);
    const inventoryAmount = setPrecision(
      state.inventory[seedName] ?? new Decimal(0),
      2,
    );
    const bulkBuyLimit = inventoryLimit.minus(inventoryAmount);

    let amount = makeBulkBuySeeds(stock, bulkBuyLimit);

    if (amount <= 0) return;

    const { price } = getBuyPrice(seedName, seed, state);

    if (price > 0) {
      const affordableByCoins = Math.floor(remainingCoins / price);
      amount = Math.min(amount, affordableByCoins);
    }

    if (amount <= 0) return;

    purchases.push({ seedName, amount, price });
    remainingCoins -= amount * price;
  });

  const totalCost = purchases.reduce(
    (sum, purchase) => sum + purchase.amount * purchase.price,
    0,
  );

  return { purchases, totalCost };
}
