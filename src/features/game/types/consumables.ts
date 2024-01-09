import Decimal from "decimal.js-light";
import { BuildingName } from "./buildings";
import { Cake, getKeys } from "./craftables";
import { Inventory } from "./game";
import { FishName } from "./fishing";
import { translate } from "lib/i18n/translate";

type JuiceName =
  | "Apple Juice"
  | "Orange Juice"
  | "Purple Smoothie"
  | "Power Smoothie"
  | "Bumpkin Detox"
  | "Banana Blast";

type FishCookableName = "Chowder" | "Gumbo" | "Fermented Fish";

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
  | "Popcorn"
  | FishCookableName;

export type ConsumableName = CookableName | "Pirate Cake" | FishName;

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
    description: translate("description.sunflower.cake"),
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
    description: translate("description.potato.cake"),
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
    description: translate("description.pumpkin.cake"),
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
    description: translate("description.carrot.cake"),
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
    description: translate("description.cabbage.cake"),
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
    description: translate("description.beetroot.cake"),
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
    description: translate("description.cauliflower.cake"),
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
    description: translate("description.parsnip.cake"),
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
    description: translate("description.radish.cake"),
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
    description: translate("description.wheat.cake"),
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
    description: translate("description.eggplant.cake"),
    building: "Bakery",
    experience: 1400,
    cookingSeconds: 60 * 60 * 24,
    ingredients: {
      Eggplant: new Decimal(30),
      Wheat: new Decimal(10),
      Egg: new Decimal(15),
    },
    marketRate: 1200,
  },
  "Orange Cake": {
    name: "Orange Cake",
    description: translate("description.orange.cake"),
    building: "Bakery",
    cookingSeconds: 240 * 60,
    experience: 730,
    ingredients: {
      Orange: new Decimal(5),
      Egg: new Decimal(15),
      Wheat: new Decimal(10),
    },
    marketRate: 600,
  },
  "Honey Cake": {
    name: "Honey Cake",
    description: "A scrumptious cake!",
    building: "Bakery",
    cookingSeconds: 60 * 240,
    experience: 760,
    ingredients: {
      Honey: new Decimal(10),
      Wheat: new Decimal(10),
      Egg: new Decimal(10),
    },
    marketRate: 550,
    disabled: true,
  },
};

export const FISH_COOKABLES: Record<FishCookableName, Cookable> = {
  Chowder: {
    name: "Chowder",
    description: translate("description.chowder"),
    building: "Kitchen",
    experience: 1000,
    cookingSeconds: 60 * 60 * 8,
    ingredients: {
      Beetroot: new Decimal(10),
      Wheat: new Decimal(10),
      Parsnip: new Decimal(5),
      Anchovy: new Decimal(3),
    },
    marketRate: 0,
  },
  Gumbo: {
    name: "Gumbo",
    description: translate("description.gumbo"),
    building: "Fire Pit",
    experience: 600,
    cookingSeconds: 60 * 60 * 4,
    ingredients: {
      Potato: new Decimal(50),
      Pumpkin: new Decimal(30),
      Carrot: new Decimal(20),
      "Red Snapper": new Decimal(3),
    },
    marketRate: 0,
  },
  "Fermented Fish": {
    name: "Fermented Fish",
    description: translate("description.fermented.fish"),
    building: "Deli",
    experience: 3000,
    cookingSeconds: 60 * 60 * 24,
    ingredients: {
      Tuna: new Decimal(6),
    },
    marketRate: 0,
  },
};

