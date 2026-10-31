import type { CropName } from "features/game/types/crops";
import { getKeys } from "lib/object";
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
import { SUNNYSIDE } from "assets/sunnyside";
import type { LandBiomeName } from "features/island/biomes/biomes";

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
  Saltwort: beetrootProc,
  "Crystal Leaf": kaleProc,
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

// Crops with no Volcano Biome art in the images repo yet. Without this they
// 404 and render as broken sprites for anyone on the Volcano Biome.
const MISSING_VOLCANO_ART: CropName[] = ["Saltwort", "Crystal Leaf"];

const volcanoUrl = (name: CropName) =>
  MISSING_VOLCANO_ART.includes(name) ? URL : VOLCANO_URL;

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
  Zucchini: "zucchini",
  Yam: "yam",
  Broccoli: "brocolli",
  Pepper: "pepper",
  Onion: "onion",
  Turnip: "turnip",
  Artichoke: "artichoke",
  // Chapter Crop Week event crops (lifecycle art in the images repo)
  Saltwort: "saltwort",
  "Crystal Leaf": "crystal_leaf",
};

/** Every crop's stages from an ascension biome's folder, whose dirt mounds
 * match that biome's soil. */
const ascensionLifecycles = (
  biome: "swamp" | "spooky" | "crystal" | "galaxy" | "marble",
) =>
  getKeys(IMAGES).reduce(
    (acc, name) => {
      const url = `${CONFIG.PROTECTED_IMAGE_URL}/${biome}/crops/${IMAGES[name]}`;

      return {
        ...acc,
        [name]: {
          seedling: `${url}/seedling.png`,
          halfway: `${url}/halfway.png`,
          almost: `${url}/almost.png`,
          ready: `${url}/plant.png`,
          crop: `${url}/crop.png`,
          seed: `${url}/seed.png`,
        },
      };
    },
    {} as Record<CropName, Lifecycle>,
  );

export const CROP_LIFECYCLE: Record<
  LandBiomeName,
  Record<CropName, Lifecycle>
> = {
  "Basic Biome": getKeys(IMAGES).reduce(
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
  "Spring Biome": getKeys(IMAGES).reduce(
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
  "Volcano Biome": getKeys(IMAGES).reduce(
    (acc, name) => {
      const url = volcanoUrl(name);

      return {
        ...acc,
        [name]: {
          seedling: `${url}/${IMAGES[name]}/seedling.png`,
          halfway: `${url}/${IMAGES[name]}/halfway.png`,
          almost: `${url}/${IMAGES[name]}/almost.png`,
          ready: `${url}/${IMAGES[name]}/plant.png`,
          crop: `${url}/${IMAGES[name]}/crop.png`,
          seed: `${url}/${IMAGES[name]}/seed.png`,
        },
      };
    },
    {} as Record<CropName, Lifecycle>,
  ),
  "Swamp Biome": ascensionLifecycles("swamp"),
  "Spooky Biome": ascensionLifecycles("spooky"),
  "Crystal Biome": ascensionLifecycles("crystal"),
  "Galaxy Biome": ascensionLifecycles("galaxy"),
  "Marble Age Biome": ascensionLifecycles("marble"),
  "Desert Biome": getKeys(IMAGES).reduce(
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

export const SOIL_IMAGES: Record<LandBiomeName, Record<string, string>> = {
  "Basic Biome": {
    regular: SUNNYSIDE.soil.soil2,
    dry: SUNNYSIDE.soil.soil_dry,
  },
  "Spring Biome": {
    regular: SUNNYSIDE.soil.soil2,
    dry: SUNNYSIDE.soil.soil_dry,
  },
  "Volcano Biome": {
    regular: SUNNYSIDE.soil.volcanoSoil2,
    dry: SUNNYSIDE.soil.volcanoSoilDry,
  },
  "Swamp Biome": {
    regular: SUNNYSIDE.ascensionGround.swamp.soil2,
    dry: SUNNYSIDE.ascensionGround.swamp.soilDry,
  },
  "Spooky Biome": {
    regular: SUNNYSIDE.ascensionGround.spooky.soil2,
    dry: SUNNYSIDE.ascensionGround.spooky.soilDry,
  },
  "Crystal Biome": {
    regular: SUNNYSIDE.ascensionGround.crystal.soil2,
    dry: SUNNYSIDE.ascensionGround.crystal.soilDry,
  },
  "Galaxy Biome": {
    regular: SUNNYSIDE.ascensionGround.galaxy.soil2,
    dry: SUNNYSIDE.ascensionGround.galaxy.soilDry,
  },
  "Marble Age Biome": {
    regular: SUNNYSIDE.ascensionGround.marble.soil2,
    dry: SUNNYSIDE.ascensionGround.marble.soilDry,
  },
  "Desert Biome": {
    regular: SUNNYSIDE.soil.soil2,
    dry: SUNNYSIDE.soil.soil_dry,
  },
};
