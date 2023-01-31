import Decimal from "decimal.js-light";
import { BuildingName } from "./buildings";
import { Cake, getKeys } from "./craftables";
import { Inventory } from "./game";

type JuiceName =
  | "Apple Juice"
  | "Orange Juice"
  | "Purple Smoothie"
  | "Power Smoothie"
  | "Bumpkin Detox";

export type CookableName =
  | "Mashed Potato"
  | "Pumpkin Soup"
  | "Bumpkin Broth"
  | "Boiled Eggs"
  | "Mushroom Soup"
  | "Roast Veggies"
  | "Bumpkin Salad"
  | "Cauliflower Burger"
  | "Mushroom Jacket Potatoes"
  | "Goblin's Treat"
  | "Club Sandwich"
  | "Kale Stew"
  | "Pancakes"
  | "Kale & Mushroom Pie"
  | "Fermented Carrots"
  | "Sauerkraut"
  | "Blueberry Jam"
  | "Apple Pie"
  | "Orange Cake"
  | "Honey Cake"
  | "Sunflower Crunch"
  | "Reindeer Carrot"
  | Cake
  | JuiceName;

export type ConsumableName = CookableName | "Pirate Cake";

export type Cookable = {
  experience: number;
  name: CookableName;
  description: string;
  ingredients: Inventory;
  cookingSeconds: number;
  building: BuildingName;
  // SFL sell rate
  marketRate: number;
  disabled?: boolean;
};

export type Consumable = Omit<
  Cookable,
  "name" | "ingredients" | "cookingSeconds" | "building" | "marketRate"
> & { name: ConsumableName };

