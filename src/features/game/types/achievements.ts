import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "../lib/level";
import { GameState, Inventory } from "./game";
import { CookEvent, CraftedEvent, HarvestEvent } from "./bumpkinActivity";
import { COOKABLES, COOKABLE_CAKES } from "./consumables";
import { getKeys, TOOLS } from "./craftables";
import { PLOT_CROPS } from "./crops";
import { GREENHOUSE_FRUIT, PATCH_FRUIT } from "./fruits";
import { getSeasonalTicket } from "./seasons";
import { translate } from "lib/i18n/translate";

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
  coins: number;
  rewards?: Inventory;
};

export const ACHIEVEMENTS: () => Record<AchievementName, Achievement> = () => ({
  // Crops
  "Bread Winner": {
    description: translate("breadWinner.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 0.001,
    coins: 0,
    introduction: [
      translate("breadWinner.one"),
      translate("breadWinner.two"),
      translate("breadWinner.three"),
    ],
  },
  "Sun Seeker": {
    description: translate("sunSeeker.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100,
    coins: 0,
    rewards: {
      "Basic Bear": new Decimal(1),
    },
  },
  "Cabbage King": {
    description: translate("cabbageKing.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cabbage Harvested"] || 0,
    requirement: 200,
    coins: 10,
  },
  "Jack O'Latern": {
    description: translate("jackOLantern.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Pumpkin Harvested"] || 0,
    requirement: 500,
    coins: 0,
    rewards: {
      "Pumpkin Seed": new Decimal(50),
    },
  },
  "Cool Flower": {
    description: translate("coolFlower.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Cauliflower Harvested"] || 0,
    requirement: 100,
    coins: 70,
  },
  "Farm Hand": {
    description: translate("farmHand.description"),
    progress: (gameState: GameState) => {
      const harvestEvents = getKeys(PLOT_CROPS).map(
        (name) => `${name} Harvested` as HarvestEvent,
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 10000,
    coins: 0,
    rewards: {
      "Farmer Bear": new Decimal(1),
    },
  },
  "Beetroot Beast": {
    description: translate("beetrootBeast.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Beetroot Harvested"] || 0,
    requirement: 2000,
    coins: 0,
    rewards: {
      "Beetroot Seed": new Decimal(100),
    },
  },
  "My life is potato": {
    description: translate("myLifeIsPotato.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Potato Harvested"] || 0,
    requirement: 5000,
    coins: 300,
  },
  "Rapid Radish": {
    description: translate("rapidRadish.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Radish Harvested"] || 0,
    requirement: 200,
    coins: 400,
  },
  "20/20 Vision": {
    description: translate("twentyTwentyVision.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Carrot Harvested"] || 0,
    requirement: 10000,
    coins: 400,
  },
  "Staple Crop": {
    description: translate("stapleCrop.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Wheat Harvested"] || 0,
    requirement: 10000,
    coins: 500,
  },
  "Sunflower Superstar": {
    description: translate("sunflowerSuperstar.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Sunflower Harvested"] || 0,
    requirement: 100000,
    coins: 0,
    rewards: {
      "Sunflower Bear": new Decimal(1),
    },
  },
  "Bumpkin Billionaire": {
    description: translate("bumpkinBillionaire.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Earned"] || 0,
    requirement: 5000,
    coins: 0,
    rewards: {
      "Rich Bear": new Decimal(1),
    },
  },
  "Patient Parsnips": {
    description: translate("patientParsnips.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Parsnip Harvested"] || 0,
    requirement: 5000,
    coins: 750,
  },
  "Crop Champion": {
    description: translate("cropChampion.description"),
    progress: (gameState: GameState) => {
      const harvestEvents = getKeys(PLOT_CROPS).map(
        (name) => `${name} Harvested` as HarvestEvent,
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 1000000,
    coins: 0,
    rewards: {
      "Angel Bear": new Decimal(1),
    },
  },

  // Cooking
  "Busy Bumpkin": {
    description: translate("busyBumpkin.description"),
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 2,
    coins: 10,
    introduction: [translate("busyBumpkin.one"), translate("busyBumpkin.two")],
  },
  "Kiss the Cook": {
    description: translate("kissTheCook.description"),
    progress: (gameState: GameState) => {
      const cookEvents = getKeys(COOKABLES).map(
        (name) => `${name} Cooked` as CookEvent,
      );

      return cookEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 20,
    coins: 0,
    rewards: {
      "Club Sandwich": new Decimal(1),
    },
  },
  "Bakers Dozen": {
    description: translate("bakersDozen.description"),
    progress: (gameState: GameState) => {
      const cakeEvents = getKeys(COOKABLE_CAKES).map(
        (name) => `${name} Cooked` as CookEvent,
      );

      const bakedCakes = cakeEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);

      return bakedCakes;
    },
    requirement: 13,
    coins: 0,
    rewards: {
      "Chef Bear": new Decimal(1),
    },
  },
  "Brilliant Bumpkin": {
    description: translate("brilliantBumpkin.description"),
    progress: (gameState: GameState) =>
      getBumpkinLevel(gameState.bumpkin?.experience || 0),
    requirement: 20,
    coins: 0,
    rewards: {
      "Brilliant Bear": new Decimal(1),
    },
  },
  "Chef de Cuisine": {
    description: translate("chefDeCuisine.description"),
    progress: (gameState: GameState) => {
      const cookEvents = getKeys(COOKABLES).map(
        (name) => `${name} Cooked` as CookEvent,
      );

      return cookEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 5000,
    coins: 0,
    rewards: {
      "Sunflower Cake": new Decimal(5),
    },
  },

  // Crafting
  "Scarecrow Maestro": {
    description: translate("scarecrowMaestro.description"),
    progress: (gameState: GameState) =>
      gameState.collectibles["Basic Scarecrow"]?.length ?? 0,
    requirement: 1,
    coins: 0,
    introduction: [
      translate("scarecrowMaestro.one"),
      translate("scarecrowMaestro.two"),
    ],
  },
  "Big Spender": {
    description: translate("bigSpender.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 10,
    coins: 20,
  },
  Museum: {
    description: translate("museum.description"),
    progress: (gameState: GameState) => getKeys(gameState.collectibles).length,
    requirement: 10,
    coins: 0,
    rewards: {
      "Potted Pumpkin": new Decimal(1),
    },
  },
  "High Roller": {
    description: translate("highRoller.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["SFL Spent"] || 0,
    requirement: 7500,
    coins: 0,
    rewards: {
      "Bear Trap": new Decimal(1),
    },
  },

  // Gathering
  Timbeerrr: {
    description: translate("timbeerrr.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Tree Chopped"] || 0,
    requirement: 150,
    coins: 0,
    rewards: {
      Axe: new Decimal(10),
    },
  },
  Craftmanship: {
    description: translate("craftmanship.description"),
    progress: (gameState: GameState) => {
      const craftEvent = getKeys(TOOLS).map(
        (name) => `${name} Crafted` as CraftedEvent,
      );

      return craftEvent.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 100,
    coins: 0,
    rewards: {
      Axe: new Decimal(20),
    },
  },
  Driller: {
    description: translate("driller.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Stone Mined"] || 0,
    requirement: 50,
    coins: 0,
    rewards: {
      Pickaxe: new Decimal(10),
    },
  },
  "Iron Eyes": {
    description: translate("ironEyes.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Iron Mined"] || 0,
    requirement: 50,
    coins: 0,
    rewards: {
      "Stone Pickaxe": new Decimal(10),
    },
  },
  "El Dorado": {
    description: translate("elDorado.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Gold Mined"] || 0,
    requirement: 50,
    coins: 0,
    rewards: {
      "Iron Pickaxe": new Decimal(5),
    },
  },
  "Time to chop": {
    description: translate("timeToChop.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Axe Crafted"] || 0,
    requirement: 500,
    coins: 0,
    rewards: {
      Axe: new Decimal(25),
    },
  },
  Canary: {
    description: translate("canary.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Stone Mined"] || 0,
    requirement: 1000,
    coins: 500,
  },
  "Something Shiny": {
    description: translate("somethingShiny.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Iron Mined"] || 0,
    requirement: 500,
    coins: 0,
    rewards: {
      "Stone Pickaxe": new Decimal(20),
    },
  },
  "Bumpkin Chainsaw Amateur": {
    description: translate("bumpkinChainsawAmateur.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Tree Chopped"] || 0,
    requirement: 5000,
    coins: 0,
    rewards: {
      "Badass Bear": new Decimal(1),
    },
  },
  "Gold Fever": {
    description: translate("goldFever.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Gold Mined"] || 0,
    requirement: 500,
    coins: 0,
    rewards: {
      "Classy Bear": new Decimal(1),
    },
  },
  Explorer: {
    description: translate("expand.land"),
    progress: (gameState: GameState) =>
      gameState.inventory["Basic Land"]?.toNumber() ?? 0,
    requirement: 4,
    introduction: [translate("pete.intro.four"), translate("explorer.one")],
    coins: 0,
  },
  "Land Expansion Enthusiast": {
    description: translate("expansion.description"),
    progress: (gameState: GameState) => {
      return gameState.inventory["Basic Land"]?.toNumber() ?? 0;
    },
    requirement: 6,
    coins: 0,
  },
  "Land Expansion Extraordinaire": {
    description: translate("expansion.description"),
    progress: (gameState: GameState) => {
      return gameState.inventory["Basic Land"]?.toNumber() ?? 0;
    },
    requirement: 7,
    coins: 0,
  },
  "Land Baron": {
    description: translate("expansion.description"),
    progress: (gameState: GameState) => {
      return gameState.inventory["Basic Land"]?.toNumber() ?? 0;
    },
    requirement: 5,
    coins: 0,
  },

  // Building
  "Well of Prosperity": {
    description: translate("wellOfProsperity.description"),
    progress: (gameState: GameState) => {
      return gameState.buildings["Water Well"]?.length ?? 0;
    },
    requirement: 1,
    coins: 0,
    introduction: [
      translate("wellOfProsperity.one"),
      translate("wellOfProsperity.two"),
    ],
  },
  Contractor: {
    description: translate("contractor.description"),
    progress: (gameState: GameState) => {
      const totalBuildingsOnLand = getKeys(gameState.buildings).reduce(
        (a, b) => a + (gameState.buildings[b]?.length ?? 0),
        0,
      );
      return totalBuildingsOnLand;
    },
    requirement: 10,
    coins: 0,
    rewards: {
      "Construction Bear": new Decimal(1),
    },
  },

  // Fruit
  "Fruit Aficionado": {
    description: translate("fruitAficionado.description"),
    progress: (gameState: GameState) => {
      const fruits = [
        ...getKeys(PATCH_FRUIT()),
        ...getKeys(GREENHOUSE_FRUIT()),
      ];
      const harvestEvents = fruits.map(
        (name) => `${name} Harvested` as HarvestEvent,
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 50,
    coins: 0,
    introduction: [
      translate("fruitAficionado.one"),
      translate("fruitAficionado.two"),
    ],
  },
  "Orange Squeeze": {
    description: translate("orangeSqueeze.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Orange Harvested"] || 0,
    requirement: 100,
    coins: 10,
  },
  "Apple of my Eye": {
    description: translate("appleOfMyEye.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Apple Harvested"] || 0,
    requirement: 500,
    coins: 400,
  },
  "Blue Chip": {
    description: translate("blueChip.description"),
    progress: (gameState: GameState) =>
      gameState.bumpkin?.activity?.["Blueberry Harvested"] || 0,
    requirement: 5000,
    coins: 800,
  },
  "Fruit Platter": {
    description: translate("fruitPlatter.description"),
    progress: (gameState: GameState) => {
      const fruits = [
        ...getKeys(PATCH_FRUIT()),
        ...getKeys(GREENHOUSE_FRUIT()),
      ];
      const harvestEvents = fruits.map(
        (name) => `${name} Harvested` as HarvestEvent,
      );

      return harvestEvents.reduce((count, activityName) => {
        const amount = gameState.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 50000,
    coins: 0,
    rewards: {
      "Devil Bear": new Decimal(1),
    },
  },

  // Deliveries
  "Delivery Dynamo": {
    description: translate("deliveryDynamo.description"),
    progress: (gameState: GameState) => {
      return gameState.delivery.fulfilledCount;
    },
    requirement: 3,
    coins: 0,
    introduction: [
      translate("deliveryDynamo.one"),
      translate("deliveryDynamo.two"),
    ],
  },
  "Crowd Favourite": {
    description: translate("crowdFavourite.description"),
    progress: (gameState: GameState) => {
      return gameState.delivery.fulfilledCount;
    },
    requirement: 100,
    coins: 0,
  },

  // Seasons
  "Seasoned Farmer": {
    description: translate("seasonedFarmer.description"),
    progress: (gameState: GameState) => {
      return gameState.inventory[getSeasonalTicket()]?.toNumber() ?? 0;
    },
    requirement: 50,
    coins: 0,
    introduction: [
      translate("seasonedFarmer.one"),
      translate("seasonedFarmer.two"),
      translate("seasonedFarmer.three"),
    ],
  },

  // Scavenger
  "Treasure Hunter": {
    description: translate("treasureHunter.description"),
    progress: (gameState: GameState) => {
      return gameState.bumpkin?.activity?.["Treasure Dug"] ?? 0;
    },
    requirement: 10,
    coins: 0,
    introduction: [
      translate("treasureHunter.one"),
      translate("treasureHunter.two"),
    ],
  },

  // Animals
  "Egg-cellent Collection": {
    description: translate("eggcellentCollection.description"),
    progress: (gameState: GameState) => {
      return gameState.bumpkin?.activity?.["Egg Collected"] ?? 0;
    },
    requirement: 10,
    coins: 0,
    introduction: [
      translate("eggcellentCollection.one"),
      translate("eggcellentCollection.two"),
    ],
  },
});
