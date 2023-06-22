import { Potion } from "./types";

import orangeBottle from "assets/decorations/orange_bottle.webp";
import blueBottle from "assets/decorations/blue_bottle.webp";
import pinkBottle from "assets/decorations/pink_bottle.webp";
import aquaBottle from "assets/decorations/aqua_bottle.webp";
import greenBottle from "assets/decorations/green_bottle.webp";
import mustardBottle from "assets/decorations/mustard_bottle.webp";
import whiteBottle from "assets/decorations/white_bottle.webp";
import Decimal from "decimal.js-light";
import { PotionName } from "features/game/types/game";

export const POTIONS: Record<PotionName, Potion> = {
  "Bloom Boost": {
    name: "Bloom Boost",
    ingredients: {
      Pumpkin: new Decimal(10),
      Cabbage: new Decimal(10),
    },
    image: orangeBottle,
    description: "Ignite your plants with vibrant blooms!",
  },
  "Dream Drip": {
    name: "Dream Drip",
    ingredients: {
      Egg: new Decimal(10),
      Kale: new Decimal(10),
      Stone: new Decimal(10),
    },
    image: mustardBottle,
    description: "Drizzle your plants with magical dreams and fantasies.",
  },
  "Earth Essence": {
    name: "Earth Essence",
    ingredients: {
      Potato: new Decimal(10),
      Stone: new Decimal(10),
    },
    image: pinkBottle,
    description: "Harness the power of the earth to nurture your plants.",
  },
  "Flower Power": {
    name: "Flower Power",
    ingredients: {
      Sunflower: new Decimal(10),
      Iron: new Decimal(10),
    },
    image: aquaBottle,
    description: "Unleash a burst of floral energy upon your plants.",
  },
  "Golden Syrup": {
    name: "Golden Syrup",
    ingredients: {
      Gold: new Decimal(5),
    },
    image: whiteBottle,
    description: "Guaranteed to bloom the plant, but at a cost.",
  },
  "Happy Hooch": {
    name: "Happy Hooch",
    ingredients: {
      Parsnip: new Decimal(10),
      Radish: new Decimal(10),
    },
    image: blueBottle,
    description: "A potion to bring joy and laughter to your plants.",
  },
  "Organic Oasis": {
    name: "Organic Oasis",
    ingredients: {
      Egg: new Decimal(10),
      Kale: new Decimal(10),
      Stone: new Decimal(10),
    },
    image: greenBottle,
    description: "Create a lush, organic paradise for your plants.",
  },
};
