import { SUNNYSIDE } from "assets/sunnyside";
import type { BuildingName } from "features/game/types/buildings";
import type { TemperateSeasonName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import type { LandBiomeName } from "features/island/biomes/biomes";
import {
  AGING_SHED_VARIANTS,
  BAKERY_VARIANTS,
  DELI_VARIANTS,
  FIRE_PIT_VARIANTS,
  FISH_MARKET_VARIANTS,
  GREENHOUSE_VARIANTS,
  HEN_HOUSE_VARIANTS,
  KITCHEN_VARIANTS,
  MANOR_VARIANTS,
  MARKET_VARIANTS,
  PET_HOUSE_VARIANTS,
  SMOOTHIE_SHACK_VARIANTS,
  TOOLSHED_VARIANTS,
  WAREHOUSE_VARIANTS,
  WATER_WELL_VARIANTS,
  WORKBENCH_VARIANTS,
} from "features/island/lib/alternateArt";
import { BARN_IMAGES } from "features/island/buildings/components/building/barn/Barn";
import { COMPOSTER_IMAGES } from "features/island/buildings/components/building/composters/ComposterModal";

/**
 * Base art per building — the DOM components' art selection + placement,
 * flattened to data ([BuildingComponents.tsx] + each building component).
 * Offsets are source px relative to the building's placement box
 * (bottom/left anchored, exactly like the DOM's `absolute bottom-0` imgs).
 *
 * Pure module (no Phaser import) so it stays jest-testable.
 */

export type BuildingArtContext = {
  biome: LandBiomeName;
  season: TemperateSeasonName;
  henHouseLevel: number;
  barnLevel: number;
  /** Upgrade-adjusted current level [WaterWell.tsx: level-1 while upgrading]. */
  waterWellLevel: number;
  petHouseLevel: number;
  agingShedLevel: number;
};

export type BuildingBaseArt = {
  texture: string;
  /** Display width in source px (height keeps the texture's aspect). */
  width: number;
  bottom: number;
  left: number;
};

const clampLevel = (level: number, max: number) =>
  Math.max(1, Math.min(level, max));

/** [AgingShed.tsx:47-51] level→art thresholds are not a direct index. */
export const agingShedArtLevel = (level: number): 1 | 2 | 3 => {
  if (level >= 6) return 3;
  if (level >= 4) return 2;
  return 1;
};

export const BUILDING_BASE_ART: Partial<
  Record<BuildingName, (ctx: BuildingArtContext) => BuildingBaseArt>
> = {
  "Fire Pit": ({ biome, season }) => ({
    texture: FIRE_PIT_VARIANTS[biome][season],
    width: 47,
    bottom: 0,
    left: 0,
  }),
  Kitchen: ({ biome, season }) => ({
    texture: KITCHEN_VARIANTS[biome][season],
    width: 63,
    bottom: 0,
    left: 0,
  }),
  Bakery: ({ season }) => ({
    texture: BAKERY_VARIANTS[season],
    width: 62,
    bottom: 0,
    left: 1,
  }),
  Deli: ({ season }) => ({
    texture: DELI_VARIANTS[season],
    width: 64,
    bottom: 0,
    left: 0,
  }),
  "Smoothie Shack": ({ biome }) => ({
    texture: SMOOTHIE_SHACK_VARIANTS[biome],
    width: 48,
    bottom: 0,
    left: 0,
  }),
  Market: ({ biome, season }) => ({
    texture: MARKET_VARIANTS[biome][season],
    width: 48,
    bottom: 0,
    left: 0,
  }),
  "Fish Market": ({ season }) => ({
    texture: FISH_MARKET_VARIANTS[season],
    width: 48,
    bottom: 0,
    left: 0,
  }),
  Workbench: ({ biome }) => ({
    texture: WORKBENCH_VARIANTS[biome],
    width: 47,
    bottom: 4,
    left: 0,
  }),
  "Hen House": ({ season, henHouseLevel }) => ({
    texture: HEN_HOUSE_VARIANTS[season][clampLevel(henHouseLevel, 3)],
    width: 68,
    bottom: 0,
    left: 1,
  }),
  Barn: ({ biome, season, barnLevel }) => ({
    texture: BARN_IMAGES[biome][season][clampLevel(barnLevel, 3)],
    width: 64,
    bottom: 0,
    left: 0,
  }),
  "Town Center": () => ({
    texture: SUNNYSIDE.building.townCenter,
    width: 62,
    bottom: 0,
    left: 1,
  }),
  // House/Manor/Mansion share MANOR_VARIANTS with hard-coded biomes
  // [House.tsx / Manor.tsx / Mansion.tsx].
  House: ({ season }) => ({
    texture: MANOR_VARIANTS["Spring Biome"][season],
    width: 62,
    bottom: 0,
    left: 1,
  }),
  Manor: ({ season }) => ({
    texture: MANOR_VARIANTS["Desert Biome"][season],
    width: 78,
    bottom: 0,
    left: 1,
  }),
  Mansion: ({ season }) => ({
    texture: MANOR_VARIANTS["Volcano Biome"][season],
    width: 98,
    bottom: 0,
    left: 1,
  }),
  "Water Well": ({ season, waterWellLevel }) => ({
    texture: WATER_WELL_VARIANTS[season][clampLevel(waterWellLevel, 4)],
    width: 25,
    bottom: 0,
    left: 4,
  }),
  Tent: () => ({
    texture: SUNNYSIDE.building.tent,
    width: 46,
    bottom: 2,
    left: 1,
  }),
  Toolshed: ({ season }) => ({
    texture: TOOLSHED_VARIANTS[season],
    width: 36,
    bottom: 0,
    left: -2,
  }),
  Warehouse: ({ season }) => ({
    texture: WAREHOUSE_VARIANTS[season],
    width: 50,
    bottom: 0,
    left: -1,
  }),
  Greenhouse: ({ season }) => ({
    texture: GREENHOUSE_VARIANTS[season],
    width: 78,
    bottom: 2,
    left: 0,
  }),
  "Compost Bin": () => composterBase("Compost Bin"),
  "Turbo Composter": () => composterBase("Turbo Composter"),
  "Premium Composter": () => composterBase("Premium Composter"),
  "Crop Machine": () => ({
    texture: SUNNYSIDE.building.idleMachine,
    width: 80,
    bottom: 0,
    left: 0,
  }),
  "Crafting Box": () => ({
    texture: ITEM_DETAILS["Crafting Box"].image,
    width: 46,
    bottom: 0,
    left: -1,
  }),
  "Pet House": ({ petHouseLevel }) => ({
    texture: PET_HOUSE_VARIANTS[clampLevel(petHouseLevel, 3)],
    width: 49,
    bottom: 2,
    left: 1,
  }),
  "Aging Shed": ({ agingShedLevel }) => ({
    texture: AGING_SHED_VARIANTS[agingShedArtLevel(agingShedLevel)],
    width: 50,
    bottom: 0,
    left: 0,
  }),
};

/** [Composter.tsx:104-113] idle art centred in the 2×2 box. */
export const composterBase = (
  name: "Compost Bin" | "Turbo Composter" | "Premium Composter",
  state: "idle" | "composting" | "ready" = "idle",
): BuildingBaseArt => {
  const { width } = COMPOSTER_IMAGES[name];
  return {
    texture: COMPOSTER_IMAGES[name][state],
    width,
    bottom: 0,
    left: Math.round((32 - width) / 2),
  };
};

export const COOKING_BUILDINGS = [
  "Fire Pit",
  "Kitchen",
  "Bakery",
  "Deli",
  "Smoothie Shack",
] as const;

export type CookingBuilding = (typeof COOKING_BUILDINGS)[number];

export const isCookingBuilding = (
  name: BuildingName,
): name is CookingBuilding =>
  (COOKING_BUILDINGS as readonly string[]).includes(name);

/**
 * The idle/doing NPC + cooking-item-icon layout per cooking building.
 * Offsets are the DOM's exact source-px values; `icon` gives the anchor
 * formula input (see each component's onLoad math).
 */
export type CookingLayout = {
  npcIdle: { texture: string; width: number } & NpcAnchor;
  npcDoing: { texture: string; width: number } & NpcAnchor;
  shadow?: { width: number } & NpcAnchor;
  /**
   * Cooking item icon anchor. left-anchored: x = left + floor(base - w/2);
   * right-anchored (from the box's right edge): computed in the renderer.
   */
  icon:
    | { anchor: "left"; base: number; bottom: number }
    | {
        anchor: "right";
        formula: "half" | "offset";
        base: number;
        bottom: number;
      };
  readyLeftOffsetCss: number;
  /** Bakery-only smoke position. */
  smoke?: { width: number; left: number; bottom: number };
};

type NpcAnchor = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  flip?: boolean;
};

