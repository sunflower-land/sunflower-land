import { SUNNYSIDE } from "assets/sunnyside";

import { IslandType, TemperateSeasonName } from "features/game/types/game";
import { AnimalBuildingLevel } from "features/game/events/landExpansion/upgradeBuilding";
import { FlowerGrowthStage, FlowerName } from "features/game/types/flowers";
import { CONFIG } from "lib/config";

export const FIRE_PIT_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.firePit,
  spring: SUNNYSIDE.building.firePit,
  desert: SUNNYSIDE.building.desertFirePit,
  volcano: SUNNYSIDE.building.volcanoFirePit,
};

export const BAKERY_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.bakery,
  spring: SUNNYSIDE.building.bakery,
  desert: SUNNYSIDE.building.desertBakery,
  volcano: SUNNYSIDE.building.volcanoBakery,
};

export const DELI_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.deli,
  spring: SUNNYSIDE.building.deli,
  desert: SUNNYSIDE.building.desertDeli,
  volcano: SUNNYSIDE.building.volcanoDeli,
};

export const BARN_VARIANTS: Record<
  IslandType,
  Record<AnimalBuildingLevel, string>
> = {
  basic: {
    1: SUNNYSIDE.building.barnLevel1,
    2: SUNNYSIDE.building.barnLevel2,
    3: SUNNYSIDE.building.barnLevel3,
  },
  spring: {
    1: SUNNYSIDE.building.barnLevel1,
    2: SUNNYSIDE.building.barnLevel2,
    3: SUNNYSIDE.building.barnLevel3,
  },
  desert: {
    1: SUNNYSIDE.building.barnLevel1,
    2: SUNNYSIDE.building.barnLevel2,
    3: SUNNYSIDE.building.barnLevel3,
  },
  volcano: {
    1: SUNNYSIDE.building.volcanoBarnLevel1,
    2: SUNNYSIDE.building.volcanoBarnLevel2,
    3: SUNNYSIDE.building.volcanoBarnLevel3,
  },
};

export const HEN_HOUSE_VARIANTS: Record<
  IslandType,
  Record<AnimalBuildingLevel, string>
> = {
  basic: {
    1: SUNNYSIDE.building.henHouseLevel1,
    2: SUNNYSIDE.building.henHouseLevel2,
    3: SUNNYSIDE.building.henHouseLevel3,
  },
  spring: {
    1: SUNNYSIDE.building.henHouseLevel1,
    2: SUNNYSIDE.building.henHouseLevel2,
    3: SUNNYSIDE.building.henHouseLevel3,
  },
  desert: {
    1: SUNNYSIDE.building.henHouseLevel1,
    2: SUNNYSIDE.building.henHouseLevel2,
    3: SUNNYSIDE.building.henHouseLevel3,
  },
  volcano: {
    1: SUNNYSIDE.building.henHouseLevel1,
    2: SUNNYSIDE.building.henHouseLevel2,
    3: SUNNYSIDE.building.henHouseLevel3,
  },
};

export const KITCHEN_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.kitchen,
  spring: SUNNYSIDE.building.kitchen,
  desert: SUNNYSIDE.building.desertKitchen,
  volcano: SUNNYSIDE.building.volcanoKitchen,
};

export const MANOR_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.house,
  spring: SUNNYSIDE.building.house,
  desert: SUNNYSIDE.building.desertHouse,
  volcano: SUNNYSIDE.building.mansion,
};

export const MARKET_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.market,
  spring: SUNNYSIDE.building.market,
  desert: SUNNYSIDE.building.desertMarket,
  volcano: SUNNYSIDE.building.volcanoMarket,
};

export const SMOOTHIE_SHACK_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.smoothieShack,
  spring: SUNNYSIDE.building.smoothieShack,
  desert: SUNNYSIDE.building.desertSmoothieShack,
  volcano: SUNNYSIDE.building.volcanoSmoothieShack,
};

export const WORKBENCH_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.workbench,
  spring: SUNNYSIDE.building.workbench,
  desert: SUNNYSIDE.building.desertWorkbench,
  volcano: SUNNYSIDE.building.volcanoWorkbench,
};

export const FRUIT_PATCH_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.fruitPatchDirt,
  spring: SUNNYSIDE.building.fruitPatchDirt,
  desert: SUNNYSIDE.building.desertFruitPatchDirt,
  volcano: SUNNYSIDE.building.volcanoFruitPatchDirt,
};

