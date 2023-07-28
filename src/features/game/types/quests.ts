import { BumpkinItem } from "./bumpkin";
import { GameState } from "./game";

export type QuestName =
  | "Farmer Quest 1"
  | "Fruit Quest 1"
  | "Fruit Quest 2"
  | "Fruit Quest 3"
  | "Pirate Quest 1"
  | "Pirate Quest 2"
  | "Pirate Quest 3"
  | "Pirate Quest 4";

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
    wearable: "Fruit Picker Shirt",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Fruit Quest 2": {
    description: "Harvest 100 Orange",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Orange Harvested"] || 0,
    requirement: 100,
    wearable: "Fruit Picker Apron",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Fruit Quest 3": {
    description: "Harvest 750 Apples",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Apple Harvested"] || 0,
    requirement: 750,
    wearable: "Fruit Bowl",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Pirate Quest 1": {
    description: "Dig 30 holes",
    progress: (gameState: GameState) =>
      (gameState.bumpkin?.activity?.["Treasure Dug"] || 0) +
      (gameState.bumpkin?.activity?.["Treasure Drilled"] || 0),
    requirement: 30,
    wearable: "Striped Blue Shirt",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Pirate Quest 2": {
    description: "Collect 10 Seaweed",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Seaweed Dug"] || 0,
    requirement: 10,
    wearable: "Peg Leg",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Pirate Quest 3": {
    description: "Collect 10 Pipis",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Pipi Dug"] || 0,
    requirement: 10,
    wearable: "Pirate Potion",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Pirate Quest 4": {
    description: "Collect 5 Corals",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Coral Dug"] || 0,
    requirement: 5,
    wearable: "Pirate Hat",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
};

type CompletedQuestName =
  | "Reindeer Quest 1"
  | "Reindeer Quest 2"
  | "Reindeer Quest 3"
  | "Lunar New Year Quest 1"
  | "Lunar New Year Quest 2"
  | "Cupid Quest 1"
  | "Cupid Quest 2"
  | "Cupid Quest 3"
  | "Cupid Quest 4"
  | "Leprechaun Quest 1"
  | "Easter Quest 1";

export const BUMPKIN_QUEST_IDS: Record<QuestName | CompletedQuestName, number> =
  {
    "Farmer Quest 1": 100001,
    "Reindeer Quest 1": 100002,
    "Reindeer Quest 2": 100003,
    "Reindeer Quest 3": 100004,
    "Fruit Quest 1": 100005,
    "Fruit Quest 2": 100006,
    "Fruit Quest 3": 100007,
    "Lunar New Year Quest 1": 100009,
    "Lunar New Year Quest 2": 100010,
    "Pirate Quest 1": 100011,
    "Pirate Quest 2": 100012,
    "Pirate Quest 3": 100013,
    "Pirate Quest 4": 100014,
    "Cupid Quest 1": 100015,
    "Cupid Quest 2": 100016,
    "Cupid Quest 3": 100017,
    "Cupid Quest 4": 100018,
    "Leprechaun Quest 1": 100019,
    "Easter Quest 1": 100020,
  };
