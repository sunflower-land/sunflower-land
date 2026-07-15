import Decimal from "decimal.js-light";

import type { BoostName, GameState, Inventory } from "../../types/game";
import { CROPS } from "../../types/crops";
import {
  COOKABLES,
  COOKABLE_CAKES,
  type Consumable,
  type CookableName,
  FISH_CONSUMABLES,
  isCookable,
} from "features/game/types/consumables";
import {
  getExpiryCooldown,
  getCollectiblesAcrossLocations,
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
  type TemporaryCollectibleName,
} from "features/game/lib/collectibleBuilt";
import { getBudExperienceBoosts } from "features/game/lib/getBudExperienceBoosts";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { isWearableActive } from "features/game/lib/wearables";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";
import type { SellableItem } from "features/game/events/landExpansion/sellCrop";
import {
  FACTION_ITEMS,
  getFactionPetBoostMultiplier,
} from "features/game/lib/factions";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { setPrecision } from "lib/utils/formatNumber";

const crops = CROPS;

export function isCropShortage({ game }: { game: GameState }) {
  const ascension = getAscensionLevel({
    experience: game.bumpkin.experience ?? 0,
    ascensionLevel: game.island.ascensionLevel ?? 0,
  });

  if (meetsLevelRequirement(ascension, { ascension: 0, level: 3 })) {
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
}): { price: number; boostsUsed: { name: BoostName; value: string }[] } => {
  const boostUsed: { name: BoostName; value: string }[] = [];
  const price = item.sellPrice;

  const { inventory, bumpkin } = game;

  if (!price) return { price: 0, boostsUsed: [] };

  let multiplier = 1;

  // apply Green Thumb boost to crop LEGACY SKILL!
  if (item.name in crops && inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    multiplier += 0.05;
    boostUsed.push({ name: "Green Thumb", value: "x1.05" });
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

  const coinSwindlerLevel = getSkillLevel(bumpkin.skills, "Coin Swindler");
  if (coinSwindlerLevel && item.name in CROPS) {
    const b = SKILL_RANKS["Coin Swindler"].ranks[coinSwindlerLevel - 1];
    multiplier += b;
    boostUsed.push({ name: "Coin Swindler", value: `+${b}` });
  }

  return { price: price * multiplier, boostsUsed: boostUsed };
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
  collectibleName: TemporaryCollectibleName;
  game: GameState;
  boostValue: number;
}) => {
  const active = isTemporaryCollectibleActive({ name: collectibleName, game });
  if (!active) return seconds;

  const activeItems = getCollectiblesAcrossLocations(
    game,
    collectibleName,
  ).filter((item) => item.coordinates && !item.removedAt);
  if (activeItems.length === 0) return seconds;

  const newestItem = activeItems.sort((a, b) => b.createdAt! - a.createdAt!)[0];
  const cooldown = getExpiryCooldown(collectibleName, game);
  const expiresAt = newestItem.createdAt! + cooldown;

  if (expiresAt <= cookStartAt) return seconds;

  return new Decimal(seconds.toNumber() * boostValue);
};

