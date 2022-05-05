import Decimal from "decimal.js-light";
import { GameState } from "./game";

export type SkillName =
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
  | "Discord Mod";

export type Profession = "farming" | "gathering" | "contributor";

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

export const SKILL_TREE: Record<
  SkillName,
  {
    level: number;
    profession: Profession;
    conflicts?: SkillName;
    requires?: SkillName;
    perks: string[];
  }
> = {
  "Green Thumb": {
    level: 5,
    conflicts: "Barn Manager",
    profession: "farming",
    perks: ["Crops are worth 5% more", "Increase mutant crop chance"],
  },
  "Barn Manager": {
    level: 5,
    conflicts: "Green Thumb",
    profession: "farming",
    perks: ["Animals yield 10% more goods", "Increase mutant animal chance"],
  },
  "Seed Specialist": {
    level: 10,
    conflicts: "Wrangler",
    requires: "Green Thumb",
    profession: "farming",
    perks: ["Crops grow 10% faster", "Increase mutant crop chance"],
  },
  Wrangler: {
    level: 10,
    conflicts: "Seed Specialist",
    requires: "Barn Manager",
    profession: "farming",
    perks: [
      "Animals produce goods 10% faster",
      "Increase mutant animal chance",
    ],
  },
  Lumberjack: {
    level: 5,
    conflicts: "Prospector",
    profession: "gathering",
    perks: ["Increase wood drops by 10%"],
  },
  Prospector: {
    level: 5,
    conflicts: "Lumberjack",
    profession: "gathering",
    perks: ["Increase stone drops by 20%"],
  },
  Logger: {
    level: 10,
    requires: "Lumberjack",
    conflicts: "Gold Rush",
    profession: "gathering",
    perks: ["Axes last 25% longer"],
  },
  "Gold Rush": {
    level: 10,
    requires: "Prospector",
    conflicts: "Logger",
    profession: "gathering",
    perks: ["Increase gold drops by 50%"],
  },
  Artist: {
    level: 1,
    profession: "contributor",
    perks: ["Save 10% on shop & blacksmith tools"],
  },
  Coder: {
    level: 1,
    profession: "contributor",
    perks: ["Crops yield 20% more"],
  },
  "Discord Mod": {
    level: 1,
    profession: "contributor",
    perks: ["Yield 35% more wood"],
  },
  "Liquidity Provider": {
    level: 1,
    profession: "contributor",
    perks: ["50% reduced SFL withdrawal fee"],
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

export function getAvailableUpgrades(game: GameState): SkillName[] {
  const farmingLevel = getLevel(game.skills.farming);

  if (
    farmingLevel >= 5 &&
    !game.inventory["Green Thumb"] &&
    !game.inventory["Barn Manager"]
  ) {
    return ["Green Thumb", "Barn Manager"];
  }

  if (
    farmingLevel >= 10 &&
    !game.inventory["Seed Specialist"] &&
    !game.inventory["Wrangler"]
  ) {
    // Crop path
    if (game.inventory["Green Thumb"]) {
      return ["Seed Specialist"];
    }
    return ["Wrangler"];
  }

  const gatherLevel = getLevel(game.skills.gathering);

  if (
    gatherLevel >= 5 &&
    !game.inventory["Lumberjack"] &&
    !game.inventory["Prospector"]
  ) {
    return ["Lumberjack", "Prospector"];
  }

  if (
    gatherLevel >= 10 &&
    !game.inventory["Logger"] &&
    !game.inventory["Gold Rush"]
  ) {
    // Mining path
    if (game.inventory["Prospector"]) {
      return ["Gold Rush"];
    }
    return ["Logger"];
  }

  return [];
}

export function upgradeAvailable(state: GameState) {
  const upgrades = getAvailableUpgrades(state);
  return upgrades.length > 0;
}

type Level = 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

export function getRequiredXpToLevelUp(level: Level) {
  if (level === 10) return;

  const levelNum = (level + 1) as Level;

  return REQUIRED_XP[`LEVEL_${levelNum}`];
}
