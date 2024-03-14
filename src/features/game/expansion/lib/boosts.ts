import Decimal from "decimal.js-light";

import { Bumpkin, GameState, Inventory } from "../../types/game";
import { SellableItem } from "features/game/events/landExpansion/sellCrop";
import { CROPS } from "../../types/crops";
import { CAKES } from "../../types/craftables";
import {
  COOKABLE_CAKES,
  Consumable,
  FISH_CONSUMABLES,
  isCookable,
} from "features/game/types/consumables";
import {
  isCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { getSeasonalBanner } from "features/game/types/seasons";
import { getBudExperienceBoosts } from "features/game/lib/getBudExperienceBoosts";
import { getBumpkinLevel } from "features/game/lib/level";
import { isWearableActive } from "features/game/lib/wearables";

const crops = CROPS();
const cakes = CAKES();

export function isCropShortage({ game }: { game: GameState }) {
  const bumpkinLevel = getBumpkinLevel(game.bumpkin?.experience ?? 0);

  if (bumpkinLevel >= 3) {
    return false;
  }

  if (game.inventory["Basic Land"]?.gte(5)) {
    return false;
  }

  // Crop Shortage Expired
  if (game.createdAt + 2 * 60 * 60 * 1000 < Date.now()) {
    return false;
  }

  return true;
}

/**
 * How much SFL an item is worth
 */
export const getSellPrice = ({
  item,
  game,
}: {
  item: SellableItem;
  game: GameState;
}) => {
  let price = item.sellPrice;

  const inventory = game.inventory;

  if (!price) {
    return new Decimal(0);
  }

  // apply Green Thumb boost to crop LEGACY SKILL!
  if (item.name in crops && inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    price = price.mul(1.05);
  }

  // apply Chef Apron 20% boost when selling cakes
  if (item.name in cakes && isWearableActive({ name: "Chef Apron", game })) {
    price = price.mul(1.2);
  }

  // Crop Shortage during initial gameplay
  if (
    ["Sunflower", "Potato", "Pumpkin"].includes(item.name) &&
    isCropShortage({ game })
  ) {
    price = price.mul(2);
  }

  return price;
};

/**
 * To be used as boolean flag
 * Update if more upcoming boosts
 */
export const hasSellBoost = (inventory: Inventory) => {
  if (inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    return true;
  }

  return false;
};

/**
 * Get reduced cooking time from bumpkin skills.
 * @param seconds time to be decreased
 * @param bumpkin to check for skills
 * @returns reduced cooking
 */
export const getCookingTime = (
  seconds: number,
  bumpkin: Bumpkin | undefined,
  game: GameState
): number => {
  let reducedSecs = new Decimal(seconds);

  // 10% reduction
  if (bumpkin?.skills["Rush Hour"]) {
    reducedSecs = reducedSecs.mul(0.9);
  }

  // Luna's Hat - 50% reduction
  if (isWearableActive({ name: "Luna's Hat", game })) {
    reducedSecs = reducedSecs.mul(0.5);
  }

  if (isCollectibleActive({ name: "Time Warp Totem", game })) {
    reducedSecs = reducedSecs.mul(0.5);
  }

  return reducedSecs.toNumber();
};

/**
 * Get boosted exp from Bumpkin skills.
 * Decimal mul for precision.
 * @todo add "Curer" skill once "Fermented Goods" are finalized
 * @param foodExp value to be increased
 * @param bumpkin to check for skills
 * @returns boosted food exp
 */
export const getFoodExpBoost = (
  food: Consumable,
  bumpkin: Bumpkin,
  game: GameState,
  buds: NonNullable<GameState["buds"]>,
  createdAt: number = Date.now()
): number => {
  let boostedExp = new Decimal(food.experience);
  const { skills } = bumpkin;

  //Bumpkin Skill Boost Kitchen Hand
  if (skills["Kitchen Hand"]) {
    boostedExp = boostedExp.mul(1.05);
  }

  //Bumpkin Skill Boost Curer
  if (isCookable(food) && food.building === "Deli" && skills["Curer"]) {
    boostedExp = boostedExp.mul(1.15);
  }

  //Bumpkin Wearable Boost Golden Spatula
  if (isWearableActive({ name: "Golden Spatula", game })) {
    boostedExp = boostedExp.mul(1.1);
  }

  if (
    food.name in FISH_CONSUMABLES &&
    isWearableActive({ name: "Luminous Anglerfish Topper", game })
  ) {
    // 50% boost
    boostedExp = boostedExp.mul(1.5);
  }

  //Observatory is placed
  if (isCollectibleBuilt({ name: "Observatory", game })) {
    boostedExp = boostedExp.mul(1.05);
  }

  if (isCollectibleBuilt({ name: "Blossombeard", game })) {
    boostedExp = boostedExp.mul(1.1);
  }

  if (
    (food.name in COOKABLE_CAKES || food.name === "Pirate Cake") &&
    isCollectibleBuilt({ name: "Grain Grinder", game })
  ) {
    boostedExp = boostedExp.mul(1.2);
  }

  if (
    food.name in FISH_CONSUMABLES &&
    isCollectibleBuilt({ name: "Skill Shrimpy", game })
  ) {
    boostedExp = boostedExp.mul(1.2);
  }

  if (isCollectibleBuilt({ name: getSeasonalBanner(), game })) {
    boostedExp = boostedExp.mul(1.1);
  }

  // Is March 2024 UTC
  const isMarch2024 =
    createdAt >= new Date("2024-03-01T00:00:00Z").getTime() &&
    createdAt <= new Date("2024-03-31T23:59:59Z").getTime();

  if (
    isMarch2024 &&
    isCollectibleBuilt({ name: "Baby Panda", game }) &&
    getBumpkinLevel(game.bumpkin?.experience ?? 0) <= 20 &&
    game.island.type === "basic"
  ) {
    boostedExp = boostedExp.mul(2);
  }

  boostedExp = boostedExp.mul(getBudExperienceBoosts(buds, food));

  return boostedExp.toDecimalPlaces(4).toNumber();
};
