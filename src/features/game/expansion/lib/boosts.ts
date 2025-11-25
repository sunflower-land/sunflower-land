import Decimal from "decimal.js-light";

import { BoostName, GameState, Inventory } from "../../types/game";
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
  EXPIRY_COOLDOWNS,
  isTemporaryCollectibleActive,
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
import { setPrecision } from "lib/utils/formatNumber";

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
 * How much FLOWER an item is worth
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

const applyTempCollectibleBoost = ({
  seconds,
  cookStartAt,
  collectibleName,
  game,
  boostValue,
}: {
  seconds: Decimal;
  cookStartAt: number;
  collectibleName: keyof typeof EXPIRY_COOLDOWNS;
  game: GameState;
  boostValue: number;
}) => {
  const active = isTemporaryCollectibleActive({ name: collectibleName, game });
  if (!active) return seconds;

  const activeItems = [
    ...(game.collectibles[collectibleName] ?? []),
    ...(game.home.collectibles[collectibleName] ?? []),
  ];
  const newestItem = activeItems.sort((a, b) => b.createdAt! - a.createdAt!)[0];
  const cooldown = EXPIRY_COOLDOWNS[collectibleName] as number;
  const expiresAt = newestItem.createdAt! + cooldown;

  if (expiresAt <= cookStartAt) return seconds;

  return new Decimal(seconds.toNumber() * boostValue);
};

export const getCookingTime = ({
  seconds,
  item,
  game,
  cookStartAt,
}: {
  seconds: number;
  item: CookableName;
  game: GameState;
  cookStartAt: number;
}): { reducedSecs: number; boostsUsed: BoostName[] } => {
  const { bumpkin } = game;
  const buildingName = COOKABLES[item].building;

  let reducedSecs = new Decimal(seconds);
  const boostsUsed: BoostName[] = [];

  // Luna's Hat - 50% reduction
  if (isWearableActive({ name: "Luna's Hat", game })) {
    reducedSecs = reducedSecs.mul(0.5);
    boostsUsed.push("Luna's Hat");
  }

  if (isWearableActive({ name: "Master Chef's Cleaver", game })) {
    reducedSecs = reducedSecs.mul(0.85);
    boostsUsed.push("Master Chef's Cleaver");
  }

  // Legendary Shrine - 50% reduction
  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    reducedSecs = reducedSecs.mul(0.5);
    boostsUsed.push("Legendary Shrine");
  }

  if (isTemporaryCollectibleActive({ name: "Boar Shrine", game })) {
    reducedSecs = reducedSecs.mul(0.8);
    boostsUsed.push("Boar Shrine");
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
    boostsUsed.push(FACTION_ITEMS[factionName].necklace);
  }

  // Totems do not stack - apply either Super Totem or Time Warp Totem boost
  const hasSuperTotem = isTemporaryCollectibleActive({
    name: "Super Totem",
    game,
  });
  const hasTimeWarpTotem = isTemporaryCollectibleActive({
    name: "Time Warp Totem",
    game,
  });
  const hasActiveTotem = hasSuperTotem || hasTimeWarpTotem;

  if (hasActiveTotem) {
    const totemType = isTemporaryCollectibleActive({
      name: "Super Totem",
      game,
    })
      ? "Super Totem"
      : "Time Warp Totem";

    reducedSecs = applyTempCollectibleBoost({
      seconds: reducedSecs,
      cookStartAt,
      collectibleName: totemType,
      game,
      boostValue: 0.5,
    });
    if (hasSuperTotem) {
      boostsUsed.push("Super Totem");
    } else if (hasTimeWarpTotem) {
      boostsUsed.push("Time Warp Totem");
    }
  }

  if (isTemporaryCollectibleActive({ name: "Gourmet Hourglass", game })) {
    reducedSecs = applyTempCollectibleBoost({
      seconds: reducedSecs,
      cookStartAt,
      collectibleName: "Gourmet Hourglass",
      game,
      boostValue: 0.5,
    });
    boostsUsed.push("Gourmet Hourglass");
  }

  if (isCollectibleBuilt({ name: "Desert Gnome", game })) {
    reducedSecs = reducedSecs.mul(0.9);
    boostsUsed.push("Desert Gnome");
  }

  // 10% reduction on Fire Pit with Fast Feasts skill
  if (buildingName === "Fire Pit" && bumpkin?.skills["Fast Feasts"]) {
    reducedSecs = reducedSecs.mul(0.9);
    boostsUsed.push("Fast Feasts");
  }

  // 10% reduction on Kitchen with Fast Feasts skill
  if (buildingName === "Kitchen" && bumpkin?.skills["Fast Feasts"]) {
    reducedSecs = reducedSecs.mul(0.9);
    boostsUsed.push("Fast Feasts");
  }

  // 10% reduction on Cakes with Frosted Cakes skill
  if (item in COOKABLE_CAKES && bumpkin?.skills["Frosted Cakes"]) {
    reducedSecs = reducedSecs.mul(0.9);
    boostsUsed.push("Frosted Cakes");
  }

  return { reducedSecs: reducedSecs.toNumber(), boostsUsed };
};

