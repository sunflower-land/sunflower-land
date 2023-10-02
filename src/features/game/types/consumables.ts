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
  | JuiceName
  | "Bumpkin Roast"
  | "Goblin Brunch"
  | "Fruit Salad"
  | "Kale Omelette"
  | "Cabbers n Mash"
  | "Fancy Fries"
  | "Bumpkin ganoush"
  | "Eggplant Cake"
  | "Cornbread"
  | "Popcorn";

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

type CakeName = Cake | "Orange Cake" | "Eggplant Cake" | "Honey Cake";

export const COOKABLE_CAKES: Record<CakeName, Cookable> = {
  "Sunflower Cake": {
    name: "Sunflower Cake",
    description: "Sunflower Cake",
    building: "Bakery",
    experience: 525,
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
    building: "Bakery",
    experience: 650,
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
    building: "Bakery",
    experience: 625,
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
    building: "Bakery",
    experience: 750,
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
    building: "Bakery",
    experience: 860,
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
    building: "Bakery",
    experience: 1250,
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
    building: "Bakery",
    experience: 1190,
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
    building: "Bakery",
    experience: 1300,
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
    building: "Bakery",
    experience: 1200,
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
    building: "Bakery",
    experience: 1100,
    cookingSeconds: 60 * 60 * 24,
    ingredients: {
      Wheat: new Decimal(35),
      Egg: new Decimal(15),
    },
    marketRate: 800,
  },
  "Eggplant Cake": {
    name: "Eggplant Cake",
    description: "Sweet farm-fresh dessert surprise.",
    building: "Bakery",
    cookingSeconds: 60 * 60 * 24,
    experience: 1400,
    ingredients: {
      Eggplant: new Decimal(30),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 1200,
  },
  "Orange Cake": {
    name: "Orange Cake",
    description: "Orange you glad we aren't cooking apples",
    building: "Bakery",
    cookingSeconds: 240 * 60,
    ingredients: {
      Orange: new Decimal(5),
      Egg: new Decimal(15),
      Wheat: new Decimal(10),
    },
    experience: 730,
    marketRate: 600,
  },
  "Honey Cake": {
    name: "Honey Cake",
    description: "A scrumptious cake!",
    building: "Bakery",
    experience: 760,
    cookingSeconds: 60 * 240,
    ingredients: {
      Honey: new Decimal(10),
      Wheat: new Decimal(10),
      Egg: new Decimal(10),
    },
    marketRate: 550,
    disabled: true,
  },
};

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
    description: "A perfect Bumpkin Booster!",
    building: "Fire Pit",
    cookingSeconds: 60 * 60 * 2,
    ingredients: {
      Kale: new Decimal(10),
    },
    experience: 400,
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
    description: "A great start to a Bumpkins day.",
    experience: 480,
    building: "Kitchen",
    cookingSeconds: 60 * 20,
    ingredients: {
      Wheat: new Decimal(5),
      Honey: new Decimal(10),
    },
    marketRate: 10,
    disabled: true,
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

  "Apple Pie": {
    name: "Apple Pie",
    description: "Bumpkin Betty's famous recipe",
    building: "Bakery",
    experience: 720,
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
    building: "Deli",
    experience: 500,
    cookingSeconds: 60 * 60 * 12,
    ingredients: {
      Blueberry: new Decimal(5),
    },
    marketRate: 350,
  },
  "Fermented Carrots": {
    name: "Fermented Carrots",
    description: "Got a surplus of carrots?",
    building: "Deli",
    experience: 250,
    cookingSeconds: 60 * 24 * 60,
    ingredients: {
      Carrot: new Decimal(20),
    },
    marketRate: 112,
  },
  "Kale & Mushroom Pie": {
    name: "Kale & Mushroom Pie",
    description: "A traditional Sapphiron recipe",
    building: "Bakery",
    cookingSeconds: 60 * 240,
    experience: 720,
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
    building: "Kitchen",
    cookingSeconds: 10 * 60,
    experience: 240,
    ingredients: {
      "Wild Mushroom": new Decimal(10),
      Potato: new Decimal(5),
    },
    marketRate: 240,
  },
  "Mushroom Soup": {
    name: "Mushroom Soup",
    description: "Warm your Bumpkin's soul.",
    building: "Fire Pit",
    cookingSeconds: 10 * 60,
    experience: 56,
    ingredients: {
      "Wild Mushroom": new Decimal(5),
    },
    marketRate: 240,
  },
  "Sunflower Crunch": {
    name: "Sunflower Crunch",
    description: "Crunchy goodness. Try not to burn it.",
    building: "Kitchen",
    cookingSeconds: 10 * 60,
    experience: 50,
    ingredients: {
      Sunflower: new Decimal(300),
    },
    marketRate: 40,
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description: "No more boring Cabbage!",
    building: "Deli",
    cookingSeconds: 24 * 60 * 60,
    experience: 500,
    ingredients: {
      Cabbage: new Decimal(20),
    },
    marketRate: 224,
  },
  "Reindeer Carrot": {
    name: "Reindeer Carrot",
    description: "Rudolph can't stop eating them!",
    building: "Fire Pit",
    cookingSeconds: 60 * 5,
    experience: 10,
    ingredients: {
      Carrot: new Decimal(5),
    },
    marketRate: 0,
  },

  "Apple Juice": {
    name: "Apple Juice",
    description: "A crisp refreshing beverage",
    building: "Smoothie Shack",
    cookingSeconds: 60 * 60,
    experience: 500,
    ingredients: {
      Apple: new Decimal(5),
    },
    marketRate: 336,
  },

  "Orange Juice": {
    name: "Orange Juice",
    description: "OJ matches perfectly with a Club Sandwich",
    building: "Smoothie Shack",
    cookingSeconds: 60 * 45,
    experience: 375,
    ingredients: {
      Orange: new Decimal(5),
    },
    marketRate: 256,
  },

  "Purple Smoothie": {
    name: "Purple Smoothie",
    description: "You can hardly taste the Cabbage",
    building: "Smoothie Shack",
    cookingSeconds: 60 * 30,
    experience: 310,
    ingredients: {
      Blueberry: new Decimal(5),
      Cabbage: new Decimal(10),
    },
    marketRate: 200,
  },

  "Power Smoothie": {
    name: "Power Smoothie",
    description: "Official drink of the Bumpkin Powerlifting Society",
    building: "Smoothie Shack",
    cookingSeconds: 60 * 60 * 1.5,
    experience: 775,
    ingredients: {
      Blueberry: new Decimal(10),
      Kale: new Decimal(5),
    },
    marketRate: 496,
  },

  "Bumpkin Detox": {
    name: "Bumpkin Detox",
    description: "Wash away the sins of last night",
    building: "Smoothie Shack",
    cookingSeconds: 60 * 60 * 2,
    experience: 975,
    ingredients: {
      Apple: new Decimal(5),
      Orange: new Decimal(5),
      Carrot: new Decimal(10),
    },
    marketRate: 640,
  },

  "Bumpkin Roast": {
    name: "Bumpkin Roast",
    description: "A traditional Bumpkin dish",
    building: "Kitchen",
    cookingSeconds: 60 * 60 * 12,
    experience: 2500,
    ingredients: {
      "Mashed Potato": new Decimal(20),
      "Roast Veggies": new Decimal(5),
    },
    marketRate: 1100,
  },
  "Goblin Brunch": {
    name: "Goblin Brunch",
    description: "A traditional Goblin dish",
    building: "Kitchen",
    cookingSeconds: 60 * 60 * 12,
    experience: 2500,
    ingredients: {
      "Boiled Eggs": new Decimal(5),
      "Goblin's Treat": new Decimal(1),
    },
    marketRate: 1100,
  },
  "Fruit Salad": {
    name: "Fruit Salad",
    description: "Fruit Salad, Yummy Yummy",
    building: "Kitchen",
    cookingSeconds: 60 * 30,
    experience: 225,
    ingredients: {
      Apple: new Decimal(1),
      Orange: new Decimal(1),
      Blueberry: new Decimal(1),
    },
    marketRate: 200,
  },
  "Kale Omelette": {
    name: "Kale Omelette",
    description: "A healthy breakfast",
    building: "Fire Pit",
    cookingSeconds: 60 * 60 * 3.5,
    experience: 1250,
    ingredients: {
      Egg: new Decimal(20),
      Kale: new Decimal(5),
    },
    marketRate: 640,
  },
  "Cabbers n Mash": {
    name: "Cabbers n Mash",
    description: "Cabbages and Mashed Potatoes",
    building: "Fire Pit",
    cookingSeconds: 60 * 40,
    experience: 250,
    ingredients: {
      "Mashed Potato": new Decimal(10),
      Cabbage: new Decimal(20),
    },
    marketRate: 160,
  },
  "Fancy Fries": {
    name: "Fancy Fries",
    description: "Fantastic Fries",
    building: "Deli",
    cookingSeconds: 60 * 60 * 24,
    experience: 1000,
    ingredients: {
      Sunflower: new Decimal(500),
      Potato: new Decimal(500),
    },
    marketRate: 400,
  },
  "Bumpkin ganoush": {
    name: "Bumpkin ganoush",
    description: "Zesty roasted eggplant spread.",
    building: "Kitchen",
    cookingSeconds: 60 * 60 * 5,
    experience: 1000,
    ingredients: {
      Eggplant: new Decimal(30),
      Potato: new Decimal(50),
      Parsnip: new Decimal(10),
    },
    marketRate: 800,
  },
  Cornbread: {
    name: "Cornbread",
    description: "Hearty golden farm-fresh bread.",
    building: "Bakery",
    cookingSeconds: 60 * 60 * 12,
    experience: 600,
    ingredients: {
      Corn: new Decimal(15),
      Wheat: new Decimal(5),
      Egg: new Decimal(5),
    },
    marketRate: 1200,
  },
  Popcorn: {
    name: "Popcorn",
    description: "Classic homegrown crunchy snack",
    building: "Fire Pit",
    cookingSeconds: 12 * 60,
    experience: 200,
    ingredients: {
      Sunflower: new Decimal(100),
      Corn: new Decimal(5),
    },
    marketRate: 120,
  },
  ...COOKABLE_CAKES,
};

export const CONSUMABLES: Record<ConsumableName, Consumable> = {
  ...COOKABLES,
  "Pirate Cake": {
    name: "Pirate Cake",
    description: "Great for Pirate themed birthday parties.",
    experience: 3000,
  },
};

const Juices = getKeys(COOKABLES).filter(
  (name) => COOKABLES[name].building === "Smoothie Shack"
);

export function isJuice(item: any) {
  return Juices.includes(item);
}

export function isCookable(consumeable: Consumable): consumeable is Cookable {
  return consumeable.name in COOKABLES;
}
