import { Potion } from "./types";

import orangeBottle from "assets/decorations/orange_bottle.webp";
import blueBottle from "assets/decorations/blue_bottle.webp";
import pinkBottle from "assets/decorations/pink_bottle.webp";
import blackBottle from "assets/decorations/black_bottle.webp";
import greenBottle from "assets/decorations/green_bottle.webp";
import mustardBottle from "assets/decorations/mustard_bottle.webp";
import whiteBottle from "assets/decorations/white_bottle.webp";
import { PotionName } from "features/game/types/game";
import { translate } from "lib/i18n/translate";

export const POTIONS: Record<PotionName, Potion> = {
  "Bloom Boost": {
    name: "Bloom Boost",
    image: orangeBottle,
    description: translate("BloomBoost.description"),
  },
  "Dream Drip": {
    name: "Dream Drip",
    image: mustardBottle,
    description: translate("DreamDrip.description"),
  },
  "Earth Essence": {
    name: "Earth Essence",
    image: pinkBottle,
    description: translate("EarthEssence.description"),
  },
  "Flower Power": {
    name: "Flower Power",
    image: blackBottle,
    description: translate("FlowerPower.description"),
  },
  "Silver Syrup": {
    name: "Silver Syrup",
    image: whiteBottle,
    description: translate("SilverSyrup.description"),
  },
  "Happy Hooch": {
    name: "Happy Hooch",
    image: blueBottle,
    description: translate("HappyHooch.description"),
  },
  "Organic Oasis": {
    name: "Organic Oasis",
    image: greenBottle,
    description: translate("OrganicOasis.description"),
  },
};
