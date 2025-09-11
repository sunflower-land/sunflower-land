import { SUNNYSIDE } from "assets/sunnyside";

import { TemperateSeasonName } from "features/game/types/game";
import { FlowerGrowthStage, FlowerName } from "features/game/types/flowers";
import { CONFIG } from "lib/config";
import cactiStump from "assets/resources/tree/cacti_stump.webp";
import autumnCactiStump from "assets/resources/tree/autumn_cacti_stump.webp";
import { LandBiomeName } from "../biomes/biomes";
import { TreeName } from "features/game/types/resources";

const BIOME_NAME_KEYS: Record<
  LandBiomeName,
  "basic" | "spring" | "desert" | "volcano"
> = {
  "Basic Biome": "basic",
  "Spring Biome": "spring",
  "Desert Biome": "desert",
  "Volcano Biome": "volcano",
};

export const FIRE_PIT_VARIANTS: Record<
  LandBiomeName,
  Record<TemperateSeasonName, string>
> = {
  "Basic Biome": {
    spring: SUNNYSIDE.seasons.spring.firePit,
    summer: SUNNYSIDE.building.firePit,
    autumn: SUNNYSIDE.seasons.autumn.firePit,
    winter: SUNNYSIDE.seasons.winter.firePit,
  },
  "Spring Biome": {
    spring: SUNNYSIDE.seasons.spring.firePit,
    summer: SUNNYSIDE.building.firePit,
    autumn: SUNNYSIDE.seasons.autumn.firePit,
    winter: SUNNYSIDE.seasons.winter.firePit,
  },
  "Desert Biome": {
    spring: SUNNYSIDE.seasons.spring.desertFirePit,
    summer: SUNNYSIDE.building.desertFirePit,
    autumn: SUNNYSIDE.seasons.autumn.desertFirePit,
    winter: SUNNYSIDE.seasons.winter.desertFirePit,
  },
  "Volcano Biome": {
    spring: SUNNYSIDE.seasons.spring.volcanoFirePit,
    summer: SUNNYSIDE.building.volcanoFirePit,
    autumn: SUNNYSIDE.seasons.autumn.volcanoFirePit,
    winter: SUNNYSIDE.seasons.winter.volcanoFirePit,
  },
};

export const BAKERY_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.bakery,
  summer: SUNNYSIDE.building.bakery,
  autumn: SUNNYSIDE.seasons.autumn.bakery,
  winter: SUNNYSIDE.seasons.winter.bakery,
};

export const DELI_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.deli,
  summer: SUNNYSIDE.building.deli,
  autumn: SUNNYSIDE.seasons.autumn.deli,
  winter: SUNNYSIDE.seasons.winter.deli,
};

export const TOOLSHED_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.toolshed,
  summer: SUNNYSIDE.building.toolshed,
  autumn: SUNNYSIDE.seasons.autumn.toolshed,
  winter: SUNNYSIDE.seasons.winter.toolshed,
};

export const WAREHOUSE_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.warehouse,
  summer: SUNNYSIDE.building.warehouse,
  autumn: SUNNYSIDE.seasons.autumn.warehouse,
  winter: SUNNYSIDE.seasons.winter.warehouse,
};

export const HEN_HOUSE_VARIANTS: Record<
  TemperateSeasonName,
  Record<number, string>
> = {
  spring: {
    1: SUNNYSIDE.seasons.spring.hen_house_1,
    2: SUNNYSIDE.seasons.spring.hen_house_2,
    3: SUNNYSIDE.seasons.spring.hen_house_3,
  },
  summer: {
    1: SUNNYSIDE.building.henHouseLevel1,
    2: SUNNYSIDE.building.henHouseLevel2,
    3: SUNNYSIDE.building.henHouseLevel3,
  },
  autumn: {
    1: SUNNYSIDE.seasons.autumn.hen_house_1,
    2: SUNNYSIDE.seasons.autumn.hen_house_2,
    3: SUNNYSIDE.seasons.autumn.hen_house_3,
  },
  winter: {
    1: SUNNYSIDE.seasons.winter.hen_house_1,
    2: SUNNYSIDE.seasons.winter.hen_house_2,
    3: SUNNYSIDE.seasons.winter.hen_house_3,
  },
};

