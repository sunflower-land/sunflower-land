import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { getBumpkinLevel } from "../lib/level";
import { GameState } from "../types/game";

export type AchievementName = "Explorer" | "Busy Bumpkin";
//   | "My life is Potato"
//   | "A Hard Day's work";

type Achievement = {
  description: string;
  progress: (game: GameState) => number;
  requirement: number;
  sflReward?: Decimal;
  experienceReward?: number;
};

export const ACHIEVEMENTS: () => Record<AchievementName, Achievement> = () => ({
  Explorer: {
    description: "Expand your land 5 times",
    progress: (gameState: GameState) => gameState.expansions.length,
    requirement: 5,
    experienceReward: 300,
    sflReward: marketRate(5),
  },
  "Busy Bumpkin": {
    description: "Reach level 10",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 10,
    sflReward: marketRate(10),
  },
});
