import { SUNNYSIDE } from "assets/sunnyside";

import type { TemperateSeasonName } from "features/game/types/game";
import type {
  FlowerGrowthStage,
  FlowerName,
} from "features/game/types/flowers";
import { CONFIG } from "lib/config";
import cactiStump from "assets/resources/tree/cacti_stump.webp";
import autumnCactiStump from "assets/resources/tree/autumn_cacti_stump.webp";
import type { LandBiomeName } from "../biomes/biomes";
import type { TreeName } from "features/game/types/resources";

/** Which biome's tree art to read out of `SUNNYSIDE.resource`. */
const BIOME_NAME_KEYS: Record<
  LandBiomeName,
  keyof Pick<
    typeof SUNNYSIDE.resource,
    | "basic"
    | "spring"
    | "desert"
    | "volcano"
    | "swamp"
    | "spooky"
    | "crystal"
    | "galaxy"
    | "marble"
  >
> = {
  "Basic Biome": "basic",
  "Spring Biome": "spring",
  "Desert Biome": "desert",
  "Volcano Biome": "volcano",
  "Swamp Biome": "swamp",
  "Spooky Biome": "spooky",
  "Crystal Biome": "crystal",
  "Galaxy Biome": "galaxy",
  "Marble Age Biome": "marble",
};

type AscensionGround = typeof SUNNYSIDE.ascensionGround;
type AscensionBiome = keyof AscensionGround;

const ASCENSION_BIOMES: Partial<Record<LandBiomeName, AscensionBiome>> = {
  "Swamp Biome": "swamp",
  "Spooky Biome": "spooky",
  "Crystal Biome": "crystal",
  "Galaxy Biome": "galaxy",
  "Marble Age Biome": "marble",
};

/** A building's four seasons from an ascension biome's recoloured ground art. */
const ascensionSeasons = (
  biome: AscensionBiome,
  building: keyof AscensionGround[AscensionBiome]["summer"],
): Record<TemperateSeasonName, string> => {
  const ground = SUNNYSIDE.ascensionGround[biome];
  return {
    spring: ground.spring[building],
    summer: ground.summer[building],
    autumn: ground.autumn[building],
    winter: ground.winter[building],
  };
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
  "Swamp Biome": ascensionSeasons("swamp", "firePit"),
  "Spooky Biome": ascensionSeasons("spooky", "firePit"),
  "Crystal Biome": ascensionSeasons("crystal", "firePit"),
  "Galaxy Biome": ascensionSeasons("galaxy", "firePit"),
  "Marble Age Biome": ascensionSeasons("marble", "firePit"),
};

const BASIC_BAKERY: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.bakery,
  summer: SUNNYSIDE.building.bakery,
  autumn: SUNNYSIDE.seasons.autumn.bakery,
  winter: SUNNYSIDE.seasons.winter.bakery,
};

// Desert only has summer art, so its other seasons keep basic's seasonal art.
// The images repo's volcano bakery is identical to basic's, so it isn't used.
export const BAKERY_VARIANTS: Record<
  LandBiomeName,
  Record<TemperateSeasonName, string>
> = {
  "Basic Biome": BASIC_BAKERY,
  "Spring Biome": BASIC_BAKERY,
  "Desert Biome": { ...BASIC_BAKERY, summer: SUNNYSIDE.building.desertBakery },
  "Volcano Biome": BASIC_BAKERY,
  "Swamp Biome": BASIC_BAKERY,
  "Spooky Biome": BASIC_BAKERY,
  "Crystal Biome": BASIC_BAKERY,
  "Galaxy Biome": BASIC_BAKERY,
  "Marble Age Biome": BASIC_BAKERY,
};

const BASIC_DELI: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.deli,
  summer: SUNNYSIDE.building.deli,
  autumn: SUNNYSIDE.seasons.autumn.deli,
  winter: SUNNYSIDE.seasons.winter.deli,
};

// Same as the bakery: desert has summer art only, volcano's matches basic's.
export const DELI_VARIANTS: Record<
  LandBiomeName,
  Record<TemperateSeasonName, string>
