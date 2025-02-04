import { SUNNYSIDE } from "assets/sunnyside";

import { IslandType, TemperateSeasonName } from "features/game/types/game";
import { AnimalBuildingLevel } from "features/game/events/landExpansion/upgradeBuilding";
import { FlowerGrowthStage, FlowerName } from "features/game/types/flowers";
import { CONFIG } from "lib/config";
import cactiStump from "assets/resources/tree/cacti_stump.webp";
import autumnCactiStump from "assets/resources/tree/autumn_cacti_stump.webp";

export const FIRE_PIT_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.firePit,
  spring: SUNNYSIDE.building.firePit,
  desert: SUNNYSIDE.building.desertFirePit,
  volcano: SUNNYSIDE.building.volcanoFirePit,
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

export const HEN_HOUSE_VARIANTS: Record<
  TemperateSeasonName,
  Record<AnimalBuildingLevel, string>
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

export const SMOOTHIE_SHACK_DESK_VARIANTS: Record<TemperateSeasonName, string> =
  {
    spring: SUNNYSIDE.seasons.spring.smoothie_shack_desk,
    summer: SUNNYSIDE.building.smoothieShackDesk,
    autumn: SUNNYSIDE.seasons.autumn.smoothie_shack_desk,
    winter: SUNNYSIDE.seasons.winter.smoothie_shack_desk,
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

export const CHOPPED_SHEET_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.resource.springChoppedSheet,
  summer: SUNNYSIDE.resource.summerChoppedSheet,
  autumn: SUNNYSIDE.resource.autumnChoppedSheet,
  winter: SUNNYSIDE.resource.winterChoppedSheet,
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

export const STUMP_VARIANTS: Record<
  IslandType,
  Record<TemperateSeasonName, string>
> = {
  basic: {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
  },
  spring: {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
  },
  desert: {
    spring: cactiStump,
    summer: cactiStump,
    autumn: autumnCactiStump,
    winter: cactiStump,
  },
  volcano: {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
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

export const GREENHOUSE_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.greenhouse,
  summer: SUNNYSIDE.building.greenhouse,
  autumn: SUNNYSIDE.seasons.autumn.greenhouse,
  winter: SUNNYSIDE.seasons.winter.greenhouse,
};

export const WATER_WELL_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.well,
  summer: SUNNYSIDE.building.well,
  autumn: SUNNYSIDE.seasons.autumn.well,
  winter: SUNNYSIDE.seasons.winter.well,
};
