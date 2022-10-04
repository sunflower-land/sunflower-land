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
  | "Busy Bumpkin"
  | "Brilliant Bumpkin"
  | "Sun Seeker"
  | "Sunflower Superstar"
  | "My life is potato"
  | "Jack O'Latern"
  | "20/20 Vision"
  | "Cabbage King"
  | "Beetroot Beast"
  | "Cool Flower"
  | "Patient Parsnips"
  | "Rapid Radish"
  | "Staple Crop"
  | "Farm Hand"
  | "Crop Champion"
  | "Bread Winner"
  | "Bumpkin Billionaire"
  | "Big Spender"
  | "High Roller"
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
  | "Chef de Cuisine"
  | "Craftmanship"
  | "Time to chop"
  | "Contractor"
  | "Museum";

export type Achievement = {
  description: string;
  progress: (game: GameState) => number;
  requirement: number;
  sflReward: Decimal;
  experienceReward: number;
};

export const ACHIEVEMENTS: () => Record<AchievementName, Achievement> = () => ({
  "Sun Seeker": {
    description: "Harvest 100 Sunflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Busy Bumpkin": {
    description: "Reach level 3",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 3,
    sflReward: marketRate(10),
    experienceReward: 0,
  },
  "Cabbage King": {
    description: "Harvest 200 cabbages",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cabbage Harvested"] || 0,
    requirement: 200,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  Explorer: {
    description: "Expand your land 5 times",
    progress: (gameState: GameState) => gameState.expansions.length,
    requirement: 5,
    experienceReward: 0,
    sflReward: marketRate(5),
  },
  "Big Spender": {
    description: "Spend 10 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 10,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Cool Flower": {
    description: "Harvest 100 cauliflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cauliflower Harvested"] || 0,
    requirement: 100,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Jack O'Latern": {
    description: "Harvest 500 Pumpkins",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Pumpkin Harvested"] || 0,
    requirement: 500,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  Timbeerrr: {
    description: "Chop 150 trees",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Tree Chopped"] || 0,
    requirement: 150,
    sflReward: marketRate(0),
    experienceReward: 0,
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
    requirement: 13,
    sflReward: marketRate(0),
    experienceReward: 0,
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
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Beetroot Beast": {
    description: "Harvest 2000 beetroots",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Beetroot Harvested"] || 0,
    requirement: 2000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },

  "Rapid Radish": {
    description: "Harvest 200 parsnips",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Radish Harvested"] || 0,
    requirement: 200,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  Driller: {
    description: "Mine 50 stone rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Stone Mined"] || 0,
    requirement: 50,
    sflReward: marketRate(0),
    experienceReward: 0,
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
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Iron Eyes": {
    description: "Mine 50 iron rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Iron Mined"] || 0,
    requirement: 50,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "20/20 Vision": {
    description: "Harvest 10,000 carrots",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Carrot Harvested"] || 0,
    requirement: 10000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "El Dorado": {
    description: "Mine 50 gold rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Gold Mined"] || 0,
    requirement: 50,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Bread Winner": {
    description: "Earn 100 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 100,
    sflReward: marketRate(0),
    experienceReward: 0,
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
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Time to chop": {
    description: "Craft 500 axes",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Axe Crafted"] || 0,
    requirement: 500,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  Contractor: {
    description: "Construct 10 buildings",
    progress: (gameState: GameState) => getKeys(gameState.buildings).length,
    requirement: 10,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "My life is potato": {
    description: "Harvest 5000 potatoes",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Potato Harvested"] || 0,
    requirement: 5000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  Canary: {
    description: "Mine 1000 stone rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Stone Mined"] || 0,
    requirement: 1000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Brilliant Bumpkin": {
    description: "Reach level 20",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 20,
    sflReward: marketRate(0),
    experienceReward: 0,
  },

  "Staple Crop": {
    description: "Harvest 10000 wheat",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Wheat Harvested"] || 0,
    requirement: 10000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Bumpkin Chainsaw Amateur": {
    description: "Chop 5000 trees",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Tree Chopped"] || 0,
    requirement: 5000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Something Shiny": {
    description: "Mine 500 iron rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Iron Mined"] || 0,
    requirement: 500,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  Museum: {
    description: "Place 10 rare items",
    progress: (gameState: GameState) => getKeys(gameState.collectibles).length,
    requirement: 10,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Chef de Cuisine": {
    description: "Cook 5000 meals",
    progress: (gameState: GameState) => {
      const cookEvents = getKeys(CONSUMABLES).map(
        (name) => `${name} Cooked` as CookEvent
      );

      return cookEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 5000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Bumpkin Billionaire": {
    description: "Earn 1000 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 1000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Patient Parsnips": {
    description: "Harvest 5000 parsnips",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Parsnip Harvested"] || 0,
    requirement: 5000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "High Roller": {
    description: "Spend 5000 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 5000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Sunflower Superstar": {
    description: "Harvest 100,000 sunflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100000,
    sflReward: marketRate(0),
    experienceReward: 0,
  },
  "Gold Fever": {
    description: "Mine 500 gold rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Gold Mined"] || 0,
    requirement: 500,
    sflReward: marketRate(0),
    experienceReward: 0,
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
    sflReward: marketRate(0),
    experienceReward: 0,
  },
});