export const COOKABLES: Record<CookableName, Cookable> = {
  "Mashed Potato": {
    name: "Mashed Potato",
    description: "My life is potato.",
    experience: 3,
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Potato: new Decimal(10),
    },
    marketRate: 10,
  },
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: "Creamy, orange and healthy!",
    experience: 24,
    building: "Fire Pit",
    cookingSeconds: 60 * 3,
    ingredients: {
      Pumpkin: new Decimal(10),
    },
    marketRate: 16,
  },

  "Bumpkin Broth": {
    name: "Bumpkin Broth",
    description: "A perfect broth for a cold day.",
    experience: 96,
    building: "Fire Pit",
    cookingSeconds: 60 * 20,
    ingredients: {
      Carrot: new Decimal(10),
      Cabbage: new Decimal(5),
    },
    marketRate: 64,
  },

  "Boiled Eggs": {
    name: "Boiled Eggs",
    description: "Boiled Eggs are great for breakfast",
    experience: 90,
    building: "Fire Pit",
    cookingSeconds: 60 * 60,
    ingredients: {
      Egg: new Decimal(5),
    },
    marketRate: 160,
  },

  "Kale Stew": {
    name: "Kale Stew",
    description: "A perfect Bumpkin Booster",
    experience: 400,
    building: "Fire Pit",
    cookingSeconds: 60 * 60 * 2,
    ingredients: {
      Kale: new Decimal(10),
    },
    marketRate: 400,
  },

  "Roast Veggies": {
    name: "Roast Veggies",
    description: "Even Goblins need to eat their veggies!",
    experience: 170,
    building: "Kitchen",
    cookingSeconds: 60 * 60 * 2,
    ingredients: {
      Cauliflower: new Decimal(15),
      Carrot: new Decimal(10),
    },
    marketRate: 240,
  },

  "Bumpkin Salad": {
    name: "Bumpkin Salad",
    description: "Gotta keep your Bumpkin healthy!",
    experience: 290,
    building: "Kitchen",
    cookingSeconds: 60 * 60 * 3.5,
    ingredients: {
      Beetroot: new Decimal(20),
      Parsnip: new Decimal(10),
    },
    marketRate: 400,
  },

  "Goblin's Treat": {
    name: "Goblin's Treat",
    description: "Goblins go crazy for this stuff!",
    experience: 500,
    building: "Kitchen",
    cookingSeconds: 60 * 60 * 6,
    ingredients: {
      Pumpkin: new Decimal(10),
      Radish: new Decimal(20),
      Cabbage: new Decimal(10),
    },
    marketRate: 800,
  },

  "Cauliflower Burger": {
    name: "Cauliflower Burger",
    description: "Calling all cauliflower lovers!",
    experience: 255,
    building: "Kitchen",
    cookingSeconds: 60 * 60 * 3,
    ingredients: {
      Cauliflower: new Decimal(15),
      Wheat: new Decimal(5),
    },
    marketRate: 304,
  },

  Pancakes: {
    name: "Pancakes",
    description: "A great start to a Bumpkins day",
    experience: 480,
    building: "Kitchen",
    cookingSeconds: 60 * 20,
    ingredients: {
      Wheat: new Decimal(5),
      Honey: new Decimal(10),
    },
    marketRate: 10,
  },

  "Club Sandwich": {
    name: "Club Sandwich",
    description: "Filled with Carrots and Roasted Sunflower Seeds",
    experience: 170,
    building: "Kitchen",
    cookingSeconds: 60 * 60 * 3,
    ingredients: {
      Sunflower: new Decimal(100),
      Carrot: new Decimal(25),
      Wheat: new Decimal(5),
    },
    marketRate: 184,
  },

  "Sunflower Cake": {
    name: "Sunflower Cake",
    description: "Sunflower Cake",
    experience: 525,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 6.5,
    ingredients: {
      Sunflower: new Decimal(1000),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 440,
  },
  "Potato Cake": {
    name: "Potato Cake",
    description: "Potato Cake",
    experience: 650,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 10.5,
    ingredients: {
      Potato: new Decimal(500),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 560,
  },
  "Pumpkin Cake": {
    name: "Pumpkin Cake",
    description: "Pumpkin Cake",
    experience: 625,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 10.5,
    ingredients: {
      Pumpkin: new Decimal(130),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 520,
  },
  "Carrot Cake": {
    name: "Carrot Cake",
    description: "Carrot Cake",
    experience: 750,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 13,
    ingredients: {
      Carrot: new Decimal(120),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 600,
  },
  "Cabbage Cake": {
    name: "Cabbage Cake",
    description: "Cabbage Cake",
    experience: 860,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 15,
    ingredients: {
      Cabbage: new Decimal(90),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 720,
  },
  "Beetroot Cake": {
    name: "Beetroot Cake",
    description: "Beetroot Cake",
    experience: 1250,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 22,
    ingredients: {
      Beetroot: new Decimal(100),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 960,
  },
  "Cauliflower Cake": {
    name: "Cauliflower Cake",
    description: "Cauliflower Cake",
    experience: 1190,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 22,
    ingredients: {
      Cauliflower: new Decimal(60),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 960,
  },
  "Parsnip Cake": {
    name: "Parsnip Cake",
    description: "Parsnip Cake",
    experience: 1300,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 24,
    ingredients: {
      Parsnip: new Decimal(45),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 960,
  },
  "Radish Cake": {
    name: "Radish Cake",
    description: "Radish Cake",
    experience: 1200,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 24,
    ingredients: {
      Radish: new Decimal(25),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 880,
  },
  "Wheat Cake": {
    name: "Wheat Cake",
    description: "Wheat Cake",
    experience: 1100,
    building: "Bakery",
    cookingSeconds: 60 * 60 * 24,
    ingredients: {
      Wheat: new Decimal(35),
      Egg: new Decimal(15),
    },
    marketRate: 800,
  },
  "Apple Pie": {
    name: "Apple Pie",
    description: "Bumpkin Betty's famous recipe",
    experience: 720,
    building: "Bakery",
    cookingSeconds: 60 * 240,
    ingredients: {
      Apple: new Decimal(5),
      Wheat: new Decimal(10),
      Egg: new Decimal(10),
    },
    marketRate: 550,
  },
  "Blueberry Jam": {
    name: "Blueberry Jam",
    description: "Goblins will do anything for this jam",
    experience: 380,
    building: "Deli",
    cookingSeconds: 60 * 24 * 60,
    ingredients: {
      Blueberry: new Decimal(5),
    },
    marketRate: 550,
  },
  "Fermented Carrots": {
    name: "Fermented Carrots",
    description: "Got a surplus of carrots?",
    experience: 250,
    building: "Deli",
    cookingSeconds: 60 * 24 * 60,
    ingredients: {
      Carrot: new Decimal(20),
    },
    marketRate: 112,
  },
  "Honey Cake": {
    name: "Honey Cake",
    description: "A scrumptious cake!",
    experience: 760,
    building: "Bakery",
    cookingSeconds: 60 * 240,
    ingredients: {
      Honey: new Decimal(10),
      Wheat: new Decimal(10),
      Egg: new Decimal(10),
    },
    marketRate: 550,
  },
  "Kale & Mushroom Pie": {
    name: "Kale & Mushroom Pie",
    description: "A traditional Sapphiron recipe",
    experience: 720,
    building: "Bakery",
    cookingSeconds: 60 * 240,

    ingredients: {
      "Wild Mushroom": new Decimal(10),
      Kale: new Decimal(5),
      Wheat: new Decimal(5),
    },
    marketRate: 550,
  },

  "Mushroom Jacket Potatoes": {
    name: "Mushroom Jacket Potatoes",
    description: "Cram them taters with what ya got!",
    experience: 240,
    building: "Kitchen",
    cookingSeconds: 10 * 60,

    ingredients: {
      "Wild Mushroom": new Decimal(10),
      Potato: new Decimal(5),
    },
    marketRate: 240,
  },
  "Mushroom Soup": {
    name: "Mushroom Soup",
    description: "Warm your Bumpkin's soul.",
    experience: 56,
    building: "Fire Pit",
    cookingSeconds: 10 * 60,

    ingredients: {
      "Wild Mushroom": new Decimal(5),
    },
    marketRate: 240,
  },
  "Orange Cake": {
    name: "Orange Cake",
    description: "Orange you glad we aren't cooking apples",
    experience: 730,
    building: "Bakery",
    cookingSeconds: 240 * 60,
    ingredients: {
      Orange: new Decimal(5),
      Egg: new Decimal(15),
      Wheat: new Decimal(10),
    },
    marketRate: 600,
  },
  "Sunflower Crunch": {
    name: "Sunflower Crunch",
    description: "Crunchy goodness. Try not to burn it.",
    experience: 50,
    building: "Kitchen",
    cookingSeconds: 10 * 60,
    ingredients: {
      Sunflower: new Decimal(300),
    },
    marketRate: 40,
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description: "No more boring Cabbage!",
    experience: 500,
    building: "Deli",
    cookingSeconds: 24 * 60 * 60,

    ingredients: {
      Cabbage: new Decimal(20),
    },
    marketRate: 224,
  },
  "Reindeer Carrot": {
    name: "Reindeer Carrot",
    description: "Rudolph can't stop eating them!",
    experience: 10,
    building: "Fire Pit",
    cookingSeconds: 60 * 5,

    ingredients: {
      Carrot: new Decimal(5),
    },
    marketRate: 0,
  },

  "Apple Juice": {
    name: "Apple Juice",
    description: "A crisp refreshing beverage",
    experience: 500,
    building: "Smoothie Shack",
    cookingSeconds: 60 * 60,

    ingredients: {
      Apple: new Decimal(5),
    },
    marketRate: 336,
  },

  "Orange Juice": {
    name: "Orange Juice",
    description: "OJ matches perfectly with a Club Sandwich",
    experience: 375,
    building: "Smoothie Shack",
    cookingSeconds: 60 * 45,

    ingredients: {
      Orange: new Decimal(5),
    },
    marketRate: 256,
  },

  "Purple Smoothie": {
    name: "Purple Smoothie",
    description: "You can hardly taste the Cabbage",
    experience: 310,
    building: "Smoothie Shack",
    cookingSeconds: 60 * 30,

    ingredients: {
      Blueberry: new Decimal(5),
      Cabbage: new Decimal(10),
    },
    marketRate: 200,
  },

  "Power Smoothie": {
    name: "Power Smoothie",
    description: "Official drink of the Bumpkin Powerlifting Society",
    experience: 775,
    building: "Smoothie Shack",
    cookingSeconds: 60 * 60 * 1.5,

    ingredients: {
      Blueberry: new Decimal(10),
      Kale: new Decimal(5),
    },
    marketRate: 496,
  },

  "Bumpkin Detox": {
    name: "Bumpkin Detox",
    description: "Wash away the sins of last night",
    experience: 975,
    building: "Smoothie Shack",
    cookingSeconds: 60 * 60 * 2,
    ingredients: {
      Apple: new Decimal(5),
      Orange: new Decimal(5),
      Carrot: new Decimal(10),
    },
    marketRate: 640,
  },
};

export const CONSUMABLES: Record<ConsumableName, Consumable> = {
  ...COOKABLES,
  "Pirate Cake": {
    name: "Pirate Cake",
    description: "Great for Pirate themed birthday parties.",
    experience: 1500,
  },
};

const Juices = getKeys(COOKABLES).filter(
  (name) => COOKABLES[name].building === "Smoothie Shack"
);

export function isJuice(item: any) {
  return Juices.includes(item);
}
