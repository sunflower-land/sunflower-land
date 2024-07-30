import { Potion } from "./types";
import { SUNNYSIDE } from "assets/sunnyside";
import { PotionName } from "features/game/types/game";
import { translate } from "lib/i18n/translate";

export const POTIONS: Record<PotionName, Potion> = {
  "Bloom Boost": {
    name: "Bloom Boost",
    image: SUNNYSIDE.decorations.orangeBottle,
    description: translate("BloomBoost.description"),
  },
  "Dream Drip": {
    name: "Dream Drip",
    image: SUNNYSIDE.decorations.mustardBottle,
    description: translate("DreamDrip.description"),
  },
  "Earth Essence": {
    name: "Earth Essence",
    image: SUNNYSIDE.decorations.pinkBottle,
    description: translate("EarthEssence.description"),
  },
  "Flower Power": {
    name: "Flower Power",
    image: SUNNYSIDE.decorations.blackBottle,
    description: translate("FlowerPower.description"),
  },
  "Silver Syrup": {
    name: "Silver Syrup",
    image: SUNNYSIDE.decorations.whiteBottle,
    description: translate("SilverSyrup.description"),
  },
  "Happy Hooch": {
    name: "Happy Hooch",
    image: SUNNYSIDE.decorations.blueBottle,
    description: translate("HappyHooch.description"),
  },
  "Organic Oasis": {
    name: "Organic Oasis",
    image: SUNNYSIDE.decorations.greenBottle,
    description: translate("OrganicOasis.description"),
  },
};