export const KITCHEN_VARIANTS: Record<
  LandBiomeName,
  Record<TemperateSeasonName, string>
> = {
  "Basic Biome": {
    spring: SUNNYSIDE.seasons.spring.kitchen,
    summer: SUNNYSIDE.building.kitchen,
    autumn: SUNNYSIDE.seasons.autumn.kitchen,
    winter: SUNNYSIDE.seasons.winter.kitchen,
  },
  "Spring Biome": {
    spring: SUNNYSIDE.seasons.spring.kitchen,
    summer: SUNNYSIDE.building.kitchen,
    autumn: SUNNYSIDE.seasons.autumn.kitchen,
    winter: SUNNYSIDE.seasons.winter.kitchen,
  },
  "Desert Biome": {
    spring: SUNNYSIDE.seasons.spring.desertKitchen,
    summer: SUNNYSIDE.building.desertKitchen,
    autumn: SUNNYSIDE.seasons.autumn.desertKitchen,
    winter: SUNNYSIDE.seasons.winter.desertKitchen,
  },
  "Volcano Biome": {
    spring: SUNNYSIDE.seasons.spring.volcanoKitchen,
    summer: SUNNYSIDE.building.volcanoKitchen,
    autumn: SUNNYSIDE.seasons.autumn.volcanoKitchen,
    winter: SUNNYSIDE.seasons.winter.volcanoKitchen,
  },
};

export const MANOR_VARIANTS: Record<
  LandBiomeName,
  Record<TemperateSeasonName, string>
> = {
  "Basic Biome": {
    spring: SUNNYSIDE.seasons.spring.house,
    summer: SUNNYSIDE.building.house,
    autumn: SUNNYSIDE.seasons.autumn.house,
    winter: SUNNYSIDE.seasons.winter.house,
  },
  "Spring Biome": {
    spring: SUNNYSIDE.seasons.spring.house,
    summer: SUNNYSIDE.building.house,
    autumn: SUNNYSIDE.seasons.autumn.house,
    winter: SUNNYSIDE.seasons.winter.house,
  },
  "Desert Biome": {
    spring: SUNNYSIDE.seasons.spring.manor,
    summer: SUNNYSIDE.building.manor,
    autumn: SUNNYSIDE.seasons.autumn.manor,
    winter: SUNNYSIDE.seasons.winter.manor,
  },
  "Volcano Biome": {
    spring: SUNNYSIDE.seasons.spring.mansion,
    summer: SUNNYSIDE.building.mansion,
    autumn: SUNNYSIDE.seasons.autumn.mansion,
    winter: SUNNYSIDE.seasons.winter.mansion,
  },
};

export const MARKET_VARIANTS: Record<
  LandBiomeName,
  Record<TemperateSeasonName, string>
> = {
  "Basic Biome": {
    spring: SUNNYSIDE.seasons.spring.market,
    summer: SUNNYSIDE.building.market,
    autumn: SUNNYSIDE.seasons.autumn.market,
    winter: SUNNYSIDE.seasons.winter.market,
  },
  "Spring Biome": {
    spring: SUNNYSIDE.seasons.spring.market,
    summer: SUNNYSIDE.building.market,
    autumn: SUNNYSIDE.seasons.autumn.market,
    winter: SUNNYSIDE.seasons.winter.market,
  },
  "Desert Biome": {
    spring: SUNNYSIDE.seasons.spring.desertMarket,
    summer: SUNNYSIDE.building.desertMarket,
    autumn: SUNNYSIDE.seasons.autumn.desertMarket,
    winter: SUNNYSIDE.seasons.winter.desertMarket,
  },
  "Volcano Biome": {
    spring: SUNNYSIDE.seasons.spring.volcanoMarket,
    summer: SUNNYSIDE.building.volcanoMarket,
    autumn: SUNNYSIDE.seasons.autumn.volcanoMarket,
    winter: SUNNYSIDE.seasons.winter.volcanoMarket,
  },
};

