import Decimal from "decimal.js-light";

import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

import type { BoostName, GameState } from "features/game/types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { type SeedName, SEEDS } from "features/game/types/seeds";
import { isWearableActive } from "features/game/lib/wearables";
import { FLOWER_SEEDS } from "features/game/types/flowers";
import { produce } from "immer";
import {
  GREENHOUSE_FRUIT_SEEDS,
  type GreenHouseFruitSeedName,
  isPatchFruitSeed,
} from "features/game/types/fruits";
import {
  GREENHOUSE_SEEDS,
  type GreenHouseCropSeedName,
} from "features/game/types/crops";
import { isFullMoon } from "features/game/types/calendar";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import {
  CHAPTER_CROP_WEEK_SEED,
  isChapterCropWeekActive,
} from "features/game/types/chapterCropWeek";

export type SeedBoughtAction = {
  type: "seed.bought";
  item: SeedName;
  amount: number;
};

export function getBuyPrice(
  name: SeedName,
  seed: { price: number },
  game: GameState,
): { price: number; boostsUsed: { name: BoostName; value: string }[] } {
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const { inventory, bumpkin } = game;

  if (isCollectibleBuilt({ name: "Kuebiko", game })) {
    boostsUsed.push({ name: "Kuebiko", value: "Free" });
    return { price: 0, boostsUsed };
  }
  if (
    name in FLOWER_SEEDS &&
    isCollectibleBuilt({ name: "Hungry Caterpillar", game })
  ) {
    boostsUsed.push({ name: "Hungry Caterpillar", value: "Free" });
    return { price: 0, boostsUsed };
  }

  if (
    isWearableActive({ name: "Sunflower Shield", game }) &&
    name === "Sunflower Seed"
  ) {
    boostsUsed.push({ name: "Sunflower Shield", value: "Free" });
    return { price: 0, boostsUsed };
  }

  let price = seed.price;

  // Ladybug Suit 25% Onion Cost
  if (
    name === "Onion Seed" &&
    isWearableActive({ name: "Ladybug Suit", game })
  ) {
    boostsUsed.push({ name: "Ladybug Suit", value: "x0.75" });
    price = price * 0.75;
  }

  //LEGACY SKILL Contributor Artist Skill

  if (price && inventory.Artist?.gte(1)) {
    boostsUsed.push({ name: "Artist", value: "x0.9" });
    price = price * 0.9;
  }

  const flowerSaleLevel = getSkillLevel(bumpkin.skills, "Flower Sale");
  if (name in FLOWER_SEEDS && flowerSaleLevel) {
    const multiplier = SKILL_RANKS["Flower Sale"].ranks[flowerSaleLevel - 1];
    boostsUsed.push({ name: "Flower Sale", value: `x${multiplier}` });
    price = price * multiplier;
  }

  const fruityHeavenLevel = getSkillLevel(bumpkin.skills, "Fruity Heaven");
  if (isPatchFruitSeed(name) && fruityHeavenLevel) {
    const value = SKILL_RANKS["Fruity Heaven"].ranks[fruityHeavenLevel - 1];
    boostsUsed.push({ name: "Fruity Heaven", value: `x${value}` });
    price = price * value;
  }

  const seedyBusinessLevel = getSkillLevel(bumpkin.skills, "Seedy Business");
  if (
    name in { ...GREENHOUSE_SEEDS, ...GREENHOUSE_FRUIT_SEEDS } &&
    seedyBusinessLevel
  ) {
    const value = SKILL_RANKS["Seedy Business"].ranks[seedyBusinessLevel - 1];
    boostsUsed.push({ name: "Seedy Business", value: `x${value}` });
    price = price * value;
  }

  return { price, boostsUsed };
}

export const isGreenhouseCropSeed = (
  seedName: SeedName,
): seedName is GreenHouseCropSeedName => seedName in GREENHOUSE_SEEDS;

export const isGreenhouseFruitSeed = (
  seedName: SeedName,
): seedName is GreenHouseFruitSeedName => seedName in GREENHOUSE_FRUIT_SEEDS;

export type FullMoonSeed = Extract<
  SeedName,
  "Celestine Seed" | "Lunara Seed" | "Duskberry Seed"
>;

export const FULL_MOON_SEEDS: FullMoonSeed[] = [
  "Celestine Seed",
  "Lunara Seed",
  "Duskberry Seed",
];

export const isFullMoonBerry = (seedName: SeedName): seedName is FullMoonSeed =>
  FULL_MOON_SEEDS.includes(seedName as FullMoonSeed);

type Options = {
  state: Readonly<GameState>;
  action: SeedBoughtAction;
  createdAt?: number;
};

export function seedBought({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { item, amount } = action;

    if (isFullMoonBerry(item) && !isFullMoon(state)) {
      throw new Error("Not a full moon");
    }

    // Chapter Crop Week event seed is only available while the event is active
    if (
      item === CHAPTER_CROP_WEEK_SEED &&
      !isChapterCropWeekActive(createdAt)
    ) {
      throw new Error("Chapter Crop Week is not active");
    }

    if (!(item in SEEDS)) {
      throw new Error("This item is not a seed");
    }

    const { bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    const userLevel = getAscensionLevel({
      experience: stateCopy.bumpkin.experience ?? 0,
      ascensionLevel: stateCopy.island.ascensionLevel ?? 0,
    });
    const seed = SEEDS[item];

    if (!meetsLevelRequirement(userLevel, seed.bumpkinLevel)) {
      throw new Error("Inadequate level");
    }

    if (amount < 1) {
      throw new Error("Invalid amount");
    }

    if (stateCopy.stock[item]?.lt(amount)) {
      throw new Error("Not enough stock");
    }

    const requiredPlantingSpot = seed.plantingSpot;

    if (
      requiredPlantingSpot &&
      stateCopy.inventory[requiredPlantingSpot]?.lessThan(1)
    ) {
      throw new Error(
        "You do not have the planting spot needed to plant this seed",
      );
    }

    const { price, boostsUsed } = getBuyPrice(item, seed, stateCopy);
    const totalExpenses = price * amount;

    if (totalExpenses && stateCopy.coins < totalExpenses) {
      throw new Error("Insufficient tokens");
    }

    const oldAmount = stateCopy.inventory[item] ?? new Decimal(0);

    const inventoryLimit = INVENTORY_LIMIT(state)[item] ?? new Decimal(0);
    if (oldAmount.add(amount).gt(inventoryLimit)) {
      throw new Error("Can't buy more seeds than the inventory limit");
    }

    stateCopy.farmActivity = trackFarmActivity(
      `${item} Bought`,
      stateCopy.farmActivity,
      new Decimal(amount),
    );

    stateCopy.coins = stateCopy.coins - totalExpenses;
    stateCopy.farmActivity = trackFarmActivity(
      "Coins Spent",
      stateCopy.farmActivity,
      new Decimal(totalExpenses),
    );

    stateCopy.inventory[action.item] = oldAmount.add(amount) as Decimal;
    stateCopy.stock[item] = stateCopy.stock[item]?.minus(amount) as Decimal;

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
