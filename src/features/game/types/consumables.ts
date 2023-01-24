import Decimal from "decimal.js-light";

import mashedPotato from "assets/food/mashed_potato.png";
import pumpkinSoup from "assets/food/pumpkin_soup.png";
import bumpkinBroth from "assets/food/bumpkin_broth.png";
import boiledEgg from "assets/food/boiled_eggs.png";
import goblinsTreat from "assets/food/goblins_treat.png";
import cauliflowerBurger from "assets/food/cauliflower_burger.png";
import pancakes from "assets/food/pancakes.png";
import roastVeggies from "assets/food/roast_veggies.png";
import clubSandwich from "assets/food/club_sandwich.png";
import bumpkinSalad from "assets/food/bumpkin_salad.png";
import blueberryJam from "assets/food/blueberry_jam.png";
import honeyCake from "assets/food/honey_cake.png";
import kaleStew from "assets/food/kale_stew.png";
import mushroomSoup from "assets/food/mushroom_soup.png";
import orangeCake from "assets/food/orange_cake.png";
import sunflowerCrunch from "assets/food/sunflower_crunch.png";
import applePie from "assets/food/apple_pie.png";
import mushroomJacketPotato from "assets/food/mushroom_jacket_potato.png";
import kaleMushroomPie from "assets/food/mushroom_kale_pie.png";
import reindeerCarrot from "assets/food/reindeer_carrot.png";
import fermentedCarrots from "assets/food/fermented_carrots.png";
import sauerkraut from "assets/food/sauerkraut.png";
import carrotCake from "src/assets/sfts/cakes/carrot_cake.png";
import radishCake from "src/assets/sfts/cakes/radish_cake.png";
import beetrootCake from "src/assets/sfts/cakes/beetroot_cake.png";
import cabbageCake from "src/assets/sfts/cakes/cabbage_cake.png";
import cauliflowerCake from "src/assets/sfts/cakes/cauliflower_cake.png";
import parsnipCake from "src/assets/sfts/cakes/parsnip_cake.png";
import potatoCake from "src/assets/sfts/cakes/potato_cake.png";
import pumpkinCake from "src/assets/sfts/cakes/pumpkin_cake.png";
import sunflowerCake from "src/assets/sfts/cakes/sunflower_cake.png";
import wheatCake from "src/assets/sfts/cakes/wheat_cake.png";
import appleJuice from "assets/food/apple_juice.png";
import orangeJuice from "assets/food/orange_juice.png";
import purpleSmoothie from "assets/food/purple_smoothie.png";
import bumpkinDetox from "assets/food/bumpkin_detox.png";
import powerSmoothie from "assets/food/power_smoothie.png";

import { BuildingName } from "./buildings";
import { Inventory } from "./game";
import { ItemDetails } from "./items";

export interface Consumable extends ItemDetails {
  name: ConsumableName;
  building: BuildingName;
  experience: number;
  cookingSeconds: number;
  ingredients: Inventory;
  marketRate: number;
  disabled?: boolean;
}

type CakeName =
  | "Sunflower Cake"
  | "Potato Cake"
  | "Pumpkin Cake"
  | "Carrot Cake"
  | "Cabbage Cake"
  | "Beetroot Cake"
  | "Cauliflower Cake"
  | "Parsnip Cake"
  | "Radish Cake"
  | "Wheat Cake";

type JuiceName =
  | "Apple Juice"
  | "Orange Juice"
  | "Purple Smoothie"
  | "Power Smoothie"
  | "Bumpkin Detox";

export type ConsumableName =
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
  | CakeName
  | JuiceName;

export const CAKES: Record<CakeName, Consumable> = {
  "Sunflower Cake": {
    name: "Sunflower Cake",
    description: "Sunflower Cake",
    image: sunflowerCake,
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
    image: potatoCake,
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
    image: pumpkinCake,
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
    image: carrotCake,
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
    image: cabbageCake,
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
    image: beetrootCake,
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
    image: cauliflowerCake,
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
    image: parsnipCake,
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
    image: radishCake,
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
    image: wheatCake,
    building: "Bakery",
    experience: 1100,
    cookingSeconds: 60 * 60 * 24,
    ingredients: {
      Wheat: new Decimal(35),
      Egg: new Decimal(15),
    },
    marketRate: 800,
  },
};

export const JUICES: Record<JuiceName, Consumable> = {
  "Apple Juice": {
    name: "Apple Juice",
    description: "A crisp refreshing beverage",
    image: appleJuice,
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
    image: orangeJuice,
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
    image: purpleSmoothie,
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
    image: powerSmoothie,
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
    image: bumpkinDetox,
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
};

export const CONSUMABLES: Record<ConsumableName, Consumable> = {
  "Mashed Potato": {
    name: "Mashed Potato",
    description: "My life is potato.",
    image: mashedPotato,
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
    image: pumpkinSoup,
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
    image: bumpkinBroth,
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
    image: boiledEgg,
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
    image: kaleStew,
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
    image: roastVeggies,
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
    image: bumpkinSalad,
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
    image: goblinsTreat,
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
    image: cauliflowerBurger,
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
    image: pancakes,
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
    image: clubSandwich,
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
    image: applePie,
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
    image: blueberryJam,
    building: "Deli",
    experience: 380,
    cookingSeconds: 60 * 24 * 60,
    ingredients: {
      Blueberry: new Decimal(5),
    },
    marketRate: 550,
  },
  "Fermented Carrots": {
    name: "Fermented Carrots",
    description: "Got a surplus of carrots?",
    image: fermentedCarrots,
    building: "Deli",
    experience: 250,
    cookingSeconds: 60 * 24 * 60,
    ingredients: {
      Carrot: new Decimal(20),
    },
    marketRate: 112,
  },
  "Honey Cake": {
    name: "Honey Cake",
    description: "A scrumptious cake!",
    image: honeyCake,
    building: "Bakery",
    experience: 760,
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
    image: kaleMushroomPie,
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
    image: mushroomJacketPotato,
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
    image: mushroomSoup,
    building: "Fire Pit",
    cookingSeconds: 10 * 60,
    experience: 56,
    ingredients: {
      "Wild Mushroom": new Decimal(5),
    },
    marketRate: 240,
  },
  "Orange Cake": {
    name: "Orange Cake",
    description: "Orange you glad we aren't cooking apples",
    image: orangeCake,
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
  "Sunflower Crunch": {
    name: "Sunflower Crunch",
    description: "Crunchy goodness. Try not to burn it.",
    image: sunflowerCrunch,
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
    image: sauerkraut,
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
    image: reindeerCarrot,
    building: "Fire Pit",
    cookingSeconds: 60 * 5,
    experience: 10,
    ingredients: {
      Carrot: new Decimal(5),
    },
    marketRate: 0,
  },
  ...CAKES,
  ...JUICES,
};