export const SMOOTHIE_SHACK_VARIANTS: Record<LandBiomeName, string> = {
  "Basic Biome": SUNNYSIDE.building.smoothieShack,
  "Spring Biome": SUNNYSIDE.building.smoothieShack,
  "Desert Biome": SUNNYSIDE.building.desertSmoothieShack,
  "Volcano Biome": SUNNYSIDE.building.volcanoSmoothieShack,
};

export const SMOOTHIE_SHACK_DESK_VARIANTS: Record<TemperateSeasonName, string> =
  {
    spring: SUNNYSIDE.seasons.spring.smoothie_shack_desk,
    summer: SUNNYSIDE.building.smoothieShackDesk,
    autumn: SUNNYSIDE.seasons.autumn.smoothie_shack_desk,
    winter: SUNNYSIDE.seasons.winter.smoothie_shack_desk,
  };

export const WORKBENCH_VARIANTS: Record<LandBiomeName, string> = {
  "Basic Biome": SUNNYSIDE.building.workbench,
  "Spring Biome": SUNNYSIDE.building.workbench,
  "Desert Biome": SUNNYSIDE.building.desertWorkbench,
  "Volcano Biome": SUNNYSIDE.building.volcanoWorkbench,
};

export const FRUIT_PATCH_VARIANTS: Record<LandBiomeName, string> = {
  "Basic Biome": SUNNYSIDE.building.fruitPatchDirt,
  "Spring Biome": SUNNYSIDE.building.fruitPatchDirt,
  "Desert Biome": SUNNYSIDE.building.desertFruitPatchDirt,
  "Volcano Biome": SUNNYSIDE.building.volcanoFruitPatchDirt,
};

export const CHOPPED_SHEET_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.resource.springChoppedSheet,
  summer: SUNNYSIDE.resource.summerChoppedSheet,
  autumn: SUNNYSIDE.resource.autumnChoppedSheet,
  winter: SUNNYSIDE.resource.winterChoppedSheet,
};

export const FLOWER_VARIANTS = (
  biome: LandBiomeName,
  season: TemperateSeasonName,
  flower: FlowerName,
  stage: FlowerGrowthStage | "flower_bed",
) => {
  const BIOME_TO_ISLAND: Record<LandBiomeName, string> = {
    "Basic Biome": "basic",
    "Spring Biome": "spring",
    "Desert Biome": "desert",
    "Volcano Biome": "volcano",
  };

  const island = BIOME_TO_ISLAND[biome];

  if (
    stage === "seedling" ||
    stage === "halfway" ||
    stage === "sprout" ||
    stage === "flower_bed"
  ) {
    return `${CONFIG.PROTECTED_IMAGE_URL}/flowers/${island}/${season}/${stage}.webp`;
  }

  const flowerName = flower.toLowerCase().replace(/ /g, "_");

  if (flowerName)
    return `${CONFIG.PROTECTED_IMAGE_URL}/flowers/${island}/${season}/${flowerName}_${stage}.webp`;
};

export const DIRT_PATH_VARIANTS: Record<LandBiomeName, string> = {
  "Basic Biome": SUNNYSIDE.sfts.dirt,
  "Spring Biome": SUNNYSIDE.sfts.dirt,
  "Desert Biome": SUNNYSIDE.building.desertDirt,
  "Volcano Biome": SUNNYSIDE.building.volcanoDirt,
};

export const BUSH_VARIANTS: Record<
  LandBiomeName,
  Record<TemperateSeasonName, string>
