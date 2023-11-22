import { Potion } from "./types";

import orangeBottle from "assets/decorations/orange_bottle.webp";
import blueBottle from "assets/decorations/blue_bottle.webp";
import pinkBottle from "assets/decorations/pink_bottle.webp";
import blackBottle from "assets/decorations/black_bottle.webp";
import greenBottle from "assets/decorations/green_bottle.webp";
import mustardBottle from "assets/decorations/mustard_bottle.webp";
import whiteBottle from "assets/decorations/white_bottle.webp";
import { PotionName } from "features/game/types/game";

export const POTIONS: Record<PotionName, Potion> = {
  "Bloom Boost": {
    name: "Bloom Boost",
    image: orangeBottle,
    description: "Ignite your plants with vibrant blooms!", // Translation required
  },
  "Dream Drip": {
    name: "Dream Drip",
    image: mustardBottle,
    description: "Drizzle your plants with magical dreams and fantasies.", // Translation required
  },
  "Earth Essence": {
    name: "Earth Essence",
    image: pinkBottle,
    description: "Harness the power of the earth to nurture your plants.", // Translation required
  },
  "Flower Power": {
    name: "Flower Power",
    image: blackBottle,
    description: "Unleash a burst of floral energy upon your plants.", // Translation required
  },
  "Silver Syrup": {
    name: "Silver Syrup",
    image: whiteBottle,
    description: "A sweet syrup to bring out the best in your plants.", // Translation required
  },
  "Happy Hooch": {
    name: "Happy Hooch",
    image: blueBottle,
    description: "A potion to bring joy and laughter to your plants.", // Translation required
  },
  "Organic Oasis": {
    name: "Organic Oasis",
    image: greenBottle,
    description: "Create a lush, organic paradise for your plants.", // Translation required
  },
};
