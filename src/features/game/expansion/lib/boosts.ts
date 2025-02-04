import Decimal from "decimal.js-light";

import { Bumpkin, GameState, Inventory } from "../../types/game";
import { CROPS } from "../../types/crops";
import {
  COOKABLES,
  COOKABLE_CAKES,
  Consumable,
  CookableName,
  FISH_CONSUMABLES,
  isCookable,
} from "features/game/types/consumables";
import {
  isCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { getBudExperienceBoosts } from "features/game/lib/getBudExperienceBoosts";
import { getBumpkinLevel } from "features/game/lib/level";
import { isWearableActive } from "features/game/lib/wearables";
import { SellableItem } from "features/game/events/landExpansion/sellCrop";
import {
  FACTION_ITEMS,
  getFactionPetBoostMultiplier,
} from "features/game/lib/factions";
import { hasVipAccess } from "features/game/lib/vipAccess";

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

export function isFoodMadeWithHoney(food: Consumable) {
  const cookable = COOKABLES[food.name as CookableName];
  return !!cookable?.ingredients.Honey;
}

export function isFoodMadeWithCheese(food: Consumable) {
  const cookable = COOKABLES[food.name as CookableName];
  return !!cookable?.ingredients.Cheese;
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
  const price = item.sellPrice;

  const { inventory, bumpkin } = game;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!price) return 0;

  let multiplier = 1;

  // apply Green Thumb boost to crop LEGACY SKILL!
  if (item.name in crops && inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    multiplier += 0.05;
  }

  // Crop Shortage during initial gameplay
  const isCropShortage =
    game.createdAt + CROP_SHORTAGE_HOURS * 60 * 60 * 1000 > now.getTime();

  if (item.name in CROPS && isCropShortage) {
    multiplier += 1;
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
    multiplier += specialEventMultiplier - 1;
  }

  if (bumpkin.skills["Coin Swindler"] && item.name in CROPS) {
    multiplier += 0.1;
  }

  return price * multiplier;
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
 * @param item to check for cooking boosts
 * @param bumpkin to check for skills
 * @param game to check for wearables
 * @returns reduced cooking
 */
export const getCookingTime = (
  seconds: number,
  item: CookableName,
  bumpkin: Bumpkin | undefined,
  game: GameState,
): number => {
  const buildingName = COOKABLES[item].building;

  let reducedSecs = new Decimal(seconds);

  // 10% reduction
  if (bumpkin?.skills["Rush Hour"]) {
    reducedSecs = reducedSecs.mul(0.9);
  }

  // Luna's Hat - 50% reduction
  if (isWearableActive({ name: "Luna's Hat", game })) {
    reducedSecs = reducedSecs.mul(0.5);
  }

  //Faction Medallion -25% reduction
  const factionName = game.faction?.name;
  if (
    factionName &&
    isWearableActive({
      game,
      name: FACTION_ITEMS[factionName].necklace,
    })
  ) {
    reducedSecs = reducedSecs.mul(0.75);
  }

  if (
    isCollectibleActive({ name: "Super Totem", game }) ||
    isCollectibleActive({ name: "Time Warp Totem", game })
  ) {
    reducedSecs = reducedSecs.mul(0.5);
  }

  if (isCollectibleActive({ name: "Gourmet Hourglass", game })) {
    reducedSecs = reducedSecs.mul(0.5);
  }

  if (isCollectibleBuilt({ name: "Desert Gnome", game })) {
    reducedSecs = reducedSecs.mul(0.9);
  }

  // 10% reduction on Fire Pit with Fast Feasts skill
  if (buildingName === "Fire Pit" && bumpkin?.skills["Fast Feasts"]) {
    reducedSecs = reducedSecs.mul(0.9);
  }

  // 10% reduction on Kitchen with Fast Feasts skill
  if (buildingName === "Kitchen" && bumpkin?.skills["Fast Feasts"]) {
    reducedSecs = reducedSecs.mul(0.9);
  }

  // 10% reduction on Cakes with Frosted Cakes skill
  if (item in COOKABLE_CAKES && bumpkin?.skills["Frosted Cakes"]) {
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

  if (food.name in FISH_CONSUMABLES && !!skills["Fishy Feast"]) {
    boostedExp = boostedExp.mul(1.2);
  }

  if (hasVipAccess({ game })) {
    boostedExp = boostedExp.mul(1.1);
  }

  if (
    isCollectibleBuilt({ name: "Hungry Hare", game }) &&
    food.name === "Fermented Carrots"
  ) {
    boostedExp = boostedExp.mul(2);
  }

  // Munching Mastery - 5% exp boost
  if (skills["Munching Mastery"]) {
    boostedExp = boostedExp.mul(1.05);
  }

  // Juicy Boost - 10% exp boost on juice
  if (
    isCookable(food) &&
    food.building === "Smoothie Shack" &&
    skills["Juicy Boost"]
  ) {
    boostedExp = boostedExp.mul(1.1);
  }

  // Drive-Through Deli - 15% exp boost on Deli
  if (
    isCookable(food) &&
    food.building === "Deli" &&
    skills["Drive-Through Deli"]
  ) {
    boostedExp = boostedExp.mul(1.15);
  }

  if (isFoodMadeWithHoney(food) && skills["Buzzworthy Treats"]) {
    boostedExp = boostedExp.mul(1.1);
  }

  // Swiss Whiskers - +500 exp on cheese recipes
  if (
    isFoodMadeWithCheese(food) &&
    isCollectibleBuilt({ name: "Swiss Whiskers", game })
  ) {
    boostedExp = boostedExp.plus(500);
  }

  boostedExp = boostedExp.mul(getBudExperienceBoosts(buds, food));
  boostedExp = boostedExp.mul(getFactionPetBoostMultiplier(game));

  return boostedExp.toDecimalPlaces(4).toNumber();
};
