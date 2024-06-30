import { CropName } from "features/game/types/crops";
import { getKeys } from "features/game/types/craftables";
import { CONFIG } from "lib/config";

const HARVEST_PROC_SPRITES: Record<CropName, any> = {
  Sunflower: "public/assets/crops/sunflower/proc_sprite.png",
  Potato: "public/assets/crops/potato/proc_sprite.png",
  Pumpkin: "public/assets/crops/pumpkin/proc_sprite.png",
  Carrot: "public/assets/crops/carrot/proc_sprite.png",
  Cabbage: "public/assets/crops/cabbage/proc_sprite.png",
  Beetroot: "public/assets/crops/beetroot/proc_sprite.png",
  Cauliflower: "public/assets/crops/cauliflower/proc_sprite.png",
  Parsnip: "public/assets/crops/parsnip/proc_sprite.png",
  Eggplant: "public/assets/crops/eggplant/proc_sprite.png",
  Corn: "public/assets/crops/corn/proc_sprite.png",
  Radish: "public/assets/crops/radish/proc_sprite.png",
  Wheat: "public/assets/crops/wheat/proc_sprite.png",
  Kale: "public/assets/crops/kale/proc_sprite.png",
  Soybean: "public/assets/crops/soybean/proc_sprite.png",
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
