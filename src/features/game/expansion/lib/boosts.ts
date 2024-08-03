import Decimal from "decimal.js-light";

import { Bumpkin, GameState, Inventory } from "../../types/game";
import { CROPS } from "../../types/crops";
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
import { SellableItem } from "features/game/events/landExpansion/sellCrop";
import { getFactionPetBoostMultiplier } from "features/game/lib/factions";

const crops = CROPS;

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

export const CROP_SHORTAGE_HOURS = 2;

/**
 * How much SFL an item is worth
 */
export const getSellPrice = ({
  item,
  game,
  now = new Date(),
}: {
  item: SellableItem;
  game: GameState;
  now?: Date;
}) => {
  let price = item.sellPrice;

  const inventory = game.inventory;

  if (!price) return 0;

  // apply Green Thumb boost to crop LEGACY SKILL!
  if (item.name in crops && inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    price = price * 1.05;
  }

  // Crop Shortage during initial gameplay
  const isCropShortage =
    game.createdAt + CROP_SHORTAGE_HOURS * 60 * 60 * 1000 > now.getTime();

  if (item.name in CROPS && isCropShortage) {
    price = price * 2;
  }

  // Special Events
  const specialEventMultiplier = Object.values(game.specialEvents.current)
    .filter((event) => !!event?.isEligible)
    .filter((event) => (event?.endAt ?? Infinity) > now.getTime())
    .filter((event) => (event?.startAt ?? 0) <= now.getTime())
    .find((event) => event?.bonus?.[item.name]?.saleMultiplier)?.bonus?.[
    item.name
  ]?.saleMultiplier;

  if (specialEventMultiplier) {
    price = price * specialEventMultiplier;
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
  game: GameState,
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

  if (isCollectibleActive({ name: "Gourmet Hourglass", game })) {
    reducedSecs = reducedSecs.mul(0.5);
  }

  if (isCollectibleBuilt({ name: "Desert Gnome", game })) {
    reducedSecs = reducedSecs.mul(0.9);
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
  createdAt: number = Date.now(),
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

  if (isWearableActive({ name: "Pan", game })) {
    // 25% boost
    boostedExp = boostedExp.mul(1.25);
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

  if (
    isCollectibleBuilt({ name: getSeasonalBanner(), game }) ||
    isCollectibleBuilt({ name: "Lifetime Farmer Banner", game })
  ) {
    boostedExp = boostedExp.mul(1.1);
  }

  if (
    isCollectibleBuilt({ name: "Hungry Hare", game }) &&
    food.name === "Fermented Carrots"
  ) {
    boostedExp = boostedExp.mul(2);
  }

  boostedExp = boostedExp.mul(getBudExperienceBoosts(buds, food));
  boostedExp = boostedExp.mul(getFactionPetBoostMultiplier(game));

  return boostedExp.toDecimalPlaces(4).toNumber();
};
