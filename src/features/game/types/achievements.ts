import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { getBumpkinLevel } from "../lib/level";
import { GameState } from "../types/game";

export type AchievementName =
  // Levelling
  | "Explorer"
  | "Busy bumpkin"
  // Crops
  | "You are my sunshine"
  | "Brighten the day"
  | "My life is potato"
  | "Jack O'Latern"
  | "Farm Hand"
  | "A hard day's work"
  // Wood
  | "Timbeerrr"
  | "Bumpkin Chainsaw Amateur"
  | "Forester";

export type Achievement = {
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
    experienceReward: 0,
    sflReward: marketRate(5),
  },
  "Busy bumpkin": {
    description: "Reach level 2",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 2,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  "You are my sunshine": {
    description: "Reach level 2",
    progress: (gameState: GameState) => 2,
    requirement: 5,
    sflReward: marketRate(10),
    experienceReward: 300,
  },
  "Brighten the day": {
    description: "Reach level 2",
    progress: (gameState: GameState) => 3,
    requirement: 2,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  "My life is potato": {
    description: "Reach level 2",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 2,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  "Jack O'Latern": {
    description: "Reach level 2",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 2,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  "Farm Hand": {
    description: "Reach level 2",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 2,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  "A hard day's work": {
    description: "Reach level 2",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 2,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  Timbeerrr: {
    description: "Reach level 2",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 2,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  "Bumpkin Chainsaw Amateur": {
    description: "Reach level 2",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 2,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  Forester: {
    description: "Reach level 2",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 2,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
});
