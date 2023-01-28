import sunflowerProcSprite from "assets/crops/sunflower/proc_sprite.png";
import potatoProcSprite from "assets/crops/potato/proc_sprite.png";
import pumpkinProcSprite from "assets/crops/pumpkin/proc_sprite.png";
import carrotProcSprite from "assets/crops/carrot/proc_sprite.png";
import cabbageProcSprite from "assets/crops/cabbage/proc_sprite.png";
import beetrootProcSprite from "assets/crops/beetroot/proc_sprite.png";
import cauliflowerProcSprite from "assets/crops/cauliflower/proc_sprite.png";
import parsnipProcSprite from "assets/crops/parsnip/proc_sprite.png";
import radishProcSprite from "assets/crops/radish/proc_sprite.png";
import wheatProcSprite from "assets/crops/wheat/proc_sprite.png";
import kaleProcSprite from "assets/crops/kale/proc_sprite.png";

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
  Radish: radishProcSprite,
  Wheat: wheatProcSprite,
  Kale: kaleProcSprite,
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

export const IMAGES: Record<CropName, string> = {
  Sunflower: "sunflower",
  Potato: "potato",
  Pumpkin: "pumpkin",
  Carrot: "carrot",
  Cabbage: "cabbage",
  Beetroot: "beetroot",
  Cauliflower: "cauliflower",
  Parsnip: "parsnip",
  Radish: "radish",
  Wheat: "wheat",
  Kale: "kale",
};

export const CROP_URL = (crop: string) => {
  if (!crop) throw new Error("A valid crop name is required");

  // check if the proxy path is set and if not serve
  // images from the protected images endpoint
  const protectedImageUrl =
    CONFIG.PROTECTED_IMAGE_PROXY || CONFIG.PROTECTED_IMAGE_URL;

  return `${protectedImageUrl}/crops/${crop}`;
};

export const CROP_LIFECYCLE: Record<CropName, Lifecycle> = getKeys(
  IMAGES
).reduce((acc, name) => {
  const crop = IMAGES[name];
  return {
    ...acc,
    [name]: {
      seedling: `${CROP_URL(crop)}/seedling.png`,
      halfway: `${CROP_URL(crop)}/halfway.png`,
      almost: `${CROP_URL(crop)}/almost.png`,
      ready: `${CROP_URL(crop)}/plant.png`,
      crop: `${CROP_URL(crop)}/crop.png`,
      seed: `${CROP_URL(crop)}/seed.png`,
    },
  };
}, {} as Record<CropName, Lifecycle>);

console.log({
  CROP_LIFECYCLE,
});