> = {
  "Basic Biome": BASIC_DELI,
  "Spring Biome": BASIC_DELI,
  "Desert Biome": { ...BASIC_DELI, summer: SUNNYSIDE.building.desertDeli },
  "Volcano Biome": BASIC_DELI,
  "Swamp Biome": BASIC_DELI,
  "Spooky Biome": BASIC_DELI,
  "Crystal Biome": BASIC_DELI,
  "Galaxy Biome": BASIC_DELI,
  "Marble Age Biome": BASIC_DELI,
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

export const FISH_MARKET_VARIANTS: Record<TemperateSeasonName, string> = {
  spring: SUNNYSIDE.seasons.spring.fishMarket,
  summer: SUNNYSIDE.building.fishMarket,
  autumn: SUNNYSIDE.seasons.autumn.fishMarket,
  winter: SUNNYSIDE.seasons.winter.fishMarket,
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
  "Swamp Biome": ascensionSeasons("swamp", "kitchen"),
  "Spooky Biome": ascensionSeasons("spooky", "kitchen"),
  "Crystal Biome": ascensionSeasons("crystal", "kitchen"),
  "Galaxy Biome": ascensionSeasons("galaxy", "kitchen"),
  "Marble Age Biome": ascensionSeasons("marble", "kitchen"),
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
  "Swamp Biome": {
    spring: SUNNYSIDE.seasons.spring.mansion,
    summer: SUNNYSIDE.building.mansion,
    autumn: SUNNYSIDE.seasons.autumn.mansion,
    winter: SUNNYSIDE.seasons.winter.mansion,
  },
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": {
    spring: SUNNYSIDE.seasons.spring.mansion,
    summer: SUNNYSIDE.building.mansion,
    autumn: SUNNYSIDE.seasons.autumn.mansion,
    winter: SUNNYSIDE.seasons.winter.mansion,
  },
  "Crystal Biome": {
    spring: SUNNYSIDE.seasons.spring.mansion,
    summer: SUNNYSIDE.building.mansion,
    autumn: SUNNYSIDE.seasons.autumn.mansion,
    winter: SUNNYSIDE.seasons.winter.mansion,
  },
  "Galaxy Biome": {
    spring: SUNNYSIDE.seasons.spring.mansion,
    summer: SUNNYSIDE.building.mansion,
    autumn: SUNNYSIDE.seasons.autumn.mansion,
    winter: SUNNYSIDE.seasons.winter.mansion,
  },
  "Marble Age Biome": {
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
  "Swamp Biome": ascensionSeasons("swamp", "market"),
  "Spooky Biome": ascensionSeasons("spooky", "market"),
  "Crystal Biome": ascensionSeasons("crystal", "market"),
  "Galaxy Biome": ascensionSeasons("galaxy", "market"),
  "Marble Age Biome": ascensionSeasons("marble", "market"),
};

export const SMOOTHIE_SHACK_VARIANTS: Record<LandBiomeName, string> = {
  "Basic Biome": SUNNYSIDE.building.smoothieShack,
  "Spring Biome": SUNNYSIDE.building.smoothieShack,
  "Desert Biome": SUNNYSIDE.building.desertSmoothieShack,
  "Volcano Biome": SUNNYSIDE.building.volcanoSmoothieShack,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.smoothieShack,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.smoothieShack,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.smoothieShack,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.smoothieShack,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.smoothieShack,
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
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.workbench,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.workbench,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.workbench,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.workbench,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.workbench,
};

export const FRUIT_PATCH_VARIANTS: Record<LandBiomeName, string> = {
  "Basic Biome": SUNNYSIDE.building.fruitPatchDirt,
  "Spring Biome": SUNNYSIDE.building.fruitPatchDirt,
  "Desert Biome": SUNNYSIDE.building.desertFruitPatchDirt,
  "Volcano Biome": SUNNYSIDE.building.volcanoFruitPatchDirt,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.fruitPatchDirt,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.fruitPatchDirt,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.fruitPatchDirt,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.fruitPatchDirt,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.fruitPatchDirt,
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
    "Swamp Biome": "basic",
    // Ascension biomes (spooky onward) reuse the swamp art for now.
    "Spooky Biome": "basic",
    "Crystal Biome": "basic",
    "Galaxy Biome": "basic",
    "Marble Age Biome": "basic",
  };

  const island = BIOME_TO_ISLAND[biome];

  // Ascension biomes have their own bed, but their flowers are still basic's.
  const ascension = ASCENSION_BIOMES[biome];
  if (stage === "flower_bed" && ascension) {
    return SUNNYSIDE.ascensionGround[ascension][season].flowerBed;
  }

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
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.dirt,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.dirt,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.dirt,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.dirt,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.dirt,
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
  "Swamp Biome": {
    spring: SUNNYSIDE.resource.swamp.spring.bush,
    summer: SUNNYSIDE.resource.swamp.summer.bush,
    autumn: SUNNYSIDE.resource.swamp.autumn.bush,
    winter: SUNNYSIDE.resource.swamp.winter.bush,
  },
  "Spooky Biome": {
    spring: SUNNYSIDE.resource.spooky.spring.bush,
    summer: SUNNYSIDE.resource.spooky.summer.bush,
    autumn: SUNNYSIDE.resource.spooky.autumn.bush,
    winter: SUNNYSIDE.resource.spooky.winter.bush,
  },
  "Crystal Biome": {
    spring: SUNNYSIDE.resource.crystal.spring.bush,
    summer: SUNNYSIDE.resource.crystal.summer.bush,
    autumn: SUNNYSIDE.resource.crystal.autumn.bush,
    winter: SUNNYSIDE.resource.crystal.winter.bush,
  },
  "Galaxy Biome": {
    spring: SUNNYSIDE.resource.galaxy.spring.bush,
    summer: SUNNYSIDE.resource.galaxy.summer.bush,
    autumn: SUNNYSIDE.resource.galaxy.autumn.bush,
    winter: SUNNYSIDE.resource.galaxy.winter.bush,
  },
  "Marble Age Biome": {
    spring: SUNNYSIDE.resource.marble.spring.bush,
    summer: SUNNYSIDE.resource.marble.summer.bush,
    autumn: SUNNYSIDE.resource.marble.autumn.bush,
    winter: SUNNYSIDE.resource.marble.winter.bush,
  },
};

