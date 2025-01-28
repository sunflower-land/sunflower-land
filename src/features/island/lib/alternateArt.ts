import { SUNNYSIDE } from "assets/sunnyside";
import emptyFlowerBed from "assets/flowers/empty.webp";
import volcanoBush from "assets/decorations/bush/summer_volcano_bush.webp";

import { IslandType } from "features/game/types/game";
import { AnimalBuildingLevel } from "features/game/events/landExpansion/upgradeBuilding";

export const FIRE_PIT_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.firePit,
  spring: SUNNYSIDE.building.firePit,
  desert: SUNNYSIDE.building.desertFirePit,
  volcano: SUNNYSIDE.building.universalFirePit,
};

export const BAKERY_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.bakery,
  spring: SUNNYSIDE.building.bakery,
  desert: SUNNYSIDE.building.desertBakery,
  volcano: SUNNYSIDE.building.universalBakery,
};

export const DELI_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.deli,
  spring: SUNNYSIDE.building.deli,
  desert: SUNNYSIDE.building.desertDeli,
  volcano: SUNNYSIDE.building.universalDeli,
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
  volcano: SUNNYSIDE.building.universalKitchen,
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
  volcano: SUNNYSIDE.building.universalMarket,
};

export const SMOOTHIE_SHACK_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.smoothieShack,
  spring: SUNNYSIDE.building.smoothieShack,
  desert: SUNNYSIDE.building.desertSmoothieShack,
  volcano: SUNNYSIDE.building.universalSmoothieShack,
};

export const WORKBENCH_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.workbench,
  spring: SUNNYSIDE.building.workbench,
  desert: SUNNYSIDE.building.desertWorkbench,
  volcano: SUNNYSIDE.building.universalWorkbench,
};

export const FRUIT_PATCH_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.building.fruitPatchDirt,
  spring: SUNNYSIDE.building.fruitPatchDirt,
  desert: SUNNYSIDE.building.desertFruitPatchDirt,
  volcano: SUNNYSIDE.building.universalFruitPatchDirt,
};

export const FLOWER_VARIANTS: Record<IslandType, string> = {
  basic: emptyFlowerBed,
  spring: emptyFlowerBed,
  desert: SUNNYSIDE.building.desertEmptyFlowerBed,
  volcano: SUNNYSIDE.building.volcanoEmptyFlowerBed,
};

export const DIRT_PATH_VARIANTS: Record<IslandType, string> = {
  basic: SUNNYSIDE.sfts.dirt,
  spring: SUNNYSIDE.sfts.dirt,
  desert: SUNNYSIDE.building.desertDirt,
  volcano: SUNNYSIDE.building.universalDirt,
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
