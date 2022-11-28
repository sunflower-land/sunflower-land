import { Inventory } from "components/InventoryItems";
import Decimal from "decimal.js-light";
import { INITIAL_EXPANSIONS } from "../lib/constants";
import { marketRate } from "../lib/halvening";
import { getBumpkinLevel } from "../lib/level";
import { GameState } from "../types/game";
import { CookEvent, CraftedEvent, HarvestEvent } from "./bumpkinActivity";
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
  sfl: Decimal;
  rewards?: Inventory;
};

export const ACHIEVEMENTS: () => Record<AchievementName, Achievement> = () => ({
  "Sun Seeker": {
    description: "Harvest 100 Sunflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100,
    sfl: marketRate(0),
    rewards: {
      "Basic Bear": new Decimal(1),
    },
  },
  "Busy Bumpkin": {
    description: "Reach level 3",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 3,
    sfl: marketRate(10),
    rewards: {},
  },
  "Cabbage King": {
    description: "Harvest 200 cabbages",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cabbage Harvested"] || 0,
    requirement: 200,
    sfl: marketRate(10),
  },
  "Big Spender": {
    description: "Spend 10 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 10,
    sfl: marketRate(20),
  },
  "Jack O'Latern": {
    description: "Harvest 500 Pumpkins",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Pumpkin Harvested"] || 0,
    requirement: 500,
    sfl: marketRate(0),
    rewards: {
      "Pumpkin Seed": new Decimal(50),
    },
  },
  Timbeerrr: {
    description: "Chop 150 trees",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Tree Chopped"] || 0,
    requirement: 150,
    sfl: marketRate(0),
    rewards: {
      Axe: new Decimal(10),
    },
  },
  Explorer: {
    description: "Expand your land 5 times",
    progress: (gameState: GameState) =>
      gameState.expansions.length - INITIAL_EXPANSIONS.length,
    requirement: 5,
    sfl: marketRate(50),
  },
  "Cool Flower": {
    description: "Harvest 100 cauliflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cauliflower Harvested"] || 0,
    requirement: 100,
    sfl: marketRate(70),
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
    sfl: marketRate(100),
    rewards: {},
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
    sfl: marketRate(0),
    rewards: {
      Axe: new Decimal(20),
    },
  },
  Driller: {
    description: "Mine 50 stone rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Stone Mined"] || 0,
    requirement: 50,
    sfl: marketRate(0),
    rewards: {
      Pickaxe: new Decimal(10),
    },
  },
  "Iron Eyes": {
    description: "Mine 50 iron rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Iron Mined"] || 0,
    requirement: 50,
    sfl: marketRate(0),
    rewards: {
      "Stone Pickaxe": new Decimal(10),
    },
  },
  "Bread Winner": {
    description: "Earn 100 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 100,
    sfl: marketRate(250),
  },

  "Farm Hand": {
    description: "Harvest 10000 crops",
    progress: (gameState: GameState) => {
      const harvestEvents = getKeys(CROPS()).map(
        (name) => `${name} Harvested` as HarvestEvent
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 10000,
    sfl: marketRate(0),
    rewards: {
      "Farmer Bear": new Decimal(1),
    },
  },

  "Beetroot Beast": {
    description: "Harvest 2000 beetroots",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Beetroot Harvested"] || 0,
    requirement: 2000,
    sfl: marketRate(0),
    rewards: {
      "Beetroot Seed": new Decimal(100),
    },
  },

  "My life is potato": {
    description: "Harvest 5000 potatoes",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Potato Harvested"] || 0,
    requirement: 5000,
    sfl: marketRate(300),
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
    sfl: marketRate(0),
    rewards: {
      "Chef Bear": new Decimal(1),
    },
  },

  "Rapid Radish": {
    description: "Harvest 200 radishes",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Radish Harvested"] || 0,
    requirement: 200,
    sfl: marketRate(400),
  },

  "20/20 Vision": {
    description: "Harvest 10,000 carrots",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Carrot Harvested"] || 0,
    requirement: 10000,
    sfl: marketRate(400),
  },
  "El Dorado": {
    description: "Mine 50 gold rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Gold Mined"] || 0,
    requirement: 50,
    sfl: marketRate(0),
    rewards: {
      "Iron Pickaxe": new Decimal(5),
    },
  },

  "Time to chop": {
    description: "Craft 500 axes",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Axe Crafted"] || 0,
    requirement: 500,
    sfl: marketRate(500),
  },
  Contractor: {
    description: "Construct 10 buildings",
    progress: (gameState: GameState) => getKeys(gameState.buildings).length,
    requirement: 10,
    sfl: marketRate(0),
    rewards: {
      "Construction Bear": new Decimal(1),
    },
  },

  Canary: {
    description: "Mine 1000 stone rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Stone Mined"] || 0,
    requirement: 1000,
    sfl: marketRate(500),
  },

  "Staple Crop": {
    description: "Harvest 10000 wheat",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Wheat Harvested"] || 0,
    requirement: 10000,
    sfl: marketRate(500),
  },
  Museum: {
    description: "Place 10 rare items",
    progress: (gameState: GameState) => getKeys(gameState.collectibles).length,
    requirement: 10,
    sfl: marketRate(500),
  },
  "Something Shiny": {
    description: "Mine 500 iron rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Iron Mined"] || 0,
    requirement: 500,
    sfl: marketRate(0),
    rewards: {
      Pickaxe: new Decimal(20),
    },
  },

  "Sunflower Superstar": {
    description: "Harvest 100,000 sunflowers",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100000,
    sfl: marketRate(0),
    rewards: {
      "Sunflower Bear": new Decimal(1),
    },
  },
  "Bumpkin Chainsaw Amateur": {
    description: "Chop 5000 trees",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Tree Chopped"] || 0,
    requirement: 5000,
    sfl: marketRate(0),
    rewards: {
      "Badass Bear": new Decimal(1),
    },
  },
  "Brilliant Bumpkin": {
    description: "Reach level 20",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 20,
    sfl: marketRate(0),
    rewards: {
      "Brilliant Bear": new Decimal(1),
    },
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
    sfl: marketRate(0),
    rewards: {
      "Sunflower Cake": new Decimal(5),
    },
  },
  "Bumpkin Billionaire": {
    description: "Earn 5000 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 5000,
    sfl: marketRate(0),
    rewards: {
      "Rich Bear": new Decimal(1),
    },
  },
  "Patient Parsnips": {
    description: "Harvest 5000 parsnips",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Parsnip Harvested"] || 0,
    requirement: 5000,
    sfl: marketRate(750),
  },

  "High Roller": {
    description: "Spend 7500 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 7500,
    sfl: marketRate(0),
    rewards: {
      "Bear Trap": new Decimal(1),
    },
  },

  "Gold Fever": {
    description: "Mine 500 gold rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Gold Mined"] || 0,
    requirement: 500,
    sfl: marketRate(0),
    rewards: {
      "Classy Bear": new Decimal(1),
    },
  },
  "Crop Champion": {
    description: "Harvest 1 million crops",
    progress: (gameState: GameState) => {
      const harvestEvents = getKeys(CROPS()).map(
        (name) => `${name} Harvested` as HarvestEvent
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 1000000,
    sfl: marketRate(0),
    rewards: {
      "Angel Bear": new Decimal(1),
    },
  },
});
