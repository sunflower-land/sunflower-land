import { GameState } from "../types/game";
import { BumpkinItem } from "./bumpkin";

export type QuestName =
  | "Farmer Quest 1"
  | "Reindeer Quest 1"
  | "Reindeer Quest 2"
  | "Reindeer Quest 3";

export type Quest = {
  description: string;
  progress: (game: GameState) => number;
  requirement: number;
  wearable: BumpkinItem;
};

export const QUESTS: Record<QuestName, Quest> = {
  "Farmer Quest 1": {
    description: "Harvest 1000 Sunflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 1000,
    wearable: "Red Farmer Shirt",
  },
  "Reindeer Quest 1": {
    description: "Eat 20 Reindeer Carrots",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Reindeer Carrot Fed"] || 0,
    requirement: 20,
    wearable: "Reindeer Suit",
  },
  "Reindeer Quest 2": {
    description: "Eat 120 Reindeer Carrots",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Reindeer Carrot Fed"] || 0,
    requirement: 120,
    wearable: "Reindeer Antlers",
  },
  "Reindeer Quest 3": {
    description: "Eat 500 Reindeer Carrots",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Reindeer Carrot Fed"] || 0,
    requirement: 500,
    wearable: "Christmas Background",
  },
};

export const BUMPKIN_QUEST_IDS: Record<QuestName, number> = {
  "Farmer Quest 1": 100001,
  "Reindeer Quest 1": 100002,
  "Reindeer Quest 2": 100003,
  "Reindeer Quest 3": 100004,
};
