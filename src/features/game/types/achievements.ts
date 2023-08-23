import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { getBumpkinLevel } from "../lib/level";
import { GameState, Inventory } from "../types/game";
import { CookEvent, CraftedEvent, HarvestEvent } from "./bumpkinActivity";
import { COOKABLES } from "./consumables";
import { CAKES, getKeys, TOOLS } from "./craftables";
import { CROPS } from "./crops";
import { FRUIT } from "./fruits";
import { getSeasonalTicket } from "./seasons";

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
  | "Museum"
  | "Orange Squeeze"
  | "Apple of my Eye"
  | "Blue Chip"
  | "Fruit Platter"
  | "Well of Prosperity"
  | "Scarecrow Maestro"
  | "Delivery Dynamo"
  | "Land Baron"
  | "Seasoned Farmer"
  | "Land Expansion Enthusiast"
  | "Treasure Hunter"
  | "Egg-cellent Collection"
  | "Land Expansion Extraordinaire"
  | "Fruit Aficionado"
  | "Crowd Favourite";

export type Achievement = {
  description: string;
  introduction?: string[];
  progress: (game: GameState) => number;
  requirement: number;
  sfl: Decimal;
  rewards?: Inventory;
};

export const ACHIEVEMENTS: () => Record<AchievementName, Achievement> = () => ({
  // Crops
  "Bread Winner": {
    description: "Earn 0.01 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 0.01,
    sfl: new Decimal(0),
    introduction: [
      "Well, well, well, partner... It looks like you need some SFL!",
      "In Sunflower Land, a healthy stash of SFL is the key to crafting tools, buildings and rare NFTs",
      "The quickest way to earn SFL is by planting and selling crops.",
    ],
  },
  "Sun Seeker": {
    description: "Harvest Sunflower 100 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100,
    sfl: marketRate(0),
    rewards: {
      "Basic Bear": new Decimal(1),
    },
  },
  "Cabbage King": {
    description: "Harvest Cabbage 200 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cabbage Harvested"] || 0,
    requirement: 200,
    sfl: marketRate(10),
  },
  "Jack O'Latern": {
    description: "Harvest Pumpkin 500 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Pumpkin Harvested"] || 0,
    requirement: 500,
    sfl: marketRate(0),
    rewards: {
      "Pumpkin Seed": new Decimal(50),
    },
  },
  "Cool Flower": {
    description: "Harvest Cauliflower 100 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cauliflower Harvested"] || 0,
    requirement: 100,
    sfl: marketRate(70),
  },

  "Farm Hand": {
    description: "Harvest crops 10,000 times",
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
    description: "Harvest Beetroot 2,000 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Beetroot Harvested"] || 0,
    requirement: 2000,
    sfl: marketRate(0),
    rewards: {
      "Beetroot Seed": new Decimal(100),
    },
  },

  "My life is potato": {
    description: "Harvest Potato 5,000 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Potato Harvested"] || 0,
    requirement: 5000,
    sfl: marketRate(300),
  },

  "Rapid Radish": {
    description: "Harvest Radish 200 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Radish Harvested"] || 0,
    requirement: 200,
    sfl: marketRate(400),
  },
  "20/20 Vision": {
    description: "Harvest Carrot 10,000 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Carrot Harvested"] || 0,
    requirement: 10000,
    sfl: marketRate(400),
  },
  "Staple Crop": {
    description: "Harvest Wheat 10,000 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Wheat Harvested"] || 0,
    requirement: 10000,
    sfl: marketRate(500),
  },
  "Sunflower Superstar": {
    description: "Harvest Sunflower 100,000 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100000,
    sfl: marketRate(0),
    rewards: {
      "Sunflower Bear": new Decimal(1),
    },
  },
  "Bumpkin Billionaire": {
    description: "Earn 5,000 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 5000,
    sfl: marketRate(0),
    rewards: {
      "Rich Bear": new Decimal(1),
    },
  },
  "Patient Parsnips": {
    description: "Harvest Parsnip 5,000 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Parsnip Harvested"] || 0,
    requirement: 5000,
    sfl: marketRate(750),
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

  // Cooking
  "Busy Bumpkin": {
    description: "Reach level 3",
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 3,
    sfl: marketRate(10),
    introduction: [
      "Howdy, my ambitious friend! To unlock new crops, expansions, buildings and much more you will need to level up.",
      "Head over to the Fire Pit, cook up a delicious recipe and feed it to your Bumpkin",
    ],
  },
  "Kiss the Cook": {
    description: "Cook 20 meals",
    progress: (gameState: GameState) => {
      const cookEvents = getKeys(COOKABLES).map(
        (name) => `${name} Cooked` as CookEvent
      );

      return cookEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 20,
    sfl: marketRate(0),
    rewards: {
      "Club Sandwich": new Decimal(1),
    },
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
    description: "Cook 5,000 meals",
    progress: (gameState: GameState) => {
      const cookEvents = getKeys(COOKABLES).map(
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

  // Crafting
  "Scarecrow Maestro": {
    description: " Craft a scarecrow and boost your crops",
    progress: (gameState: GameState) =>
      gameState.collectibles["Basic Scarecrow"]?.length ?? 0,
    requirement: 1,
    sfl: marketRate(0),
    introduction: [
      "Howdy, partner! It is time you learn the art of crafting and boosted your farming abilities",
      "Travel to the Pumpkin Plaza, visit the Blacksmith and craft a Scarecrow",
    ],
  },
  "Big Spender": {
    description: "Spend 10 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 10,
    sfl: marketRate(20),
  },
  Museum: {
    description: "Have 10 different kinds of rare items placed on your land",
    progress: (gameState: GameState) => getKeys(gameState.collectibles).length,
    requirement: 10,
    sfl: marketRate(0),
    rewards: {
      "Potted Pumpkin": new Decimal(1),
    },
  },
  "High Roller": {
    description: "Spend 7,500 SFL",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 7500,
    sfl: marketRate(0),
    rewards: {
      "Bear Trap": new Decimal(1),
    },
  },

  // Gathering
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
    sfl: marketRate(0),
    rewards: {
      Axe: new Decimal(25),
    },
  },
  Canary: {
    description: "Mine 1,000 stone rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Stone Mined"] || 0,
    requirement: 1000,
    sfl: marketRate(500),
  },
  "Something Shiny": {
    description: "Mine 500 iron rocks",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Iron Mined"] || 0,
    requirement: 500,
    sfl: marketRate(0),
    rewards: {
      "Stone Pickaxe": new Decimal(20),
    },
  },
  "Bumpkin Chainsaw Amateur": {
    description: "Chop 5,000 trees",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Tree Chopped"] || 0,
    requirement: 5000,
    sfl: marketRate(0),
    rewards: {
      "Badass Bear": new Decimal(1),
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
  Explorer: {
    introduction: [
      "Looks like our little island is getting crowded. If we want to craft buildings and rare NFTs, we'll need more space.",
      "Let's gather some wood by chopping down these trees and expand the island. Go ahead and figure out the best way to do it.",
    ],
    description: "Expand your land",
    progress: (gameState: GameState) =>
      gameState.inventory["Basic Land"]?.toNumber() ?? 0,
    requirement: 4,
    sfl: new Decimal(0),
  },
  "Land Expansion Enthusiast": {
    description: "Expand your land to new horizons.",
    progress: (gameState: GameState) => {
      return gameState.inventory["Basic Land"]?.toNumber() ?? 0;
    },
    requirement: 6,
    sfl: marketRate(0),
  },
  "Land Expansion Extraordinaire": {
    description: "Expand your land to new horizons.",
    progress: (gameState: GameState) => {
      return gameState.inventory["Basic Land"]?.toNumber() ?? 0;
    },
    requirement: 7,
    sfl: marketRate(0),
  },
  "Land Baron": {
    description: "Expand your land to new horizons.",
    progress: (gameState: GameState) => {
      return gameState.inventory["Basic Land"]?.toNumber() ?? 0;
    },
    requirement: 5,
    sfl: marketRate(0),
  },

  // Building
  "Well of Prosperity": {
    description: "Build a well",
    progress: (gameState: GameState) => {
      return gameState.buildings["Water Well"]?.length ?? 0;
    },
    requirement: 1,
    sfl: marketRate(0),
    introduction: [
      "Well, well, well, what do we have here?",
      "It looks like your crops are thirsty. To support more crops you must first build a well.",
    ],
  },
  Contractor: {
    description: "Have 10 buildings constructed on your land",
    progress: (gameState: GameState) => {
      const totalBuildingsOnLand = getKeys(gameState.buildings).reduce(
        (a, b) => a + (gameState.buildings[b]?.length ?? 0),
        0
      );
      return totalBuildingsOnLand;
    },
    requirement: 10,
    sfl: marketRate(0),
    rewards: {
      "Construction Bear": new Decimal(1),
    },
  },

  // Fruit
  "Fruit Aficionado": {
    description: "Harvest 50 fruit",
    progress: (gameState: GameState) => {
      const harvestEvents = getKeys(FRUIT()).map(
        (name) => `${name} Harvested` as HarvestEvent
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 50,
    sfl: marketRate(0),
    introduction: [
      "Hey there, fruit gatherer! Fruits are nature's sweetest gifts, and they bring a burst of flavor to your farm.",
      "By collecting different fruits, such as apples, oranges, and blueberries, you'll unlock unique recipes, boost your cooking skills, and create delightful treats",
    ],
  },
  "Orange Squeeze": {
    description: "Harvest Orange 100 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Orange Harvested"] || 0,
    requirement: 100,
    sfl: marketRate(10),
  },
  "Apple of my Eye": {
    description: "Harvest Apple 500 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Apple Harvested"] || 0,
    requirement: 500,
    sfl: marketRate(400),
  },
  "Blue Chip": {
    description: "Harvest Blueberry 5,000 times",
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Blueberry Harvested"] || 0,
    requirement: 5000,
    sfl: marketRate(800),
  },
  "Fruit Platter": {
    description: "Harvest 50,000 fruits",
    progress: (gameState: GameState) => {
      const harvestEvents = getKeys(FRUIT()).map(
        (name) => `${name} Harvested` as HarvestEvent
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 50000,
    sfl: marketRate(0),
    rewards: {
      "Devil Bear": new Decimal(1),
    },
  },

  // Deliveries
  "Delivery Dynamo": {
    description: "Complete 3 deliveries",
    progress: (gameState: GameState) => {
      return gameState.delivery.fulfilledCount;
    },
    requirement: 3,
    sfl: marketRate(0),
    introduction: [
      "Howdy, reliable farmer! Bumpkins from all around need your help with deliveries.",
      "By completing deliveries, you'll make them happy and earn some fantastic SFL rewards in return ",
    ],
  },
  "Crowd Favourite": {
    description: "Complete 100 deliveries",
    progress: (gameState: GameState) => {
      return gameState.delivery.fulfilledCount;
    },
    requirement: 100,
    sfl: marketRate(0),
  },

  // Seasons
  "Seasoned Farmer": {
    description: "Collect 50 Seasonal Resources",
    progress: (gameState: GameState) => {
      return gameState.inventory[getSeasonalTicket()]?.toNumber() ?? 0;
    },
    requirement: 50,
    sfl: marketRate(0),
    introduction: [
      "Howdy, seasonal adventurer! Sunflower Land is known for its special seasons filled with unique items and surprises.",
      "By collecting Seasonal resources, you'll gain access to limited-time rewards, exclusive crafts, and rare treasures. It's like having a front-row ticket to the wonders of each season.",
      "So complete tasks, participate in events, and gather those Seasonal Tickets to enjoy the best that Sunflower Land has to offer!",
    ],
  },

  // Scavenger
  "Treasure Hunter": {
    description: "Dig 10 holes",
    progress: (gameState: GameState) => {
      return gameState.bumpkin?.activity?.["Treasure Dug"] ?? 0;
    },
    requirement: 10,
    sfl: marketRate(0),
    introduction: [
      "Ahoy, treasure hunter! Sunflower Land is full of hidden treasures waiting to be discovered.",
      "Grab your shovel and head to Treasure Island, where you can dig for valuable items and rare surprises.",
    ],
  },

  // Animals
  "Egg-cellent Collection": {
    description: "Collect 10 Eggs",
    progress: (gameState: GameState) => {
      return gameState.bumpkin?.activity?.["Egg Collected"] ?? 0;
    },
    requirement: 10,
    sfl: marketRate(0),
    introduction: [
      "Howdy, egg collector! Chickens are wonderful farm companions that provide us with delicious eggs.",
      "By collecting eggs, you'll have a fresh supply of ingredients for cooking, and you'll also unlock special recipes and bonuses.",
    ],
  },
});
