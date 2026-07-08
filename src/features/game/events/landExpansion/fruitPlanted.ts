import Decimal from "decimal.js-light";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  type GreenHouseFruitSeedName,
  isPatchFruitSeed,
  PATCH_FRUIT_SEEDS,
  type PatchFruitSeedName,
} from "features/game/types/fruits";
import type { BoostName, GameState } from "features/game/types/game";
import { randomInt } from "lib/utils/random";
import { isWearableActive } from "features/game/lib/wearables";
import { hasFeatureAccess } from "lib/flags";
import { produce } from "immer";
import { SEASONAL_SEEDS } from "features/game/types/seeds";
import { isFullMoonBerry } from "./seedBought";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import type { FruitCompostName } from "features/game/types/composters";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";

export type PlantFruitAction = {
  type: "fruit.planted";
  index: string;
  seed: PatchFruitSeedName;
};
function getDefaultHarvestsLeft() {
  return randomInt(3, 6);
}

function getHarvestsLeft({
  state,
  harvestsLeft = getDefaultHarvestsLeft,
}: {
  state: GameState;
  harvestsLeft?: () => number;
}) {
  let harvestCount = harvestsLeft();

  if (isCollectibleBuilt({ name: "Immortal Pear", game: state })) {
    // Pear Turbocharge multiplies Immortal Pear's base +1 harvest by 2x/3x/4x
    const pearTurbochargeLevel = getSkillLevel(
      state.bumpkin.skills,
      "Pear Turbocharge",
    );
    if (pearTurbochargeLevel) {
      harvestCount +=
        SKILL_RANKS["Pear Turbocharge"].ranks[pearTurbochargeLevel - 1];
    } else {
      harvestCount += 1;
    }
  }
  return { harvestCount };
}

function getHarvestRange({ state }: { state: GameState }) {
  let minHarvest = 3;
  let maxHarvest = 5;
  if (isCollectibleBuilt({ name: "Immortal Pear", game: state })) {
    const pearTurbochargeLevel = getSkillLevel(
      state.bumpkin.skills,
      "Pear Turbocharge",
    );
    const bonus = pearTurbochargeLevel
      ? SKILL_RANKS["Pear Turbocharge"].ranks[pearTurbochargeLevel - 1]
      : 1;
    minHarvest += bonus;
    maxHarvest += bonus;
  }

  return { minHarvest, maxHarvest };
}

export function getPlantedAt(
  patchFruitSeedName: PatchFruitSeedName,
  game: GameState,
  createdAt: number,
  fruitPatchFertiliser?: FruitCompostName,
  // Force the windowed model regardless of the flag. The replenish path passes
  // true when the fruit already carries a `baseDurationMs` marker so it stays
  // windowed after a flag rollback (rather than reverting to legacy mid-life).
  forceWindowed = false,
): {
  plantedAt: number;
  baseDurationMs?: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  if (!patchFruitSeedName) return { plantedAt: createdAt, boostsUsed: [] };

  const windowed = forceWindowed || hasFeatureAccess(game, "SPEED_BOOSTS");

  const fruitTime = PATCH_FRUIT_SEEDS[patchFruitSeedName].plantSeconds;
  const { seconds: boostedTime, boostsUsed } = getFruitPatchTime(
    patchFruitSeedName,
    game,
    fruitPatchFertiliser,
    windowed,
  );

  // Speed-rate model: store the REAL plant/harvest time + a baseDurationMs
  // carrying only the permanent boosts. The temporary boosts (totems / Orchard
  // Hourglass / Toucan Shrine) are derived live from windows so they credit only
  // the overlap and apply retroactively. Legacy / flag-off back-dates instead.
  if (windowed) {
    return {
      plantedAt: createdAt,
      baseDurationMs: boostedTime * 1000,
      boostsUsed,
    };
  }

  const offset = fruitTime - boostedTime;

  return { plantedAt: createdAt - offset * 1000, boostsUsed };
}

export const isBasicFruitSeed = (
  name: PatchFruitSeedName | GreenHouseFruitSeedName,
) => name === "Blueberry Seed" || name === "Orange Seed";

export const isAdvancedFruitSeed = (
  name: PatchFruitSeedName | GreenHouseFruitSeedName,
) => name === "Apple Seed" || name === "Banana Plant";

/**
 * Generic boost for all fruit types - normal + greenhouse.
 *
 * Under SPEED_BOOSTS the two totems are a windowed 2× speed boost for BOTH
 * fruit consumers — patch fruit and greenhouse fruit (see boostWindows) — so
 * they're excluded from the baked time here. The flag-off path keeps the
 * legacy discount-at-start.
 */
