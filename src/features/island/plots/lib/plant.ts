import sunflowerProcSprite from "assets/crops/sunflower/proc_sprite.png";
import potatoProcSprite from "assets/crops/potato/proc_sprite.png";
import pumpkinProcSprite from "assets/crops/pumpkin/proc_sprite.png";
import carrotProcSprite from "assets/crops/carrot/proc_sprite.png";
import cabbageProcSprite from "assets/crops/cabbage/proc_sprite.png";
import beetrootProcSprite from "assets/crops/beetroot/proc_sprite.png";
import cauliflowerProcSprite from "assets/crops/cauliflower/proc_sprite.png";
import parsnipProcSprite from "assets/crops/parsnip/proc_sprite.png";
import eggplantProcSprite from "assets/crops/eggplant/proc_sprite.png";
import cornProcSprite from "assets/crops/corn/proc_sprite.png";
import radishProcSprite from "assets/crops/radish/proc_sprite.png";
import wheatProcSprite from "assets/crops/wheat/proc_sprite.png";
import kaleProcSprite from "assets/crops/kale/proc_sprite.png";
import soybeanProcSprite from "assets/crops/soybean/proc_sprite.png";

import { CropName } from "features/game/types/crops";
import { getKeys } from "features/game/types/craftables";
import { CONFIG } from "lib/config";

const HARVEST_PROC_SPRITES: Record<CropName, any> = {
  Sunflower: sunflowerProcSprite,
  Potato: potatoProcSprite,
  Pumpkin: pumpkinProcSprite,
  Carrot: carrotProcSprite,
  Cabbage: cabbageProcSprite,
  Beetroot: beetrootProcSprite,
  Cauliflower: cauliflowerProcSprite,
  Parsnip: parsnipProcSprite,
  Eggplant: eggplantProcSprite,
  Corn: cornProcSprite,
  Radish: radishProcSprite,
  Wheat: wheatProcSprite,
  Kale: kaleProcSprite,
  Soybean: soybeanProcSprite,
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
};

export const CROP_LIFECYCLE: Record<CropName, Lifecycle> = getKeys(
  IMAGES
).reduce(
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
  {} as Record<CropName, Lifecycle>
);
