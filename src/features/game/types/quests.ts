import { BumpkinItem } from "./bumpkin";
import { GameState } from "./game";

export type QuestName =
  | "Farmer Quest 1"
  | "Fruit Quest 1"
  | "Fruit Quest 2"
  | "Fruit Quest 3"
  | "Fruit Quest 4";

export type Quest = {
  description: string;
  progress: (game: GameState) => number;
  requirement: number;
  wearable: BumpkinItem;
  deadline?: string;
};

export const QUESTS: Record<QuestName, Quest> = {
  "Farmer Quest 1": {
    description: "Harvest 1000 Sunflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 1000,
    wearable: "Red Farmer Shirt",
  },
  "Fruit Quest 1": {
    description: "Harvest 10 Blueberries",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Blueberry Harvested"] || 0,
    requirement: 10,
    wearable: "Red Farmer Shirt",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Fruit Quest 2": {
    description: "Harvest 100 Oranges",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Orange Harvested"] || 0,
    requirement: 100,
    wearable: "Farmer Overalls",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Fruit Quest 3": {
    description: "Harvest 200 Apples",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Apple Harvested"] || 0,
    requirement: 200,
    wearable: "Farmer Hat",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Fruit Quest 4": {
    description: "Harvest 1200 Blueberries",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Blueberry Harvested"] || 0,
    requirement: 1200,
    wearable: "Farmer Pitchfork",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
};

type CompletedQuestName =
  | "Reindeer Quest 1"
  | "Reindeer Quest 2"
  | "Reindeer Quest 3";

export const BUMPKIN_QUEST_IDS: Record<QuestName | CompletedQuestName, number> =
  {
    "Farmer Quest 1": 100001,
    "Reindeer Quest 1": 100002,
    "Reindeer Quest 2": 100003,
    "Reindeer Quest 3": 100004,
    "Fruit Quest 1": 100005,
    "Fruit Quest 2": 100006,
    "Fruit Quest 3": 100007,
    "Fruit Quest 4": 100008,
  };
