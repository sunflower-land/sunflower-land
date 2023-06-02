import { Potion } from "./types";

import orangeBottle from "assets/decorations/orange_bottle.webp";
import blueBottle from "assets/decorations/blue_bottle.webp";
import pinkBottle from "assets/decorations/pink_bottle.webp";
import aquaBottle from "assets/decorations/aqua_bottle.webp";
import greenBottle from "assets/decorations/green_bottle.webp";
import mustardBottle from "assets/decorations/mustard_bottle.webp";
import whiteBottle from "assets/decorations/white_bottle.webp";

export const POTIONS: Potion[] = [
  {
    name: "Bloom Boost",
    ingredients: {
      Pumpkin: 10,
      Cabbage: 10,
      Iron: 10,
    },
    image: orangeBottle,
    description: "Ignite your plants with vibrant blooms!",
  },
  {
    name: "Happy Hooch",
    ingredients: {
      Parsnip: 10,
      Radish: 10,
      Wood: 10,
    },
    image: blueBottle,
    description: "A potion to bring joy and laughter to your plants.",
  },
  {
    name: "Earth Essence",
    ingredients: {
      Potato: 10,
      Stone: 10,
      Iron: 10,
    },
    image: pinkBottle,
    description: "Harness the power of the earth to nurture your plants.",
  },
  {
    name: "Flower Power",
    ingredients: {
      Sunflower: 10,
      Iron: 10,
    },
    image: aquaBottle,
    description: "Unleash a burst of floral energy upon your plants.",
  },
  {
    name: "Organic Oasis",
    ingredients: {
      Egg: 10,
      Kale: 10,
      Stone: 10,
    },
    image: greenBottle,
    description: "Create a lush, organic paradise for your plants.",
  },
  {
    name: "Dream Drip",
    ingredients: {
      Egg: 10,
      Kale: 10,
      Stone: 10,
    },
    image: mustardBottle,
    description: "Drizzle your plants with magical dreams and fantasies.",
  },
  // {
  //   name: "Miracle Mix",
  //   ingredients: {
  //     Egg: 10,
  //     Kale: 10,
  //     Stone: 10,
  //   },
  //   image: blackBottle,
  //   description:
  //     "Risk it all! 50/50 chance of booming or destroying the plant.",
  // },
  {
    name: "Golden Syrup",
    ingredients: {
      Gold: 5,
    },
    image: whiteBottle,
    description: "Guaranteed to bloom the plant, but at a cost.",
  },
];