export const VIP_ISLAND_VARIANTS: Record<LandBiomeName, string> = {
  "Basic Biome": SUNNYSIDE.land.vip_island,
  "Spring Biome": SUNNYSIDE.land.vip_island,
  "Desert Biome": SUNNYSIDE.land.vip_island,
  "Volcano Biome": SUNNYSIDE.land.vip_volcano_island,
  "Swamp Biome": SUNNYSIDE.land.vip_island,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.vip_island,
  "Crystal Biome": SUNNYSIDE.land.vip_island,
  "Galaxy Biome": SUNNYSIDE.land.vip_island,
  "Marble Age Biome": SUNNYSIDE.land.vip_island,
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

type TreeSize = {
  /** Width of the sprite's own canvas, in game pixels. */
  width: number;
  /** Height of the sprite's own canvas, in game pixels. */
  height: number;
};

/** Canvas every tree sprite is drawn on unless it says otherwise. */
export const DEFAULT_TREE_SIZE: TreeSize = { width: 26, height: 34 };

/**
 * The ascension biomes' `Tree` sprites were each drawn on their own canvas
 * rather than the shared 26x34 one, so their size has to travel with them for
 * the trunk to stay centred and on the ground. Their ancient/sacred trees are
 * still basic art, so they keep the shared canvas.
 */
const ASCENSION_TREE_SIZES: Partial<Record<LandBiomeName, TreeSize>> = {
  "Swamp Biome": { width: 28, height: 38 },
  "Spooky Biome": { width: 23, height: 31 },
  "Crystal Biome": { width: 24, height: 34 },
  "Galaxy Biome": { width: 32, height: 34 },
  "Marble Age Biome": { width: 28, height: 35 },
};

/**
 * Desert's ancient and sacred cacti are drawn wider than the shared canvas,
 * except in spring, whose flowering versions keep it.
 */
const DESERT_TREE_SIZES: Partial<Record<TreeName, TreeSize>> = {
  "Ancient Tree": { width: 30, height: 34 },
  "Sacred Tree": { width: 30, height: 37 },
};

export const TREE_SIZE_VARIANTS = (
  biome: LandBiomeName,
  season: TemperateSeasonName,
  tree: TreeName,
): TreeSize => {
  if (tree === "Tree") return ASCENSION_TREE_SIZES[biome] ?? DEFAULT_TREE_SIZE;

  if (biome === "Desert Biome" && season !== "spring") {
    return DESERT_TREE_SIZES[tree] ?? DEFAULT_TREE_SIZE;
  }

  return DEFAULT_TREE_SIZE;
};

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
  "Swamp Biome": {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
  },
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
  },
  "Crystal Biome": {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
  },
  "Galaxy Biome": {
    spring: SUNNYSIDE.resource.stump,
    summer: SUNNYSIDE.resource.stump,
    autumn: SUNNYSIDE.resource.stump,
    winter: SUNNYSIDE.resource.stump,
  },
  "Marble Age Biome": {
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

export const PET_HOUSE_VARIANTS: Record<number, string> = {
  1: SUNNYSIDE.building.petHouse1,
  2: SUNNYSIDE.building.petHouse2,
  3: SUNNYSIDE.building.petHouse3,
};

export const AGING_SHED_VARIANTS: Record<number, string> = {
  1: SUNNYSIDE.building.agingShed1,
  2: SUNNYSIDE.building.agingShed2,
  3: SUNNYSIDE.building.agingShed3,
};

export const SALT_SCULPTURE_VARIANTS: Record<number, string> = {
  1: SUNNYSIDE.sculptures.saltSculpture1,
  2: SUNNYSIDE.sculptures.saltSculpture1,
  3: SUNNYSIDE.sculptures.saltSculpture2,
  4: SUNNYSIDE.sculptures.saltSculpture2,
  5: SUNNYSIDE.sculptures.saltSculpture3,
  6: SUNNYSIDE.sculptures.saltSculpture3,
};
