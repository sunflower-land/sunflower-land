import Decimal from "decimal.js-light";
import { BuildingName } from "./buildings";
import { Cake } from "./craftables";
import { Inventory } from "./game";

export type ConsumableName =
  | "Mashed Potato"
  | "Pumpkin Soup"
  | "Bumpkin Broth"
  | "Boiled Eggs"
  | "Roast Veggies"
  | "Bumpkin Salad"
  | "Cauliflower Burger"
  | "Goblin's Treat"
  | "Club Sandwich"
  | "Pancakes"
  | Cake;

export type Consumable = {
  experience: number;
  name: ConsumableName;
  description: string;
  ingredients: Inventory;
  cookingSeconds: number;
  building: BuildingName;
  // SFL sell rate
  marketRate: number;
};

export const CONSUMABLES: Record<ConsumableName, Consumable> = {
  "Mashed Potato": {
    name: "Mashed Potato",
    description: "Boiled Eggss are always a good breakfast choice",
    experience: 3,
    building: "Fire Pit",
    cookingSeconds: 30,
    ingredients: {
      Potato: new Decimal(10),
    },
    marketRate: 10,
  },

  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: "Boiled Eggss are always a good breakfast choice",
    experience: 24,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Pumpkin: new Decimal(10),
    },
    marketRate: 10,
  },

  "Bumpkin Broth": {
    name: "Bumpkin Broth",
    description: "A perfect broth for a cold day.",
    experience: 96,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Carrot: new Decimal(10),
      Cabbage: new Decimal(5),
    },
    marketRate: 10,
  },

  "Boiled Eggs": {
    name: "Boiled Eggs",
    description: "Boiled Eggss are always a good breakfast choice",
    experience: 44,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Egg: new Decimal(5),
    },
    marketRate: 10,
  },

  "Roast Veggies": {
    name: "Roast Veggies",
    description: "Even Goblin's need to eat their veggies!",
    experience: 226,
    building: "Kitchen",
    cookingSeconds: 60 * 5,
    ingredients: {
      Cauliflower: new Decimal(15),
      Carrot: new Decimal(10),
    },
    marketRate: 10,
  },

  "Bumpkin Salad": {
    name: "Bumpkin Salad",
    description: "Gotta keep your Bumpkin healthy!",
    experience: 440,
    building: "Kitchen",
    cookingSeconds: 60 * 10,
    ingredients: {
      Beetroot: new Decimal(20),
      Parsnip: new Decimal(10),
    },
    marketRate: 10,
  },

  "Goblin's Treat": {
    name: "Goblin's Treat",
    description: "Boiled Eggss are always a good breakfast choice",
    experience: 520,
    building: "Kitchen",
    cookingSeconds: 60 * 10,
    ingredients: {
      Pumpkin: new Decimal(10),
      Radish: new Decimal(20),
      Cabbage: new Decimal(10),
    },
    marketRate: 10,
  },

  "Cauliflower Burger": {
    name: "Cauliflower Burger",
    description: "Calling all cauliflower lovers!",
    experience: 420,
    building: "Kitchen",
    cookingSeconds: 60 * 5,
    ingredients: {
      Cauliflower: new Decimal(15),
      Wheat: new Decimal(5),
    },
    marketRate: 10,
  },

  Pancakes: {
    name: "Pancakes",
    description: "A great start to a Bumpkins day",
    experience: 460,
    building: "Kitchen",
    cookingSeconds: 60 * 5,
    ingredients: {
      Wheat: new Decimal(5),
      // TODO - honey
    },
    marketRate: 10,
  },

  "Club Sandwich": {
    name: "Club Sandwich",
    description: "Filled with Carrots and Roasted Sunflower Seeds",
    experience: 320,
    building: "Kitchen",
    cookingSeconds: 60 * 5,
    ingredients: {
      Sunflower: new Decimal(100),
      Carrot: new Decimal(25),
      Wheat: new Decimal(5),
    },
    marketRate: 10,
  },

  "Sunflower Cake": {
    name: "Sunflower Cake",
    description: "Sunflower Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Sunflower: new Decimal(1000),
      Wheat: new Decimal(10),
      Egg: new Decimal(10),
    },
    marketRate: 10,
  },
  "Potato Cake": {
    name: "Potato Cake",
    description: "Potato Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Potato: new Decimal(500),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 10,
  },
  "Pumpkin Cake": {
    name: "Pumpkin Cake",
    description: "Pumpkin Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Pumpkin: new Decimal(130),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 10,
  },
  "Carrot Cake": {
    name: "Carrot Cake",
    description: "Carrot Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Carrot: new Decimal(120),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 10,
  },
  "Cabbage Cake": {
    name: "Cabbage Cake",
    description: "Cabbage Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Cabbage: new Decimal(90),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 10,
  },
  "Beetroot Cake": {
    name: "Beetroot Cake",
    description: "Beetroot Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Beetroot: new Decimal(100),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 10,
  },
  "Cauliflower Cake": {
    name: "Cauliflower Cake",
    description: "Cauliflower Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Cauliflower: new Decimal(60),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 10,
  },
  "Parsnip Cake": {
    name: "Parsnip Cake",
    description: "Parsnip Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Parsnip: new Decimal(45),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 10,
  },
  "Radish Cake": {
    name: "Radish Cake",
    description: "Radish Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Radish: new Decimal(25),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 10,
  },
  "Wheat Cake": {
    name: "Wheat Cake",
    description: "Wheat Cake",
    building: "Bakery",
    experience: 1,
    cookingSeconds: 60,
    ingredients: {
      Wheat: new Decimal(35),
      Egg: new Decimal(15),
    },
    marketRate: 10,
  },
};