/**
 * Get boosted exp from Bumpkin skills.
 * Decimal mul for precision.
 * @todo add "Curer" skill once "Fermented Goods" are finalized
 * @param foodExp value to be increased
 * @param bumpkin to check for skills
 * @returns boosted food exp
 */
export const getFoodExpBoost = ({
  food,
  game,
  createdAt = Date.now(),
}: {
  food: Consumable;
  game: GameState;
  createdAt?: number;
}): { boostedExp: Decimal; boostsUsed: BoostName[] } => {
  let boostedExp = new Decimal(food.experience);
  const skills = game.bumpkin.skills ?? {};
  const boostsUsed: BoostName[] = [];

  //Bumpkin Wearable Boost Golden Spatula
  if (isWearableActive({ name: "Golden Spatula", game })) {
    boostedExp = boostedExp.mul(1.1);
    boostsUsed.push("Golden Spatula");
  }

  if (isCollectibleBuilt({ name: "Blossombeard", game })) {
    boostedExp = boostedExp.mul(1.1);
    boostsUsed.push("Blossombeard");
  }

  if (
    food.name in FISH_CONSUMABLES &&
    isWearableActive({ name: "Luminous Anglerfish Topper", game })
  ) {
    // 50% boost
    boostedExp = boostedExp.mul(1.5);
    boostsUsed.push("Luminous Anglerfish Topper");
  }

  if (isWearableActive({ name: "Pan", game })) {
    // 25% boost
    boostedExp = boostedExp.mul(1.25);
    boostsUsed.push("Pan");
  }

  //Observatory is placed
  if (isCollectibleBuilt({ name: "Observatory", game })) {
    boostedExp = boostedExp.mul(1.05);
    boostsUsed.push("Observatory");
  }

  if (
    (food.name in COOKABLE_CAKES || food.name === "Pirate Cake") &&
    isCollectibleBuilt({ name: "Grain Grinder", game })
  ) {
    boostedExp = boostedExp.mul(1.2);
    boostsUsed.push("Grain Grinder");
  }

  if (
    food.name in FISH_CONSUMABLES &&
    isCollectibleBuilt({ name: "Skill Shrimpy", game })
  ) {
    boostedExp = boostedExp.mul(1.2);
    boostsUsed.push("Skill Shrimpy");
  }

  if (food.name in FISH_CONSUMABLES && !!skills["Fishy Feast"]) {
    boostedExp = boostedExp.mul(1.2);
    boostsUsed.push("Fishy Feast");
  }

  if (hasVipAccess({ game, now: createdAt })) {
    boostedExp = boostedExp.mul(1.1);
  }

  if (
    isCollectibleBuilt({ name: "Hungry Hare", game }) &&
    food.name === "Fermented Carrots"
  ) {
    boostedExp = boostedExp.mul(2);
    boostsUsed.push("Hungry Hare");
  }

  // Munching Mastery - 5% exp boost
  if (skills["Munching Mastery"]) {
    boostedExp = boostedExp.mul(1.05);
    boostsUsed.push("Munching Mastery");
  }

  // Juicy Boost - 10% exp boost on juice
  if (
    isCookable(food) &&
    food.building === "Smoothie Shack" &&
    skills["Juicy Boost"]
  ) {
    boostedExp = boostedExp.mul(1.1);
    boostsUsed.push("Juicy Boost");
  }

  // Drive-Through Deli - 15% exp boost on Deli
  if (
    isCookable(food) &&
    food.building === "Deli" &&
    skills["Drive-Through Deli"]
  ) {
    boostedExp = boostedExp.mul(1.15);
    boostsUsed.push("Drive-Through Deli");
  }

  // Buzzworthy Treats - 10% exp boost on honey foods
  if (isFoodMadeWithHoney(food) && skills["Buzzworthy Treats"]) {
    boostedExp = boostedExp.mul(1.1);
    boostsUsed.push("Buzzworthy Treats");
  }

  // Swiss Whiskers - +500 exp on cheese recipes
  if (
    isFoodMadeWithCheese(food) &&
    isCollectibleBuilt({ name: "Swiss Whiskers", game })
  ) {
    boostedExp = boostedExp.plus(500);
    boostsUsed.push("Swiss Whiskers");
  }

  const { exp: budExp, budUsed } = getBudExperienceBoosts(
    game.buds ?? {},
    food,
  );
  boostedExp = boostedExp.mul(budExp);
  if (budUsed) boostsUsed.push(budUsed);

  boostedExp = boostedExp.mul(getFactionPetBoostMultiplier(game));

  return { boostedExp: setPrecision(boostedExp), boostsUsed };
};
