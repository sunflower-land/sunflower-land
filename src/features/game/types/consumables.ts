import Decimal from "decimal.js-light";
import { BuildingName } from "./buildings";
import { Cake } from "./craftables";
import { Inventory } from "./game";

export type ConsumableName =
  | "Boiled Egg"
  | "Mashed Potato"
  | "Pumpkin Soup"
  | "Bumpkin Broth"
  | Cake;

export type Consumable = {
  experience: number;
  name: ConsumableName;
  description: string;
  stamina: number;
  ingredients: Inventory;
  cookingSeconds: number;
  building: BuildingName;
};

export const CONSUMABLES: Record<ConsumableName, Consumable> = {
  "Boiled Egg": {
    name: "Boiled Egg",
    description: "Boiled Eggs are always a good breakfast choice",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Egg: new Decimal(1),
    },
  },
  "Bumpkin Broth": {
    name: "Bumpkin Broth",
    description: "Boiled Eggs are always a good breakfast choice",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Egg: new Decimal(1),
    },
  },
  "Mashed Potato": {
    name: "Mashed Potato",
    description: "Boiled Eggs are always a good breakfast choice",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Egg: new Decimal(1),
    },
  },
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: "Boiled Eggs are always a good breakfast choice",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Egg: new Decimal(1),
    },
  },
  "Sunflower Cake": {
    name: "Sunflower Cake",
    description: "Sunflower Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Sunflower: new Decimal(1000),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
  },
  "Potato Cake": {
    name: "Potato Cake",
    description: "Potato Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Potato: new Decimal(500),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
  },
  "Pumpkin Cake": {
    name: "Pumpkin Cake",
    description: "Pumpkin Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Pumpkin: new Decimal(130),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
  },
  "Carrot Cake": {
    name: "Carrot Cake",
    description: "Carrot Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Carrot: new Decimal(120),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
  },
  "Cabbage Cake": {
    name: "Cabbage Cake",
    description: "Cabbage Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Cabbage: new Decimal(90),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
  },
  "Beetroot Cake": {
    name: "Beetroot Cake",
    description: "Beetroot Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Beetroot: new Decimal(100),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
  },
  "Cauliflower Cake": {
    name: "Cauliflower Cake",
    description: "Cauliflower Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Cauliflower: new Decimal(60),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
  },
  "Parsnip Cake": {
    name: "Parsnip Cake",
    description: "Parsnip Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Parsnip: new Decimal(45),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
  },
  "Radish Cake": {
    name: "Radish Cake",
    description: "Radish Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Radish: new Decimal(25),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
  },
  "Wheat Cake": {
    name: "Wheat Cake",
    description: "Wheat Cake",
    experience: 1,
    stamina: 5,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Wheat: new Decimal(35),
      Egg: new Decimal(15),
    },
  },
};
