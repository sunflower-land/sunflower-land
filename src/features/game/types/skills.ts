import Decimal from "decimal.js-light";
import { BuffLabel } from ".";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import { ITEM_DETAILS } from "./images";

export type LegacyBadgeName =
  | "Green Thumb"
  | "Barn Manager"
  | "Seed Specialist"
  | "Wrangler"
  | "Lumberjack"
  | "Prospector"
  | "Logger"
  | "Gold Rush"
  | "Artist"
  | "Coder"
  | "Liquidity Provider"
  | "Discord Mod"
  | "Warrior";

export type Profession = "farming" | "gathering" | "contributor" | "combat";

enum REQUIRED_XP {
  LEVEL_1 = 0,
  LEVEL_2 = 50,
  LEVEL_3 = 150,
  LEVEL_4 = 350,
  LEVEL_5 = 700,
  LEVEL_6 = 1100,
  LEVEL_7 = 1400,
  LEVEL_8 = 2000,
  LEVEL_9 = 3000,
  LEVEL_10 = 5000,
}

export const LEGACY_BADGE_TREE: Record<
  LegacyBadgeName,
  {
    level: number;
    profession: Profession;
    conflicts?: LegacyBadgeName;
    requires?: LegacyBadgeName;
    perks: string[];
    buff?: BuffLabel[];
  }
> = {
  "Green Thumb": {
    level: 5,
    conflicts: "Barn Manager",
    profession: "farming",
    perks: ["Crops are worth 5% more", "Increase mutant crop chance"],
    buff: [
      {
        labelType: "success",
        shortDescription: "+5% Crop sell price",
        boostTypeIcon: powerup,
      },
      {
        labelType: "vibrant",
        shortDescription: "+10% Mutant crop chance",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    ],
  },
  "Barn Manager": {
    level: 5,
    conflicts: "Green Thumb",
    profession: "farming",
    perks: ["Animals yield 10% more goods", "Increase mutant animal chance"],
    buff: [
      {
        labelType: "success",
        shortDescription: "+10% Animal produce",
        boostTypeIcon: powerup,
      },
      {
        labelType: "vibrant",
        shortDescription: "+10% Mutant animal chance",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    ],
  },
  "Seed Specialist": {
    level: 10,
    conflicts: "Wrangler",
    requires: "Green Thumb",
    profession: "farming",
    perks: ["Crops take 10% less time to grow", "Increase mutant crop chance"],
    buff: [
      {
        labelType: "info",
        shortDescription: "-10% Crop growth time",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
      {
        labelType: "vibrant",
        shortDescription: "+10% Mutant crop chance",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    ],
  },
  Wrangler: {
    level: 10,
    conflicts: "Seed Specialist",
    requires: "Barn Manager",
    profession: "farming",
    perks: [
      "Animals take 10% less time to produce goods",
      "Increase mutant animal chance",
    ],
    buff: [
      {
        labelType: "success",
        shortDescription: "-10% Animal sleep time",
        boostTypeIcon: powerup,
      },
      {
        labelType: "vibrant",
        shortDescription: "+10% Mutant animal chance",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    ],
  },
  Lumberjack: {
    level: 5,
    conflicts: "Prospector",
    profession: "gathering",
    perks: ["Increase wood drops by 10%"],
    buff: [
      {
        labelType: "success",
        shortDescription: "+10% Wood",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Wood.image,
      },
    ],
  },
  Prospector: {
    level: 5,
    conflicts: "Lumberjack",
    profession: "gathering",
    perks: ["Increase stone drops by 20%"],
    buff: [
      {
        labelType: "success",
        shortDescription: "+20% Stone",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Stone.image,
      },
    ],
  },
  Logger: {
    level: 10,
    requires: "Lumberjack",
    conflicts: "Gold Rush",
    profession: "gathering",
    perks: ["Axes last 50% longer"],
    buff: [
      {
        labelType: "vibrant",
        shortDescription: "2x Axe durability",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS.Axe.image,
      },
    ],
  },
  "Gold Rush": {
    level: 10,
    requires: "Prospector",
    conflicts: "Logger",
    profession: "gathering",
    perks: ["Increase gold drops by 50%"],
    buff: [
      {
        labelType: "success",
        shortDescription: "+50% Gold",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Gold.image,
      },
    ],
  },
  Artist: {
    level: 1,
    profession: "contributor",
    perks: ["Save 10% on shop & blacksmith tools"],
    buff: [
      {
        labelType: "success",
        shortDescription: "-10% Seeds cost",
        boostTypeIcon: powerup,
      },
      {
        labelType: "success",
        shortDescription: "-10% Tools cost",
        boostTypeIcon: powerup,
      },
    ],
  },
  Coder: {
    level: 1,
    profession: "contributor",
    perks: ["Crops yield 20% more"],
    buff: [
      {
        labelType: "success",
        shortDescription: "+20% Crop yield",
        boostTypeIcon: powerup,
      },
    ],
  },
  "Discord Mod": {
    level: 1,
    profession: "contributor",
    perks: ["Yield 35% more wood"],
    buff: [
      {
        labelType: "success",
        shortDescription: "+35% Wood",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Wood.image,
      },
    ],
  },
  "Liquidity Provider": {
    level: 1,
    profession: "contributor",
    perks: ["50% reduced FLOWER withdrawal fee"],
    buff: [
      {
        labelType: "success",
        shortDescription: "-50% FLOWER withdrawal fee",
        boostTypeIcon: powerup,
      },
    ],
  },
  Warrior: {
    level: 1,
    profession: "combat",
    perks: ["Early access to land expansion"],
  },
};

/**
 * Assumptions are based on a user can earn close to 50exp per day farming, 30exp chopping/mining
 */
export function getLevel(experience: Decimal) {
  // Around 3 months farming
  if (experience.gte(REQUIRED_XP.LEVEL_10)) {
    return 10;
  }

  // Around 2 months farming
  if (experience.gte(REQUIRED_XP.LEVEL_9)) {
    return 9;
  }

  // Around 6 weeks farming
  if (experience.gte(REQUIRED_XP.LEVEL_8)) {
    return 8;
  }

  // Around 4 weeks farming
  if (experience.gte(REQUIRED_XP.LEVEL_7)) {
    return 7;
  }

  // Around 3 weeks farming
  if (experience.gte(REQUIRED_XP.LEVEL_6)) {
    return 6;
  }

  // Around 2 weeks farming
  if (experience.gte(REQUIRED_XP.LEVEL_5)) {
    return 5;
  }

  // Around 1 weeks farming
  if (experience.gte(REQUIRED_XP.LEVEL_4)) {
    return 4;
  }

  // Around three days farming
  if (experience.gte(REQUIRED_XP.LEVEL_3)) {
    return 3;
  }

  // Around one day farming
  if (experience.gte(REQUIRED_XP.LEVEL_2)) {
    return 2;
  }

  return 1;
}

type Level = 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

export function getRequiredXpToLevelUp(level: Level) {
  if (level === 10) return;

  const levelNum = (level + 1) as Level;

  return REQUIRED_XP[`LEVEL_${levelNum}`];
}
