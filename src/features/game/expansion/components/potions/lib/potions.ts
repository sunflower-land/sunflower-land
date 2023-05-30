import { Potion } from "./types";

import orangeBottle from "assets/decorations/orange_bottle.webp";
import blueBottle from "assets/decorations/blue_bottle.webp";
import pinkBottle from "assets/decorations/pink_bottle.webp";
import aquaBottle from "assets/decorations/aqua_bottle.webp";
import greenBottle from "assets/decorations/green_bottle.webp";
import mustardBottle from "assets/decorations/mustard_bottle.webp";
import purpleBottle from "assets/decorations/purple_bottle.webp";
import redBottle from "assets/decorations/red_bottle.webp";
import whiteBottle from "assets/decorations/white_bottle.webp";
import blackBottle from "assets/decorations/black_bottle.webp";

export const BASIC_POTIONS: Potion[] = [
  {
    name: "Bloom Boost",
    ingredients: {
      Pumpkin: 10,
      Cabbage: 10,
      Iron: 10,
    },
    image: orangeBottle,
  },
  {
    name: "Happy Hooch",
    ingredients: {
      Parsnip: 10,
      Radish: 10,
      Wood: 10,
    },
    image: blueBottle,
  },
  {
    name: "Earth Essence",
    ingredients: {
      Potato: 10,
      Stone: 10,
      Iron: 10,
    },
    image: pinkBottle,
  },
  {
    name: "Flower Power",
    ingredients: {
      Sunflower: 10,
      Iron: 10,
    },
    image: aquaBottle,
  },
  {
    name: "Organic Oasis",
    ingredients: {
      Egg: 10,
      Kale: 10,
      Stone: 10,
    },
    image: greenBottle,
  },
  {
    name: "Dream Drip",
    ingredients: {
      Egg: 10,
      Kale: 10,
      Stone: 10,
    },
    image: mustardBottle,
  },
  {
    name: "Ember Elixir",
    ingredients: {
      Egg: 10,
      Kale: 10,
      Stone: 10,
    },
    image: redBottle,
  },
  {
    name: "Whisper Brew",
    ingredients: {
      Egg: 10,
      Kale: 10,
      Stone: 10,
    },
    image: purpleBottle,
  },
];

export const SPECIAL_POTIONS: Potion[] = [
  {
    name: "Miracle Mix",
    ingredients: {
      Egg: 10,
      Kale: 10,
      Stone: 10,
    },
    image: blackBottle,
  },
  {
    name: "Golden Syrup",
    ingredients: {
      Egg: 10,
      Kale: 10,
      Stone: 10,
    },
    image: whiteBottle,
  },
];