export const COOKING_LAYOUT: Record<CookingBuilding, CookingLayout> = {
  // [FirePit.tsx]
  "Fire Pit": {
    npcIdle: {
      texture: SUNNYSIDE.npcs.firePit_npc,
      width: 14,
      top: 2,
      left: 11,
    },
    npcDoing: {
      texture: SUNNYSIDE.npcs.firePit_npcDoing,
      width: 16,
      top: 2,
      left: 13,
    },
    shadow: { width: 15, top: 14, left: 11 },
    icon: { anchor: "left", base: 24, bottom: 6 },
    readyLeftOffsetCss: 10,
  },
  // [Kitchen.tsx] icon: right = floor((17 - w) / 2)
  Kitchen: {
    npcIdle: { texture: SUNNYSIDE.npcs.chef, width: 15, bottom: 8, right: 14 },
    npcDoing: {
      texture: SUNNYSIDE.npcs.chef_doing,
      width: 16,
      bottom: 7,
      right: 14,
    },
    shadow: { width: 15, bottom: 6, right: 15 },
    icon: { anchor: "right", formula: "offset", base: 17, bottom: 10 },
    readyLeftOffsetCss: 90,
  },
  // [Bakery.tsx]
  Bakery: {
    npcIdle: {
      texture: SUNNYSIDE.npcs.goblin_chef,
      width: 22,
      left: 29,
      bottom: 3,
      flip: true,
    },
    npcDoing: {
      texture: SUNNYSIDE.npcs.goblin_chef_doing,
      width: 25,
      left: 27,
      bottom: 1,
      flip: true,
    },
    shadow: { width: 15, bottom: 0, left: 30 },
    icon: { anchor: "left", base: 21, bottom: 5 },
    readyLeftOffsetCss: 10,
    smoke: { width: 20, left: 9, bottom: 44 },
  },
  // [Deli.tsx] icon: right = floor(8 - w / 2)
  Deli: {
    npcIdle: {
      texture: SUNNYSIDE.npcs.artisian,
      width: 15,
      right: 1,
      bottom: 17,
      flip: true,
    },
    npcDoing: {
      texture: SUNNYSIDE.npcs.artisianDoing,
      width: 17,
      right: 1,
      bottom: 17,
      flip: true,
    },
    shadow: { width: 15, right: 2.5, bottom: 15 },
    icon: { anchor: "right", formula: "half", base: 8, bottom: 8 },
    readyLeftOffsetCss: 90,
  },
  // [SmoothieShack.tsx] icon: right = floor(24 - w / 2). Desk drawn on top.
  "Smoothie Shack": {
    npcIdle: {
      texture: SUNNYSIDE.npcs.smoothieChef,
      width: 14,
      right: 17,
      bottom: 11,
    },
    npcDoing: {
      texture: SUNNYSIDE.npcs.smoothieChefMaking,
      width: 15,
      right: 15,
      bottom: 11,
    },
    icon: { anchor: "right", formula: "half", base: 24, bottom: 5 },
    readyLeftOffsetCss: 10,
  },
};
