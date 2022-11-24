import { GameState } from "../types/game";
import { BumpkinItem } from "./bumpkin";

export type QuestName = "Farmer Quest 1";

export type Quest = {
  description: string;
  progress: (game: GameState) => number;
  requirement: number;
  wearable: BumpkinItem;
};

export const QUESTS: () => Record<QuestName, Quest> = () => ({
  "Farmer Quest 1": {
    description: "Harvest 1000 Sunflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 1000,
    wearable: "Red Farmer Shirt",
  },
});
