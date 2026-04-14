import { BumpkinItem } from "./bumpkin";
import { GameState } from "./game";
import { translate } from "lib/i18n/translate";

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
    description: translate("questDescription.farmerQuest1"),
    progress: (gameState: GameState) =>
      gameState.farmActivity["Sunflower Harvested"] || 0,
    requirement: 1000,
    wearable: "Red Farmer Shirt",
  },
  "Fruit Quest 1": {
    description: translate("questDescription.fruitQuest1"),
    progress: (gameState: GameState) =>
      gameState.farmActivity["Blueberry Harvested"] || 0,
    requirement: 10,
    wearable: "Fruit Picker Shirt",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Fruit Quest 2": {
    description: translate("questDescription.fruitQuest2"),
    progress: (gameState: GameState) =>
      gameState.farmActivity["Orange Harvested"] || 0,
    requirement: 100,
    wearable: "Fruit Picker Apron",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Fruit Quest 3": {
    description: translate("questDescription.fruitQuest3"),
    progress: (gameState: GameState) =>
      gameState.farmActivity["Apple Harvested"] || 0,
    requirement: 750,
    wearable: "Fruit Bowl",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Pirate Quest 1": {
    description: translate("questDescription.pirateQuest1"),
    progress: (gameState: GameState) =>
      (gameState.farmActivity["Treasure Dug"] || 0) +
      (gameState.farmActivity["Treasure Drilled"] || 0),
    requirement: 30,
    wearable: "Striped Blue Shirt",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Pirate Quest 2": {
    description: translate("questDescription.pirateQuest2"),
    progress: (gameState: GameState) =>
      gameState.farmActivity["Seaweed Dug"] || 0,
    requirement: 10,
    wearable: "Peg Leg",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Pirate Quest 3": {
    description: translate("questDescription.pirateQuest3"),
    progress: (gameState: GameState) => gameState.farmActivity["Pipi Dug"] || 0,
    requirement: 10,
    wearable: "Pirate Potion",
    deadline: new Date(Date.now() + 10000000000).toISOString(),
  },
  "Pirate Quest 4": {
    description: translate("questDescription.pirateQuest4"),
    progress: (gameState: GameState) =>
      gameState.farmActivity["Coral Dug"] || 0,
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