export const COOKABLES: Record<CookableName, Cookable> = {
  "Mashed Potato": {
    name: "Mashed Potato",
    description: translate("description.mashed.potato"),
    building: "Fire Pit",
    experience: 3,
    cookingSeconds: 30,
    ingredients: {
      Potato: new Decimal(8),
    },
    marketRate: 10,
  },
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: translate("description.pumpkin.soup"),
    building: "Fire Pit",
    experience: 24,
    cookingSeconds: 60 * 3,
    ingredients: {
      Pumpkin: new Decimal(10),
    },
    marketRate: 16,
  },

  "Bumpkin Broth": {
    name: "Bumpkin Broth",
    description: translate("description.bumpkin.broth"),
    building: "Fire Pit",
    experience: 96,
    cookingSeconds: 60 * 20,
    ingredients: {
      Carrot: new Decimal(10),
      Cabbage: new Decimal(5),
    },
    marketRate: 64,
  },

  "Boiled Eggs": {
    name: "Boiled Eggs",
    description: translate("description.boiled.eggs"),
    building: "Fire Pit",
    experience: 90,
    cookingSeconds: 60 * 60,
    ingredients: {
      Egg: new Decimal(5),
    },
    marketRate: 160,
  },

  "Kale Stew": {
    name: "Kale Stew",
    description: translate("description.kale.stew"),
    building: "Fire Pit",
    experience: 400,
    cookingSeconds: 60 * 60 * 2,
    ingredients: {
      Kale: new Decimal(10),
    },
    marketRate: 400,
  },

  "Roast Veggies": {
    name: "Roast Veggies",
    description: translate("description.roast.veggies"),
    building: "Kitchen",
    experience: 170,
    cookingSeconds: 60 * 60 * 2,
    ingredients: {
      Cauliflower: new Decimal(15),
      Carrot: new Decimal(10),
    },
    marketRate: 240,
  },

  "Bumpkin Salad": {
    name: "Bumpkin Salad",
    description: translate("description.bumpkin.salad"),
    building: "Kitchen",
    experience: 290,
    cookingSeconds: 60 * 60 * 3.5,
    ingredients: {
      Beetroot: new Decimal(20),
      Parsnip: new Decimal(10),
    },
    marketRate: 400,
  },

  "Goblin's Treat": {
    name: "Goblin's Treat",
    description: translate("description.goblins.treat"),
    building: "Kitchen",
    experience: 500,
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
    description: translate("description.cauliflower.burger"),
    building: "Kitchen",
    experience: 255,
    cookingSeconds: 60 * 60 * 3,
    ingredients: {
      Cauliflower: new Decimal(15),
      Wheat: new Decimal(5),
    },
    marketRate: 304,
  },

  Pancakes: {
    name: "Pancakes",
    description: translate("description.pancakes"),
    building: "Kitchen",
    experience: 480,
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
    description: translate("description.club.sandwich"),
    building: "Kitchen",
    experience: 170,
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
    description: translate("description.apple.pie"),
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
    description: translate("description.blueberry.jam"),
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
    description: translate("description.fermented.carrots"),
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
    description: translate("description.kale.mushroom.pie"),
    building: "Bakery",
    experience: 720,
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
    description: translate("description.mushroom.jacket.potatoes"),
    building: "Kitchen",
    experience: 240,
    cookingSeconds: 10 * 60,
    ingredients: {
      "Wild Mushroom": new Decimal(10),
      Potato: new Decimal(5),
    },
    marketRate: 240,
  },
  "Mushroom Soup": {
    name: "Mushroom Soup",
    description: translate("description.mushroom.soup"),
    building: "Fire Pit",
    experience: 56,
    cookingSeconds: 10 * 60,
    ingredients: {
      "Wild Mushroom": new Decimal(5),
    },
    marketRate: 240,
  },
  "Sunflower Crunch": {
    name: "Sunflower Crunch",
    description: translate("description.sunflower.crunch"),
    building: "Kitchen",
    experience: 50,
    cookingSeconds: 10 * 60,
    ingredients: {
      Sunflower: new Decimal(300),
    },
    marketRate: 40,
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description: translate("description.sauerkraut"),
    building: "Deli",
    experience: 500,
    cookingSeconds: 24 * 60 * 60,
    ingredients: {
      Cabbage: new Decimal(20),
    },
    marketRate: 224,
  },
  "Reindeer Carrot": {
    name: "Reindeer Carrot",
    description: translate("description.reindeer.carrot"),
    building: "Fire Pit",
    experience: 10,
    cookingSeconds: 60 * 5,
    ingredients: {
      Carrot: new Decimal(5),
    },
    marketRate: 0,
  },

  "Apple Juice": {
    name: "Apple Juice",
    description: translate("description.apple.juice"),
    building: "Smoothie Shack",
    experience: 500,
    cookingSeconds: 60 * 60,
    ingredients: {
      Apple: new Decimal(5),
    },
    marketRate: 336,
  },

  "Orange Juice": {
    name: "Orange Juice",
    description: translate("description.orange.juice"),
    building: "Smoothie Shack",
    experience: 375,
    cookingSeconds: 60 * 45,
    ingredients: {
      Orange: new Decimal(5),
    },
    marketRate: 256,
  },

  "Purple Smoothie": {
    name: "Purple Smoothie",
    description: translate("description.purple.smoothie"),
    building: "Smoothie Shack",
    experience: 310,
    cookingSeconds: 60 * 30,
    ingredients: {
      Blueberry: new Decimal(5),
      Cabbage: new Decimal(10),
    },
    marketRate: 200,
  },

  "Power Smoothie": {
    name: "Power Smoothie",
    description: translate("description.power.smoothie"),
    building: "Smoothie Shack",
    experience: 775,
    cookingSeconds: 60 * 60 * 1.5,
    ingredients: {
      Blueberry: new Decimal(10),
      Kale: new Decimal(5),
    },
    marketRate: 496,
  },

  "Bumpkin Detox": {
    name: "Bumpkin Detox",
    description: translate("description.bumpkin.detox"),
    building: "Smoothie Shack",
    experience: 975,
    cookingSeconds: 60 * 60 * 2,
    ingredients: {
      Apple: new Decimal(5),
      Orange: new Decimal(5),
      Carrot: new Decimal(10),
    },
    marketRate: 640,
  },

  "Bumpkin Roast": {
    name: "Bumpkin Roast",
    description: translate("description.bumpkin.roast"),
    building: "Kitchen",
    experience: 2500,
    cookingSeconds: 60 * 60 * 12,
    ingredients: {
      "Mashed Potato": new Decimal(20),
      "Roast Veggies": new Decimal(5),
    },
    marketRate: 1100,
  },
  "Goblin Brunch": {
    name: "Goblin Brunch",
    description: translate("description.goblin.brunch"),
    building: "Kitchen",
    experience: 2500,
    cookingSeconds: 60 * 60 * 12,
    ingredients: {
      "Boiled Eggs": new Decimal(5),
      "Goblin's Treat": new Decimal(1),
    },
    marketRate: 1100,
  },
  "Fruit Salad": {
    name: "Fruit Salad",
    description: translate("description.fruit.salad"),
    building: "Kitchen",
    experience: 225,
    cookingSeconds: 60 * 30,
    ingredients: {
      Apple: new Decimal(1),
      Orange: new Decimal(1),
      Blueberry: new Decimal(1),
    },
    marketRate: 200,
  },
  "Kale Omelette": {
    name: "Kale Omelette",
    description: translate("description.kale.omelette"),
    building: "Fire Pit",
    experience: 1250,
    cookingSeconds: 60 * 60 * 3.5,
    ingredients: {
      Egg: new Decimal(20),
      Kale: new Decimal(5),
    },
    marketRate: 640,
  },
  "Cabbers n Mash": {
    name: "Cabbers n Mash",
    description: translate("description.cabbers.mash"),
    building: "Fire Pit",
    experience: 250,
    cookingSeconds: 60 * 40,
    ingredients: {
      "Mashed Potato": new Decimal(10),
      Cabbage: new Decimal(20),
    },
    marketRate: 160,
  },
  "Fancy Fries": {
    name: "Fancy Fries",
    description: translate("description.fancy.fries"),
    building: "Deli",
    experience: 1000,
    cookingSeconds: 60 * 60 * 24,
    ingredients: {
      Sunflower: new Decimal(500),
      Potato: new Decimal(500),
    },
    marketRate: 400,
  },
  "Bumpkin ganoush": {
    name: "Bumpkin ganoush",
    description: translate("description.bumpkin.ganoush"),
    building: "Kitchen",
    experience: 1000,
    cookingSeconds: 60 * 60 * 5,
    ingredients: {
      Eggplant: new Decimal(30),
      Potato: new Decimal(50),
      Parsnip: new Decimal(10),
    },
    marketRate: 800,
  },
  Cornbread: {
    name: "Cornbread",
    description: translate("description.cornbread"),
    building: "Bakery",
    experience: 600,
    cookingSeconds: 60 * 60 * 12,
    ingredients: {
      Corn: new Decimal(15),
      Wheat: new Decimal(5),
      Egg: new Decimal(5),
    },
    marketRate: 1200,
  },
  Popcorn: {
    name: "Popcorn",
    description: translate("description.popcorn"),
    building: "Fire Pit",
    experience: 200,
    cookingSeconds: 12 * 60,
    ingredients: {
      Sunflower: new Decimal(100),
      Corn: new Decimal(5),
    },
    marketRate: 120,
  },
  "Banana Blast": {
    name: "Banana Blast",
    description: translate("description.banana.blast"),
    building: "Smoothie Shack",
    experience: 1200,
    cookingSeconds: 60 * 60 * 3,
    ingredients: {
      Banana: new Decimal(10),
      Egg: new Decimal(5),
    },
    marketRate: 560,
  },
  ...COOKABLE_CAKES,
  ...FISH_COOKABLES,
};

