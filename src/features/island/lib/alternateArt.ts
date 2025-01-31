import { SUNNYSIDE } from "assets/sunnyside";
import volcanoBush from "assets/decorations/bush/summer_volcano_bush.webp";

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

export const BUSH_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.decorations.bush,
  spring: SUNNYSIDE.decorations.bush,
  desert: SUNNYSIDE.decorations.bush,
  volcano: volcanoBush,
};

export const VIP_ISLAND_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.land.vip_island,
  spring: SUNNYSIDE.land.vip_island,
  desert: SUNNYSIDE.land.vip_island,
  volcano: SUNNYSIDE.land.vip_volcano_island,
};