export const FLOWER_VARIANTS = (
  island: IslandType,
  season: TemperateSeasonName,
  flower: FlowerName,
  stage: FlowerGrowthStage | "flower_bed",
) => {
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

export const DIRT_PATH_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.sfts.dirt,
  spring: SUNNYSIDE.sfts.dirt,
  desert: SUNNYSIDE.building.desertDirt,
  volcano: SUNNYSIDE.building.volcanoDirt,
};

export const BUSH_VARIANTS: Record<
  IslandType,
  Record<TemperateSeasonName, string>
> = {
  basic: {
    spring: SUNNYSIDE.resource.basic.spring.bush,
    summer: SUNNYSIDE.resource.basic.summer.bush,
    autumn: SUNNYSIDE.resource.basic.autumn.bush,
    winter: SUNNYSIDE.resource.basic.winter.bush,
  },
  spring: {
    spring: SUNNYSIDE.resource.spring.spring.bush,
    summer: SUNNYSIDE.resource.spring.summer.bush,
    autumn: SUNNYSIDE.resource.spring.autumn.bush,
    winter: SUNNYSIDE.resource.spring.winter.bush,
  },
  desert: {
    spring: SUNNYSIDE.resource.desert.spring.bush,
    summer: SUNNYSIDE.resource.desert.summer.bush,
    autumn: SUNNYSIDE.resource.desert.autumn.bush,
    winter: SUNNYSIDE.resource.desert.winter.bush,
  },
  volcano: {
    spring: SUNNYSIDE.resource.volcano.spring.bush,
    summer: SUNNYSIDE.resource.volcano.summer.bush,
    autumn: SUNNYSIDE.resource.volcano.autumn.bush,
    winter: SUNNYSIDE.resource.volcano.winter.bush,
  },
};

export const VIP_ISLAND_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.land.vip_island,
  spring: SUNNYSIDE.land.vip_island,
  desert: SUNNYSIDE.land.vip_island,
  volcano: SUNNYSIDE.land.vip_volcano_island,
};

export const TREE_SHAKE_SHEET_VARIANTS: Record<
  IslandType,
  Record<TemperateSeasonName, string>
> = {
  basic: {
    spring: SUNNYSIDE.resource.basic.spring.shakeSheet,
    summer: SUNNYSIDE.resource.basic.summer.shakeSheet,
    autumn: SUNNYSIDE.resource.basic.autumn.shakeSheet,
    winter: SUNNYSIDE.resource.basic.winter.shakeSheet,
  },
  spring: {
    spring: SUNNYSIDE.resource.spring.spring.shakeSheet,
    summer: SUNNYSIDE.resource.spring.summer.shakeSheet,
    autumn: SUNNYSIDE.resource.spring.autumn.shakeSheet,
    winter: SUNNYSIDE.resource.spring.winter.shakeSheet,
  },
  desert: {
    spring: SUNNYSIDE.resource.desert.spring.shakeSheet,
    summer: SUNNYSIDE.resource.desert.summer.shakeSheet,
    autumn: SUNNYSIDE.resource.desert.autumn.shakeSheet,
    winter: SUNNYSIDE.resource.desert.winter.shakeSheet,
  },
  volcano: {
    spring: SUNNYSIDE.resource.volcano.spring.shakeSheet,
    summer: SUNNYSIDE.resource.volcano.summer.shakeSheet,
    autumn: SUNNYSIDE.resource.volcano.autumn.shakeSheet,
    winter: SUNNYSIDE.resource.volcano.winter.shakeSheet,
  },
};

export const TREE_VARIANTS: Record<
  IslandType,
  Record<TemperateSeasonName, string>
> = {
  basic: {
    spring: SUNNYSIDE.resource.basic.spring.tree,
    summer: SUNNYSIDE.resource.basic.summer.tree,
    autumn: SUNNYSIDE.resource.basic.autumn.tree,
    winter: SUNNYSIDE.resource.basic.winter.tree,
  },
  spring: {
    spring: SUNNYSIDE.resource.spring.spring.tree,
    summer: SUNNYSIDE.resource.spring.summer.tree,
    autumn: SUNNYSIDE.resource.spring.autumn.tree,
    winter: SUNNYSIDE.resource.spring.winter.tree,
  },
  desert: {
    spring: SUNNYSIDE.resource.desert.spring.tree,
    summer: SUNNYSIDE.resource.desert.summer.tree,
    autumn: SUNNYSIDE.resource.desert.autumn.tree,
    winter: SUNNYSIDE.resource.desert.winter.tree,
  },
  volcano: {
    spring: SUNNYSIDE.resource.volcano.spring.tree,
    summer: SUNNYSIDE.resource.volcano.summer.tree,
    autumn: SUNNYSIDE.resource.volcano.autumn.tree,
    winter: SUNNYSIDE.resource.volcano.winter.tree,
  },
};
