import { CropName } from "features/game/types/crops";
import { getKeys } from "features/game/types/craftables";
import { CONFIG } from "lib/config";

import sunflowerProc from "assets/crops/sunflower/proc_sprite.png";
import potatoProc from "assets/crops/potato/proc_sprite.png";
import pumpkinProc from "assets/crops/pumpkin/proc_sprite.png";
import carrotProc from "assets/crops/carrot/proc_sprite.png";
import cabbageProc from "assets/crops/cabbage/proc_sprite.png";
import beetrootProc from "assets/crops/beetroot/proc_sprite.png";
import cauliflowerProc from "assets/crops/cauliflower/proc_sprite.png";
import parsnipProc from "assets/crops/parsnip/proc_sprite.png";
import eggplantProc from "assets/crops/eggplant/proc_sprite.png";
import cornProc from "assets/crops/corn/proc_sprite.png";
import radishProc from "assets/crops/radish/proc_sprite.png";
import wheatProc from "assets/crops/wheat/proc_sprite.png";
import kaleProc from "assets/crops/kale/proc_sprite.png";
import soybeanProc from "assets/crops/soybean/proc_sprite.png";
import { IslandType } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";

const HARVEST_PROC_SPRITES: Record<CropName, any> = {
  Sunflower: sunflowerProc,
  Potato: potatoProc,
  Pumpkin: pumpkinProc,
  Carrot: carrotProc,
  Cabbage: cabbageProc,
  Beetroot: beetrootProc,
  Cauliflower: cauliflowerProc,
  Parsnip: parsnipProc,
  Eggplant: eggplantProc,
  Corn: cornProc,
  Radish: radishProc,
  Wheat: wheatProc,
  Kale: kaleProc,
  Soybean: soybeanProc,
  Barley: potatoProc,
  Rhubarb: radishProc,
  Zucchini: kaleProc,
  Yam: cabbageProc,
  Broccoli: kaleProc,
  Pepper: radishProc,
  Onion: parsnipProc,
  Turnip: sunflowerProc,
  Artichoke: cabbageProc,
};

export const HARVEST_PROC_ANIMATION = {
  size: 36,
  steps: 11,
  fps: 10,
  sprites: HARVEST_PROC_SPRITES,
};

export type Lifecycle = {
  seedling: any;
  halfway: any;
  almost: any;
  ready: any;
  crop: any;
  seed: any;
};

const URL = `${CONFIG.PROTECTED_IMAGE_URL}/crops`;
const VOLCANO_URL = `${CONFIG.PROTECTED_IMAGE_URL}/volcano/crops`;

export const IMAGES: Record<CropName, string> = {
  Sunflower: "sunflower",
  Potato: "potato",
  Pumpkin: "pumpkin",
  Carrot: "carrot",
  Cabbage: "cabbage",
  Beetroot: "beetroot",
  Cauliflower: "cauliflower",
  Parsnip: "parsnip",
  Eggplant: "eggplant",
  Corn: "corn",
  Radish: "radish",
  Wheat: "wheat",
  Kale: "kale",
  Soybean: "soybean",
  Barley: "barley",
  Rhubarb: "rhubarb",
  Zucchini: "zuchinni",
  Yam: "yam",
  Broccoli: "brocolli",
  Pepper: "pepper",
  Onion: "onion",
  Turnip: "turnip",
  Artichoke: "artichoke",
};

export const CROP_LIFECYCLE: Record<IslandType, Record<CropName, Lifecycle>> = {
  basic: getKeys(IMAGES).reduce(
    (acc, name) => ({
      ...acc,
      [name]: {
        seedling: `${URL}/${IMAGES[name]}/seedling.png`,
        halfway: `${URL}/${IMAGES[name]}/halfway.png`,
        almost: `${URL}/${IMAGES[name]}/almost.png`,
        ready: `${URL}/${IMAGES[name]}/plant.png`,
        crop: `${URL}/${IMAGES[name]}/crop.png`,
        seed: `${URL}/${IMAGES[name]}/seed.png`,
      },
    }),
    {} as Record<CropName, Lifecycle>,
  ),
  spring: getKeys(IMAGES).reduce(
    (acc, name) => ({
      ...acc,
      [name]: {
        seedling: `${URL}/${IMAGES[name]}/seedling.png`,
        halfway: `${URL}/${IMAGES[name]}/halfway.png`,
        almost: `${URL}/${IMAGES[name]}/almost.png`,
        ready: `${URL}/${IMAGES[name]}/plant.png`,
        crop: `${URL}/${IMAGES[name]}/crop.png`,
        seed: `${URL}/${IMAGES[name]}/seed.png`,
      },
    }),
    {} as Record<CropName, Lifecycle>,
  ),
  volcano: getKeys(IMAGES).reduce(
    (acc, name) => ({
      ...acc,
      [name]: {
        seedling: `${VOLCANO_URL}/${IMAGES[name]}/seedling.png`,
        halfway: `${VOLCANO_URL}/${IMAGES[name]}/halfway.png`,
        almost: `${VOLCANO_URL}/${IMAGES[name]}/almost.png`,
        ready: `${VOLCANO_URL}/${IMAGES[name]}/plant.png`,
        crop: `${VOLCANO_URL}/${IMAGES[name]}/crop.png`,
        seed: `${VOLCANO_URL}/${IMAGES[name]}/seed.png`,
      },
    }),
    {} as Record<CropName, Lifecycle>,
  ),
  desert: getKeys(IMAGES).reduce(
    (acc, name) => ({
      ...acc,
      [name]: {
        seedling: `${URL}/${IMAGES[name]}/seedling.png`,
        halfway: `${URL}/${IMAGES[name]}/halfway.png`,
        almost: `${URL}/${IMAGES[name]}/almost.png`,
        ready: `${URL}/${IMAGES[name]}/plant.png`,
        crop: `${URL}/${IMAGES[name]}/crop.png`,
        seed: `${URL}/${IMAGES[name]}/seed.png`,
      },
    }),
    {} as Record<CropName, Lifecycle>,
  ),
};

export const SOIL_IMAGES: Record<IslandType, Record<string, string>> = {
  basic: {
    regular: SUNNYSIDE.soil.soil2,
    dry: SUNNYSIDE.soil.soil_dry,
  },
  spring: {
    regular: SUNNYSIDE.soil.soil2,
    dry: SUNNYSIDE.soil.soil_dry,
  },
  volcano: {
    regular: SUNNYSIDE.soil.volcanoSoil2,
    dry: SUNNYSIDE.soil.volcanoSoilDry,
  },
  desert: {
    regular: SUNNYSIDE.soil.soil2,
    dry: SUNNYSIDE.soil.soil_dry,
  },
};
