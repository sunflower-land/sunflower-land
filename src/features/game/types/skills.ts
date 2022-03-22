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
  | "Gold Rush";

export type Profession = "farming" | "gathering";

export const SKILL_TREE: Record<
  SkillName,
  {
    level: number;
    profession: Profession;
    conflicts: SkillName;
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
    perks: ["Axes can be used on 2 trees"],
  },
  "Gold Rush": {
    level: 10,
    requires: "Prospector",
    conflicts: "Logger",
    profession: "gathering",
    perks: ["Increase gold drops by 50%"],
  },
};

/**
 * Assumptions are based on a user can earn close to 50exp per day farming, 30exp chopping/mining
 */
export function getLevel(experience: Decimal) {
  // Around 3 months farming
  if (experience.gt(5000)) {
    return 10;
  }

  // Around 2 months farming
  if (experience.gt(3000)) {
    return 9;
  }

  // Around 6 weeks farming
  if (experience.gt(2000)) {
    return 8;
  }

  // Around 4 weeks farming
  if (experience.gt(1400)) {
    return 7;
  }

  // Around 3 weeks farming
  if (experience.gt(1100)) {
    return 6;
  }

  // Around 2 weeks farming
  if (experience.gt(700)) {
    return 5;
  }

  // Around 1 weeks farming
  if (experience.gt(350)) {
    return 4;
  }

  // Around three days farming
  if (experience.gt(150)) {
    return 3;
  }

  // Around one day farming
  if (experience.gt(50)) {
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