export const getCookingTime = ({
  seconds,
  item,
  game,
  cookStartAt = Date.now(),
}: {
  seconds: number;
  item: CookableName;
  game: GameState;
  cookStartAt?: number;
}): {
  reducedSecs: number;
  boostsUsed: { name: BoostName; value: string }[];
} => {
  const { bumpkin } = game;
  const buildingName = COOKABLES[item].building;

  let reducedSecs = new Decimal(seconds);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  // Luna's Hat - 50% reduction
  if (isWearableActive({ name: "Luna's Hat", game })) {
    reducedSecs = reducedSecs.mul(0.5);
    boostsUsed.push({ name: "Luna's Hat", value: "x0.5" });
  }

  if (isWearableActive({ name: "Master Chef's Cleaver", game })) {
    reducedSecs = reducedSecs.mul(0.85);
    boostsUsed.push({ name: "Master Chef's Cleaver", value: "x0.85" });
  }

  // Legendary Shrine - 50% reduction
  if (isTemporaryCollectibleActive({ name: "Legendary Shrine", game })) {
    reducedSecs = reducedSecs.mul(0.5);
    boostsUsed.push({ name: "Legendary Shrine", value: "x0.5" });
  }

  if (isTemporaryCollectibleActive({ name: "Boar Shrine", game })) {
    reducedSecs = reducedSecs.mul(0.8);
    boostsUsed.push({ name: "Boar Shrine", value: "x0.8" });
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
    boostsUsed.push({
      name: FACTION_ITEMS[factionName].necklace,
      value: "x0.75",
    });
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
      boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    } else if (hasTimeWarpTotem) {
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
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
    boostsUsed.push({ name: "Gourmet Hourglass", value: "x0.5" });
  }

  if (isCollectibleBuilt({ name: "Desert Gnome", game })) {
    reducedSecs = reducedSecs.mul(0.9);
    boostsUsed.push({ name: "Desert Gnome", value: "x0.9" });
  }

  // -10%/-20%/-30% on Fire Pit + Kitchen with Fast Feasts skill (scales w/ rank)
  const fastFeastsLevel = getSkillLevel(bumpkin?.skills ?? {}, "Fast Feasts");
  if (
    (buildingName === "Fire Pit" || buildingName === "Kitchen") &&
    fastFeastsLevel
  ) {
    const multiplier =
      1 - SKILL_RANKS["Fast Feasts"].ranks[fastFeastsLevel - 1];
    reducedSecs = reducedSecs.mul(multiplier);
    boostsUsed.push({ name: "Fast Feasts", value: `x${multiplier}` });
  }

  // -10%/-20%/-30% on Cakes with Frosted Cakes skill (scales with rank)
  const frostedCakesLevel = getSkillLevel(
    bumpkin?.skills ?? {},
    "Frosted Cakes",
  );
  if (item in COOKABLE_CAKES && frostedCakesLevel) {
    const multiplier =
      1 - SKILL_RANKS["Frosted Cakes"].ranks[frostedCakesLevel - 1];
    reducedSecs = reducedSecs.mul(multiplier);
    boostsUsed.push({ name: "Frosted Cakes", value: `x${multiplier}` });
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
  createdAt,
}: {
  food: Consumable;
  game: GameState;
  createdAt: number;
}): {
  boostedExp: Decimal;
  boostsUsed: { name: BoostName; value: string }[];
} => {
  let boostedExp = new Decimal(food.experience);
  const skills = game.bumpkin.skills ?? {};
  const boostsUsed: { name: BoostName; value: string }[] = [];

  //Bumpkin Wearable Boost Golden Spatula
  if (isWearableActive({ name: "Golden Spatula", game })) {
    boostedExp = boostedExp.mul(1.1);
    boostsUsed.push({ name: "Golden Spatula", value: "x1.1" });
  }

  if (isCollectibleBuilt({ name: "Blossombeard", game })) {
    boostedExp = boostedExp.mul(1.1);
    boostsUsed.push({ name: "Blossombeard", value: "x1.1" });
  }

  if (
    food.name in FISH_CONSUMABLES &&
    isWearableActive({ name: "Luminous Anglerfish Topper", game })
  ) {
    // 50% boost
    boostedExp = boostedExp.mul(1.5);
    boostsUsed.push({ name: "Luminous Anglerfish Topper", value: "x1.5" });
  }

  if (isWearableActive({ name: "Pan", game })) {
    // 25% boost
    boostedExp = boostedExp.mul(1.25);
    boostsUsed.push({ name: "Pan", value: "x1.25" });
  }

  //Observatory is placed
  if (isCollectibleBuilt({ name: "Observatory", game })) {
    boostedExp = boostedExp.mul(1.05);
    boostsUsed.push({ name: "Observatory", value: "x1.05" });
  }

  if (
    (food.name in COOKABLE_CAKES || food.name === "Pirate Cake") &&
    isCollectibleBuilt({ name: "Grain Grinder", game })
  ) {
    boostedExp = boostedExp.mul(1.2);
    boostsUsed.push({ name: "Grain Grinder", value: "x1.2" });
  }

  if (
    food.name in FISH_CONSUMABLES &&
    isCollectibleBuilt({ name: "Skill Shrimpy", game })
  ) {
    boostedExp = boostedExp.mul(1.2);
    boostsUsed.push({ name: "Skill Shrimpy", value: "x1.2" });
  }

  // Fishy Feast: +20%/+25%/+30% Bumpkin XP from fish (scales with rank)
  const fishyFeastLevel = getSkillLevel(skills, "Fishy Feast");
  if (food.name in FISH_CONSUMABLES && fishyFeastLevel) {
    const multiplier =
      1 + SKILL_RANKS["Fishy Feast"].ranks[fishyFeastLevel - 1];
    boostedExp = boostedExp.mul(multiplier);
    boostsUsed.push({ name: "Fishy Feast", value: `x${multiplier}` });
  }

  if (hasVipAccess({ game, now: createdAt })) {
    boostedExp = boostedExp.mul(1.1);
    boostsUsed.push({ name: "VIP Access", value: "x1.1" });
  }

  if (
    isCollectibleBuilt({ name: "Hungry Hare", game }) &&
    food.name === "Fermented Carrots"
  ) {
    boostedExp = boostedExp.mul(2);
    boostsUsed.push({ name: "Hungry Hare", value: "x2" });
  }

  // Munching Mastery - +5%/+10%/+15% exp boost (scales with rank)
  const munchingMasteryLevel = getSkillLevel(skills, "Munching Mastery");
  if (munchingMasteryLevel) {
    const multiplier =
      1 + SKILL_RANKS["Munching Mastery"].ranks[munchingMasteryLevel - 1];
    boostedExp = boostedExp.mul(multiplier);
    boostsUsed.push({ name: "Munching Mastery", value: `x${multiplier}` });
  }

  // Juicy Boost - +10%/+20%/+30% exp boost on juice (scales with rank)
  const juicyBoostLevel = getSkillLevel(skills, "Juicy Boost");
  if (
    isCookable(food) &&
    food.building === "Smoothie Shack" &&
    juicyBoostLevel
  ) {
    const multiplier =
      1 + SKILL_RANKS["Juicy Boost"].ranks[juicyBoostLevel - 1];
    boostedExp = boostedExp.mul(multiplier);
    boostsUsed.push({ name: "Juicy Boost", value: `x${multiplier}` });
  }

  // Drive-Through Deli - +15%/+20%/+25% exp boost on Deli (scales with rank)
  const driveThroughDeliLevel = getSkillLevel(skills, "Drive-Through Deli");
  if (isCookable(food) && food.building === "Deli" && driveThroughDeliLevel) {
    const multiplier =
      1 + SKILL_RANKS["Drive-Through Deli"].ranks[driveThroughDeliLevel - 1];
    boostedExp = boostedExp.mul(multiplier);
    boostsUsed.push({ name: "Drive-Through Deli", value: `x${multiplier}` });
  }

  // Buzzworthy Treats - +10%/+20%/+30% exp boost on honey foods
  const buzzworthyTreatsLevel = getSkillLevel(skills, "Buzzworthy Treats");
  if (isFoodMadeWithHoney(food) && buzzworthyTreatsLevel) {
    const multiplier =
      1 + SKILL_RANKS["Buzzworthy Treats"].ranks[buzzworthyTreatsLevel - 1];
    boostedExp = boostedExp.mul(multiplier);
    boostsUsed.push({ name: "Buzzworthy Treats", value: `x${multiplier}` });
  }

  // Swiss Whiskers - +500 exp on cheese recipes
  if (
    isFoodMadeWithCheese(food) &&
    isCollectibleBuilt({ name: "Swiss Whiskers", game })
  ) {
    boostedExp = boostedExp.plus(500);
    boostsUsed.push({ name: "Swiss Whiskers", value: "+500" });
  }

  const { exp: budExp, budUsed } = getBudExperienceBoosts(
    game.buds ?? {},
    food,
  );
  boostedExp = boostedExp.mul(budExp);
  if (budUsed) boostsUsed.push({ name: budUsed, value: `x${budExp}` });

  const factionPetMultiplier = getFactionPetBoostMultiplier(game);
  boostedExp = boostedExp.mul(factionPetMultiplier);
  if (factionPetMultiplier > 1) {
    boostsUsed.push({ name: "Faction Pet", value: `x${factionPetMultiplier}` });
  }

  return { boostedExp: setPrecision(boostedExp), boostsUsed };
};