export function getFruitTime({
  game,
  windowed = hasFeatureAccess(game, "SPEED_BOOSTS"),
}: {
  game: GameState;
  /**
   * Whether the windowed speed-rate model applies. Defaults to the SPEED_BOOSTS
   * flag; the replenish path forces it true for a fruit that already carries a
   * `baseDurationMs` marker, so it stays windowed even after a flag rollback.
   */
  windowed?: boolean;
}): {
  multiplier: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let seconds = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const hasSuperTotem = isTemporaryCollectibleActive({
    name: "Super Totem",
    game,
  });
  const hasTimeWarpTotem = isTemporaryCollectibleActive({
    name: "Time Warp Totem",
    game,
  });
  // Under the windowed model the totems' contribution is derived over the grow
  // rather than baked at plant time, so it's not recorded in boostsUsed either.
  const totemsWindowed = windowed;
  if (!totemsWindowed && (hasSuperTotem || hasTimeWarpTotem)) {
    seconds = seconds * 0.5;
    if (hasSuperTotem) boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    if (hasTimeWarpTotem)
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
  }

  return { multiplier: seconds, boostsUsed };
}

/**
 * Based on boosts, how long a fruit will take to grow
 */
export const getFruitPatchTime = (
  patchFruitSeedName: PatchFruitSeedName,
  game: GameState,
  fruitPatchFertiliser?: FruitCompostName,
  // Whether the windowed speed-rate model applies (see getFruitTime). Defaults
  // to the flag; forced true by the replenish path for already-windowed fruit.
  windowed = hasFeatureAccess(game, "SPEED_BOOSTS"),
): { seconds: number; boostsUsed: { name: BoostName; value: string }[] } => {
  const { bumpkin } = game;
  let seconds = PATCH_FRUIT_SEEDS[patchFruitSeedName]?.plantSeconds ?? 0;

  const { multiplier: baseMultiplier, boostsUsed } = getFruitTime({
    game,
    windowed,
  });
  seconds *= baseMultiplier;

  // Squirrel Monkey: 50% reduction
  if (
    patchFruitSeedName === "Orange Seed" &&
    isCollectibleBuilt({ name: "Squirrel Monkey", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Squirrel Monkey", value: "x0.5" });
  }

  // Nana: 10% reduction
  if (
    patchFruitSeedName === "Banana Plant" &&
    isCollectibleBuilt({ name: "Nana", game })
  ) {
    seconds = seconds * 0.9;
    boostsUsed.push({ name: "Nana", value: "x0.9" });
  }

  // Banana Onesie: 20% reduction
  if (
    patchFruitSeedName === "Banana Plant" &&
    isWearableActive({ name: "Banana Onesie", game })
  ) {
    seconds = seconds * 0.8;
    boostsUsed.push({ name: "Banana Onesie", value: "x0.8" });
  }

  // Fruit Tune Box: 20% reduction
  if (isCollectibleBuilt({ name: "Fruit Tune Box", game })) {
    seconds = seconds * 0.8;
    boostsUsed.push({ name: "Fruit Tune Box", value: "x0.8" });
  }

  // Lemon Tea Bath: 50% reduction
  if (
    patchFruitSeedName === "Lemon Seed" &&
    isCollectibleBuilt({ name: "Lemon Tea Bath", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Lemon Tea Bath", value: "x0.5" });
  }

  // Lemon Frog: 25% reduction
  if (
    patchFruitSeedName === "Lemon Seed" &&
    isCollectibleBuilt({ name: "Lemon Frog", game })
  ) {
    seconds = seconds * 0.75;
    boostsUsed.push({ name: "Lemon Frog", value: "x0.75" });
  }

  // Tomato Clown: 50% reduction
  if (
    patchFruitSeedName === "Tomato Seed" &&
    isCollectibleBuilt({ name: "Tomato Clown", game })
  ) {
    seconds = seconds * 0.5;
    boostsUsed.push({ name: "Tomato Clown", value: "x0.5" });
  }

  // Cannon
  if (
    patchFruitSeedName === "Tomato Seed" &&
    isCollectibleBuilt({ name: "Cannonball", game })
  ) {
    seconds = seconds * 0.75;
    boostsUsed.push({ name: "Cannonball", value: "x0.75" });
  }

  // Catchup Skill: 10%/15%/20% growth-time reduction (scales with rank)
  const catchupLevel = getSkillLevel(bumpkin.skills, "Catchup");
  if (catchupLevel) {
    const value = SKILL_RANKS["Catchup"].ranks[catchupLevel - 1];
    seconds = seconds * value;
    boostsUsed.push({ name: "Catchup", value: `x${value}` });
  }

  // Long Pickings - faster Apple/Banana growth, slower for the rest (scales with rank)
  const longPickingsLevel = getSkillLevel(bumpkin.skills, "Long Pickings");
  if (longPickingsLevel) {
    const { buff, debuff } = SKILL_RANKS["Long Pickings"];
    const value = isAdvancedFruitSeed(patchFruitSeedName)
      ? buff[longPickingsLevel - 1]
      : debuff[longPickingsLevel - 1];
    seconds = seconds * value;
    boostsUsed.push({ name: "Long Pickings", value: `x${value}` });
  }

  // Short Pickings - faster Blueberry/Orange growth, slower for the rest (scales with rank)
  const shortPickingsLevel = getSkillLevel(bumpkin.skills, "Short Pickings");
  if (shortPickingsLevel) {
    const { buff, debuff } = SKILL_RANKS["Short Pickings"];
    const value = isBasicFruitSeed(patchFruitSeedName)
      ? buff[shortPickingsLevel - 1]
      : debuff[shortPickingsLevel - 1];
    seconds = seconds * value;
    boostsUsed.push({ name: "Short Pickings", value: `x${value}` });
  }

  // Orchard Hourglass & Toucan Shrine: under the windowed model these are
  // retroactive speed-rate windows for patch fruit (see boostWindows), so
  // excluded from the baked time here — the remaining time is the permanent-
  // boost-only base duration. Flag-off keeps the discount-at-start. Not recorded
  // in boostsUsed for the windowed case; their contribution is derived over the
  // grow.
  if (
    !windowed &&
    isTemporaryCollectibleActive({ name: "Orchard Hourglass", game })
  ) {
    seconds *= 0.75;
    boostsUsed.push({ name: "Orchard Hourglass", value: "x0.75" });
  }

  if (
    !windowed &&
    isTemporaryCollectibleActive({ name: "Toucan Shrine", game })
  ) {
    seconds *= 0.75;
    boostsUsed.push({ name: "Toucan Shrine", value: "x0.75" });
  }

  // Turbofruit Mix: under the windowed model it's a live per-patch 1.25× speed
  // window from when it was applied (see getTurbofruitMixWindows), so excluded
  // from the baked time here. Flag-off keeps the legacy ×0.8 discount-at-start.
  if (!windowed && fruitPatchFertiliser === "Turbofruit Mix") {
    seconds *= 0.8;
    boostsUsed.push({ name: "Turbofruit Mix", value: "x0.8" });
  }

  return { seconds, boostsUsed };
};

type Options = {
  state: Readonly<GameState>;
  action: PlantFruitAction;
  createdAt?: number;
  harvestsLeft?: () => number;
};

export function plantFruit({
  state,
  action,
  createdAt = Date.now(),
  harvestsLeft = getDefaultHarvestsLeft,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { fruitPatches, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const patch = fruitPatches[action.index];

    if (!patch) {
      throw new Error("Fruit patch does not exist");
    }

    if (patch.x === undefined && patch.y === undefined) {
      throw new Error("Fruit patch is not placed");
    }

    if (patch.fruit?.plantedAt) {
      throw new Error("Fruit is already planted");
    }

    if (!isPatchFruitSeed(action.seed)) {
      throw new Error("Not a fruit seed");
    }

    const seedCount = stateCopy.inventory[action.seed] || new Decimal(0);

    if (seedCount.lessThan(1)) {
      throw new Error("Not enough seeds");
    }

    if (
      !SEASONAL_SEEDS[stateCopy.season.season].includes(action.seed) &&
      !isFullMoonBerry(action.seed)
    ) {
      throw new Error("This seed is not available in this season");
    }

    if (isFullMoonBerry(action.seed)) {
      harvestsLeft = () => 4;
    }

    const { harvestCount } = getHarvestsLeft({
      state: stateCopy,
      harvestsLeft,
    });

    const { minHarvest, maxHarvest } = getHarvestRange({ state: stateCopy });

    const invalidAmount =
      harvestCount > maxHarvest || harvestCount < minHarvest;

    if (invalidAmount) {
      throw new Error("Invalid harvests left amount");
    }

    stateCopy.inventory[action.seed] =
      stateCopy.inventory[action.seed]?.minus(1);

    const fruitName = PATCH_FRUIT_SEEDS[action.seed].yield;
    const { plantedAt, baseDurationMs, boostsUsed } = getPlantedAt(
      action.seed,
      stateCopy,
      createdAt,
      patch.fertiliser?.name,
    );
    patch.fruit = {
      name: fruitName,
      plantedAt,
      harvestedAt: 0,
      // Value will be overridden by BE
      harvestsLeft: harvestCount,
      // Speed-rate model marker: real plantedAt + permanent-boost-only base
      // duration; the windowed temp boosts are derived live at read time.
      ...(baseDurationMs !== undefined ? { baseDurationMs } : {}),
    };

    stateCopy.farmActivity = trackFarmActivity(
      `${action.seed} Planted`,
      stateCopy.farmActivity,
    );

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
