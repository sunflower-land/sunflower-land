import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { isWearableActive } from "features/game/lib/wearables";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  FLOWER_CROSS_BREED_AMOUNTS,
  FLOWER_SEEDS,
  type FlowerCrossBreedName,
  FLOWERS,
  type FlowerSeedName,
  isFlowerSeed,
} from "features/game/types/flowers";
import type { BoostName, GameState } from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { produce } from "immer";
import { SEASONAL_SEEDS } from "features/game/types/seeds";
import { getKeys } from "lib/object";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { hasFeatureAccess } from "lib/flags";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";

export type PlantFlowerAction = {
  type: "flower.planted";
  id: string;
  seed: FlowerSeedName;
  crossbreed: FlowerCrossBreedName;
};

type Options = {
  state: Readonly<GameState>;
  action: PlantFlowerAction;
  createdAt?: number;
};

export const getFlowerTime = (
  seed: FlowerSeedName,
  game: GameState,
  /**
   * Whether the windowed speed-rate model applies. Defaults to the SPEED_BOOSTS
   * flag. When true, the temporary boosts (Blossom Hourglass + Moth Shrine's TIME
   * half) are EXCLUDED from the baked time — they're derived live from boost
   * windows instead (see getFlowerBoostWindows) — leaving only permanent boosts.
   */
  windowed = hasFeatureAccess(game, "SPEED_BOOSTS"),
): { seconds: number; boostsUsed: { name: BoostName; value: string }[] } => {
  const { bumpkin } = game;

  let seconds = FLOWER_SEEDS[seed].plantSeconds;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  // If wearing Flower Crown 2x speed
  if (isWearableActive({ name: "Flower Crown", game })) {
    seconds *= 0.5;
    boostsUsed.push({ name: "Flower Crown", value: "x0.5" });
  }

  // Moth Shrine's grow-TIME half is windowed under the speed-rate model, so it's
  // excluded here (and from boostsUsed); its +1-flower yield still fires at harvest.
  if (
    !windowed &&
    isTemporaryCollectibleActive({ name: "Moth Shrine", game })
  ) {
    seconds *= 0.75;
    boostsUsed.push({ name: "Moth Shrine", value: "x0.75" });
  }

  // If Flower Fox is built gives 10% speed boost
  if (isCollectibleBuilt({ name: "Flower Fox", game })) {
    seconds *= 0.9;
    boostsUsed.push({ name: "Flower Fox", value: "x0.9" });
  }

  // Blossom Hourglass is windowed under the speed-rate model (excluded here).
  if (
    !windowed &&
    isTemporaryCollectibleActive({ name: "Blossom Hourglass", game })
  ) {
    seconds *= 0.75;
    boostsUsed.push({ name: "Blossom Hourglass", value: "x0.75" });
  }

  const bloomingBoostLevel = getSkillLevel(bumpkin.skills, "Blooming Boost");
  if (bloomingBoostLevel) {
    const multiplier =
      SKILL_RANKS["Blooming Boost"].ranks[bloomingBoostLevel - 1];
    seconds *= multiplier;
    boostsUsed.push({ name: "Blooming Boost", value: `x${multiplier}` });
  }

  const flowerPowerLevel = getSkillLevel(bumpkin.skills, "Flower Power");
  if (flowerPowerLevel) {
    const multiplier = SKILL_RANKS["Flower Power"].ranks[flowerPowerLevel - 1];
    seconds *= multiplier;
    boostsUsed.push({ name: "Flower Power", value: `x${multiplier}` });
  }

  const floweryAbodeLevel = getSkillLevel(bumpkin.skills, "Flowery Abode");
  if (floweryAbodeLevel) {
    const multiplier =
      SKILL_RANKS["Flowery Abode"].growth[floweryAbodeLevel - 1];
    seconds *= multiplier;
    boostsUsed.push({ name: "Flowery Abode", value: `x${multiplier}` });
  }

  return { seconds, boostsUsed };
};

type GetPlantedAtArgs = {
  seed: FlowerSeedName;
  game: GameState;
  createdAt: number;
};

/**
 * Resolve a flower's stored timing at plant time, across both boost models.
 *
 * Speed-rate model (SPEED_BOOSTS on): store the REAL plantedAt + a `baseDurationMs`
 * carrying only the permanent boosts. The temporary boosts (Blossom Hourglass /
 * Moth Shrine) are derived live from windows so they credit only the overlap and
 * apply retroactively. Legacy / flag-off back-dates plantedAt into the past so the
 * flower grows faster. Flowers are one-shot (no replenish), so there is no
 * forceWindowed / stickiness — every plant is a fresh windowed-or-legacy decision.
 */
export function getPlantedAt({ seed, game, createdAt }: GetPlantedAtArgs): {
  plantedAt: number;
  baseDurationMs?: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const windowed = hasFeatureAccess(game, "SPEED_BOOSTS");

  const flowerTime = FLOWER_SEEDS[seed].plantSeconds;
  const { seconds: boostedTime, boostsUsed } = getFlowerTime(
    seed,
    game,
    windowed,
  );

  if (windowed) {
    return {
      plantedAt: createdAt,
      baseDurationMs: boostedTime * 1000,
      boostsUsed,
    };
  }

  const offset = flowerTime - boostedTime;

  return { plantedAt: createdAt - offset * 1000, boostsUsed };
}

export function plantFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { flowers, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const flowerBed = flowers.flowerBeds[action.id];

    if (!flowerBed) {
      throw new Error(translate("harvestflower.noFlowerBed"));
    }

    if (flowerBed.x === undefined && flowerBed.y === undefined) {
      throw new Error("Flower bed is not placed");
    }

    if (flowerBed.flower?.plantedAt) {
      throw new Error(translate("harvestflower.alr.plant"));
    }

    if (!isFlowerSeed(action.seed)) {
      throw new Error("Not a flower seed");
    }

    if (!SEASONAL_SEEDS[state.season.season].includes(action.seed)) {
      throw new Error(`${action.seed} is not in season`);
    }

    const seedCount = stateCopy.inventory[action.seed] ?? new Decimal(0);

    if (seedCount.lessThan(1)) {
      throw new Error("Not enough seeds");
    }

    const crossBreedCount =
      stateCopy.inventory[action.crossbreed] ?? new Decimal(0);
    const crossBreedAmount =
      FLOWER_CROSS_BREED_AMOUNTS[action.seed][action.crossbreed];

    if (!crossBreedAmount) {
      throw new Error("Not a valid crossbreed");
    }

    if (crossBreedCount.lessThan(crossBreedAmount)) {
      throw new Error("Not enough crossbreeds");
    }

    stateCopy.inventory[action.seed] = seedCount.minus(1);
    stateCopy.inventory[action.crossbreed] =
      crossBreedCount.minus(crossBreedAmount);

    const seedFlowers = getKeys(FLOWERS).filter(
      (flowerName) => FLOWERS[flowerName].seed === action.seed,
    );
    const flower = seedFlowers.find((seedFlower) =>
      (flowers.discovered[seedFlower] ?? []).includes(action.crossbreed),
    );

    const { plantedAt, baseDurationMs, boostsUsed } = getPlantedAt({
      seed: action.seed,
      game: stateCopy,
      createdAt,
    });

    flowerBed.flower = {
      plantedAt,
      name: flower ?? "Red Lotus",
      crossbreed: action.crossbreed,
      dirty: !flower,
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

    const updatedBeehives = updateBeehives({
      game: stateCopy,
      createdAt,
    });

    stateCopy.beehives = updatedBeehives;

    return stateCopy;
  });
}
