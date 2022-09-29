import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { getBumpkinLevel } from "../lib/level";
import { GameState } from "../types/game";
import { CookEvent, CraftedEvent } from "./bumpkinActivity";
import { CONSUMABLES } from "./consumables";
import { CAKES, getKeys, TOOLS } from "./craftables";
import { CROPS } from "./crops";

export type AchievementName =
  | "Explorer"
  | "Busy bumpkin"
  | "Brilliant Bumpkin"
  | "Sun Seeker"
  | "Sunflower Superstar"
  | "My life is potato"
  | "Jack O'Latern"
  | "20/20 Vision"
  | "Cabbage king"
  | "Beetroot Beast"
  | "Cool Flower"
  | "Patient Parsnips"
  | "Rapid Radish"
  | "Staple Crop"
  | "Farm Hand"
  | "Crop Champion"
  | "Bread Winner"
  | "Bumpkin Billionaire"
  | "Big spender"
  | "High roller"
  | "Timbeerrr"
  | "Bumpkin Chainsaw Amateur"
  | "Driller"
  | "Canary"
  | "Iron Eyes"
  | "Something Shiny"
  | "El Dorado"
  | "Gold Fever"
  | "Kiss the Cook"
  | "Bakers Dozen"
  | "Chef de cuisine"
  | "Craftmanship"
  | "Time to chop"
  | "Contractor"
  | "Museum";

export type Achievement = {
  description: string;
  progress: (game: GameState) => number;
  requirement: number;
  sflReward?: Decimal;
  experienceReward?: number;
};

export const ACHIEVEMENTS: () => Record<AchievementName, Achievement> = () => ({
  "Sun Seeker": {
    description: "Harvest 100 Sunflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100,
  },
  "Busy bumpkin": {
    description: "Reach level 3",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 3,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  "Cabbage king": {
    description: "Harvest 200 cabbages",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cabbage Harvested"] || 0,
    requirement: 200,
  },
  Explorer: {
    description: "Expand your land 5 times",
    progress: (gameState: GameState) => gameState.expansions.length,
    requirement: 5,
    experienceReward: 0,
    sflReward: marketRate(5),
  },
  "Big spender": {
    description: "Spend 10 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 10,
  },
  "Cool Flower": {
    description: "Harvest 100 cauliflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cauliflower Harvested"] || 0,
    requirement: 100,
  },
  "Jack O'Latern": {
    description: "Harvest 500 Pumpkins",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Pumpkin Harvested"] || 0,
    requirement: 500,
  },
  Timbeerrr: {
    description: "Chop 150 trees",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Tree Chopped"] || 0,
    requirement: 150,
  },
  "Bakers Dozen": {
    description: "Bake 13 cakes",
    progress: (gameState: GameState) => {
      const cakeEvents = getKeys(CAKES()).map(
        (name) => `${name} Cooked` as CookEvent
      );

      const bakedCakes = cakeEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);

      return bakedCakes;
    },
    requirement: 10000,
  },

  Craftmanship: {
    description: "Craft 100 tools",
    progress: (gameState: GameState) => {
      const craftEvent = getKeys(TOOLS).map(
        (name) => `${name} Crafted` as CraftedEvent
      );

      return craftEvent.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 100,
  },
  "Beetroot Beast": {
    description: "Harvest 2000 beetroots",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Beetroot Harvested"] || 0,
    requirement: 2000,
  },

  "Rapid Radish": {
    description: "Harvest 200 parsnips",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Radish Harvested"] || 0,
    requirement: 200,
  },
  Driller: {
    description: "Mine 50 stone rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Stone Mined"] || 0,
    requirement: 50,
  },
  "Farm Hand": {
    description: "Harvest 10000 crops",
    progress: (gameState: GameState) => {
      const harvestEvents = getKeys(CROPS()).map(
        (name) => `${name} Cooked` as CookEvent
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 10000,
  },
  "Iron Eyes": {
    description: "Mine 50 iron rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Iron Mined"] || 0,
    requirement: 50,
  },
  "20/20 Vision": {
    description: "Harvest 10,000 carrots",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Carrot Harvested"] || 0,
    requirement: 10000,
  },
  "El Dorado": {
    description: "Mine 50 gold rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Gold Mined"] || 0,
    requirement: 50,
  },
  "Bread Winner": {
    description: "Earn 100 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 100,
  },
  "Kiss the Cook": {
    description: "Cook 20 meals",
    progress: (gameState: GameState) => {
      const cookEvents = getKeys(CONSUMABLES).map(
        (name) => `${name} Cooked` as CookEvent
      );

      return cookEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 20,
  },
  "Time to chop": {
    description: "Craft 500 axes",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Axe Crafted"] || 0,
    requirement: 500,
  },
  Contractor: {
    description: "Construct 10 buildings",
    progress: (gameState: GameState) => getKeys(gameState.buildings).length,
    requirement: 10,
  },
  "My life is potato": {
    description: "Harvest 5000 potatoes",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Potato Harvested"] || 0,
    requirement: 5000,
  },
  Canary: {
    description: "Mine 1000 stone rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Stone Mined"] || 0,
    requirement: 1000,
  },
  "Brilliant Bumpkin": {
    description: "Reach level 20",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 10,
  },

  "Staple Crop": {
    description: "Harvest 10000 wheat",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Wheat Harvested"] || 0,
    requirement: 10000,
  },
  "Bumpkin Chainsaw Amateur": {
    description: "Chop 5000 trees",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Tree Chopped"] || 0,
    requirement: 5000,
  },
  "Something Shiny": {
    description: "Mine 500 iron rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Iron Mined"] || 0,
    requirement: 500,
  },
  Museum: {
    description: "Place 10 rare items",
    progress: (gameState: GameState) => getKeys(gameState.collectibles).length,
    requirement: 10,
  },
  "Chef de cuisine": {
    description: "Cook 1000 meals",
    progress: (gameState: GameState) => {
      const cookEvents = getKeys(CONSUMABLES).map(
        (name) => `${name} Cooked` as CookEvent
      );

      return cookEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 1000,
  },
  "Bumpkin Billionaire": {
    description: "Earn 1000 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 1000,
  },
  "Patient Parsnips": {
    description: "Harvest 5000 parsnips",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Parsnip Harvested"] || 0,
    requirement: 5000,
  },
  "High roller": {
    description: "Spend 1000 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 1000,
  },
  "Sunflower Superstar": {
    description: "Harvest 100,000 sunflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100000,
  },
  "Gold Fever": {
    description: "Mine 500 gold rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Gold Mined"] || 0,
    requirement: 500,
  },
  "Crop Champion": {
    description: "Harvest 1 million crops",
    progress: (gameState: GameState) => {
      const harvestEvents = getKeys(CROPS()).map(
        (name) => `${name} Cooked` as CookEvent
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 1000000,
  },
});
