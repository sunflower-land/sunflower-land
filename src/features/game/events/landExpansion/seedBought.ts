import Decimal from "decimal.js-light";

import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

import { BoostName, GameState } from "features/game/types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getBumpkinLevel } from "features/game/lib/level";
import { SeedName, SEEDS } from "features/game/types/seeds";
import { isWearableActive } from "features/game/lib/wearables";
import { FLOWER_SEEDS } from "features/game/types/flowers";
import { produce } from "immer";
import {
  GREENHOUSE_FRUIT_SEEDS,
  GreenHouseFruitSeedName,
  isPatchFruitSeed,
} from "features/game/types/fruits";
import {
  GREENHOUSE_SEEDS,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import { isFullMoon } from "features/game/types/calendar";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { INVENTORY_LIMIT } from "features/game/lib/constants";

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

  if (name in FLOWER_SEEDS && bumpkin.skills["Flower Sale"]) {
    boostsUsed.push({ name: "Flower Sale", value: "x0.8" });
    price = price * 0.8;
  }

  if (isPatchFruitSeed(name) && bumpkin.skills["Fruity Heaven"]) {
    boostsUsed.push({ name: "Fruity Heaven", value: "x0.9" });
    price = price * 0.9;
  }

  if (
    name in { ...GREENHOUSE_SEEDS, ...GREENHOUSE_FRUIT_SEEDS } &&
    bumpkin.skills["Seedy Business"]
  ) {
    boostsUsed.push({ name: "Seedy Business", value: "x0.85" });
    price = price * 0.85;
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

    if (!(item in SEEDS)) {
      throw new Error("This item is not a seed");
    }

    const { bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    const userBumpkinLevel = getBumpkinLevel(
      stateCopy.bumpkin?.experience ?? 0,
    );
    const seed = SEEDS[item];
    const requiredSeedLevel = seed.bumpkinLevel ?? 0;

    if (userBumpkinLevel < requiredSeedLevel) {
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
