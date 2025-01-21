import Decimal from "decimal.js-light";

import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

import { GameState } from "features/game/types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getBumpkinLevel } from "features/game/lib/level";
import { Seed, SeedName, SEEDS } from "features/game/types/seeds";
import { isWearableActive } from "features/game/lib/wearables";
import { FLOWER_SEEDS } from "features/game/types/flowers";
import { produce } from "immer";
import {
  GREENHOUSE_FRUIT_SEEDS,
  isPatchFruitSeed,
} from "features/game/types/fruits";
import { GREENHOUSE_SEEDS } from "features/game/types/crops";
import { isFullMoon } from "features/game/types/calendar";

export type SeedBoughtAction = {
  type: "seed.bought";
  item: SeedName;
  amount: number;
};

export function getBuyPrice(name: SeedName, seed: Seed, game: GameState) {
  const { inventory, bumpkin } = game;
  if (
    name in FLOWER_SEEDS &&
    isCollectibleBuilt({ name: "Hungry Caterpillar", game })
  ) {
    return 0;
  }

  if (isCollectibleBuilt({ name: "Kuebiko", game })) {
    return 0;
  }

  if (
    isWearableActive({ name: "Sunflower Shield", game }) &&
    name === "Sunflower Seed"
  ) {
    return 0;
  }

  let price = seed.price;

  //LEGACY SKILL Contributor Artist Skill
  if (price && inventory.Artist?.gte(1)) {
    price = price * 0.9;
  }

  if (name in FLOWER_SEEDS && bumpkin.skills["Flower Sale"]) {
    price = price * 0.8;
  }

  if (isPatchFruitSeed(name) && bumpkin.skills["Fruity Heaven"]) {
    price = price * 0.9;
  }

  if (
    name in { ...GREENHOUSE_SEEDS, ...GREENHOUSE_FRUIT_SEEDS } &&
    bumpkin.skills["Seedy Business"]
  ) {
    price = price * 0.85;
  }

  return price;
}

export const FULL_MOON_SEEDS: SeedName[] = [
  "Celestine Seed",
  "Lunara Seed",
  "Duskberry Seed",
];

export const isFullMoonBerry = (seedName: SeedName) => {
  return FULL_MOON_SEEDS.includes(seedName);
};

type Options = {
  state: Readonly<GameState>;
  action: SeedBoughtAction;
  createdAt?: number;
};

export function seedBought({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { item, amount } = action;

    if (isFullMoonBerry(item) && !isFullMoon(state, createdAt)) {
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

    const price = getBuyPrice(item, seed, stateCopy);
    const totalExpenses = price * amount;

    if (totalExpenses && stateCopy.coins < totalExpenses) {
      throw new Error("Insufficient tokens");
    }

    const oldAmount = stateCopy.inventory[item] ?? new Decimal(0);

    bumpkin.activity = trackActivity(
      "Coins Spent",
      bumpkin?.activity,
      new Decimal(totalExpenses),
    );
    bumpkin.activity = trackActivity(
      `${item} Bought`,
      bumpkin?.activity,
      new Decimal(amount),
    );

    stateCopy.coins = stateCopy.coins - totalExpenses;
    stateCopy.inventory[action.item] = oldAmount.add(amount) as Decimal;
    stateCopy.stock[item] = stateCopy.stock[item]?.minus(amount) as Decimal;

    return stateCopy;
  });
}