export const PIRATE_CAKE: Record<"Pirate Cake", Consumable> = {
  "Pirate Cake": {
    name: "Pirate Cake",
    description: translate("description.pirate.cake"),
    experience: 3000,
  },
};

const FISH: Record<FishName, Consumable> = {
  Anchovy: {
    name: "Anchovy",
    description: translate("description.anchovy.two"),
    experience: 60,
  },
  Butterflyfish: {
    name: "Butterflyfish",
    description: translate("description.butterflyfish.two"),
    experience: 70,
  },
  Blowfish: {
    name: "Blowfish",
    description: translate("description.blowfish.two"),
    experience: 80,
  },
  Clownfish: {
    name: "Clownfish",
    description: translate("description.clownfish.two"),
    experience: 90,
  },
  "Sea Bass": {
    name: "Sea Bass",
    description: translate("description.seabass.two"),
    experience: 100,
  },
  "Sea Horse": {
    name: "Sea Horse",
    description: translate("description.seahorse.two"),
    experience: 110,
  },
  "Horse Mackerel": {
    name: "Horse Mackerel",
    description: translate("description.horsemackerel.two"),
    experience: 120,
  },
  Squid: {
    name: "Squid",
    description: translate("description.squid.two"),
    experience: 130,
  },
  "Red Snapper": {
    name: "Red Snapper",
    description: translate("description.redsnapper.two"),
    experience: 140,
  },
  "Moray Eel": {
    name: "Moray Eel",
    description: translate("description.morayeel.two"),
    experience: 150,
  },
  "Olive Flounder": {
    name: "Olive Flounder",
    description: translate("description.oliveflounder.two"),
    experience: 160,
  },
  Napoleanfish: {
    name: "Napoleanfish",
    description: translate("description.napoleanfish.two"),
    experience: 170,
  },
  Surgeonfish: {
    name: "Surgeonfish",
    description: translate("description.surgeonfish.two"),
    experience: 180,
  },
  "Zebra Turkeyfish": {
    name: "Zebra Turkeyfish",
    description: translate("description.zebraturkeyfish.two"),
    experience: 190,
  },
  Ray: {
    name: "Ray",
    description: translate("description.ray.two"),
    experience: 200,
  },
  "Hammerhead shark": {
    name: "Hammerhead shark",
    description: translate("description.hammerheadshark.two"),
    experience: 210,
  },
  "Barred Knifejaw": {
    name: "Barred Knifejaw",
    description: translate("description.barredknifejaw.two"),
    experience: 220,
  },
  Tuna: {
    name: "Tuna",
    description: translate("description.tuna.two"),
    experience: 230,
  },
  "Mahi Mahi": {
    name: "Mahi Mahi",
    description: translate("description.mahimahi.two"),
    experience: 240,
  },
  "Blue Marlin": {
    name: "Blue Marlin",
    description: translate("description.bluemarlin.two"),
    experience: 250,
  },
  Oarfish: {
    name: "Oarfish",
    description: translate("description.oarfish.two"),
    experience: 300,
  },
  "Football fish": {
    name: "Football fish",
    description: translate("description.footballfish.two"),
    experience: 350,
  },
  Sunfish: {
    name: "Sunfish",
    description: translate("description.sunfish.two"),
    experience: 400,
  },
  Coelacanth: {
    name: "Coelacanth",
    description: translate("description.coelacanth.two"),
    experience: 700,
  },
  "Whale Shark": {
    name: "Whale Shark",
    description: translate("description.whaleshark.two"),
    experience: 750,
  },
  "Saw Shark": {
    name: "Saw Shark",
    description: translate("description.sawshark.two"),
    experience: 800,
  },
  "White Shark": {
    name: "White Shark",
    description: translate("description.whiteshark.two"),
    experience: 1000,
  },
  Angelfish: {
    description: "?",
    experience: 100,
    name: "Angelfish",
  },
  Halibut: {
    description: "?",
    experience: 100,
    name: "Halibut",
  },
  Parrotfish: {
    description: "?",
    experience: 100,
    name: "Parrotfish",
  },
};

export const CONSUMABLES: Record<ConsumableName, Consumable> = {
  ...COOKABLES,
  ...FISH,
  ...PIRATE_CAKE,
};

export const FISH_CONSUMABLES: Record<FishName | FishCookableName, Consumable> =
  {
    ...FISH_COOKABLES,
    ...FISH,
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