> = {
  "Basic Biome": {
    spring: SUNNYSIDE.resource.basic.spring.bush,
    summer: SUNNYSIDE.resource.basic.summer.bush,
    autumn: SUNNYSIDE.resource.basic.autumn.bush,
    winter: SUNNYSIDE.resource.basic.winter.bush,
  },
  "Spring Biome": {
    spring: SUNNYSIDE.resource.spring.spring.bush,
    summer: SUNNYSIDE.resource.spring.summer.bush,
    autumn: SUNNYSIDE.resource.spring.autumn.bush,
    winter: SUNNYSIDE.resource.spring.winter.bush,
  },
  "Desert Biome": {
    spring: SUNNYSIDE.resource.desert.spring.bush,
    summer: SUNNYSIDE.resource.desert.summer.bush,
    autumn: SUNNYSIDE.resource.desert.autumn.bush,
    winter: SUNNYSIDE.resource.desert.winter.bush,
  },
  "Volcano Biome": {
    spring: SUNNYSIDE.resource.volcano.spring.bush,
    summer: SUNNYSIDE.resource.volcano.summer.bush,
    autumn: SUNNYSIDE.resource.volcano.autumn.bush,
    winter: SUNNYSIDE.resource.volcano.winter.bush,
  },
};

export const VIP_ISLAND_VARIANTS: Record<LandBiomeName, string> = {
  "Basic Biome": SUNNYSIDE.land.vip_island,
  "Spring Biome": SUNNYSIDE.land.vip_island,
  "Desert Biome": SUNNYSIDE.land.vip_island,
  "Volcano Biome": SUNNYSIDE.land.vip_volcano_island,
};

export const TREE_SHAKE_SHEET_VARIANTS = (
  biome: LandBiomeName,
  season: TemperateSeasonName,
  tree: TreeName,
) => SUNNYSIDE.resource[BIOME_NAME_KEYS[biome]][season].shakeSheet[tree];

export const TREE_VARIANTS = (
  biome: LandBiomeName,
  season: TemperateSeasonName,
  tree: TreeName,
) => SUNNYSIDE.resource[BIOME_NAME_KEYS[biome]][season][tree];

export const STUMP_VARIANTS: Record<
  LandBiomeName,
  Record<TemperateSeasonName, string>
> = {
  "Basic Biome": {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
  },
  "Spring Biome": {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
  },
  "Desert Biome": {
    spring: cactiStump,
    summer: cactiStump,
    autumn: autumnCactiStump,
    winter: cactiStump,
  },
  "Volcano Biome": {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
  },
};

export const GREENHOUSE_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.greenhouse,
  summer: SUNNYSIDE.building.greenhouse,
  autumn: SUNNYSIDE.seasons.autumn.greenhouse,
  winter: SUNNYSIDE.seasons.winter.greenhouse,
};

export const WATER_WELL_VARIANTS: Record<
  TemperateSeasonName,
  Record<number, string>
> = {
  spring: {
    1: SUNNYSIDE.seasons.spring.well,
    2: SUNNYSIDE.seasons.spring.well2,
    3: SUNNYSIDE.seasons.spring.well3,
    4: SUNNYSIDE.seasons.spring.well4,
  },
  summer: {
    1: SUNNYSIDE.building.well,
    2: SUNNYSIDE.building.well2,
    3: SUNNYSIDE.building.well3,
    4: SUNNYSIDE.building.well4,
  },
  autumn: {
    1: SUNNYSIDE.seasons.autumn.well,
    2: SUNNYSIDE.seasons.autumn.well2,
    3: SUNNYSIDE.seasons.autumn.well3,
    4: SUNNYSIDE.seasons.autumn.well4,
  },
  winter: {
    1: SUNNYSIDE.seasons.winter.well,
    2: SUNNYSIDE.seasons.winter.well2,
    3: SUNNYSIDE.seasons.winter.well3,
    4: SUNNYSIDE.seasons.winter.well4,
  },
};
