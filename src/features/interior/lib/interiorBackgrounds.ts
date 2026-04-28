import { HomeExpansionTier, IslandType } from "features/game/types/game";

import tent from "assets/buildings/tent.webp";
import home from "assets/buildings/home.webp";
import manor from "assets/buildings/manor.webp";
import mansion from "assets/buildings/mansion.webp";
import levelOneStart from "assets/buildings/level-one-start.webp";
import levelOne2 from "assets/buildings/level-one-2.webp";
import levelOne3 from "assets/buildings/level-one-3.webp";
import levelOne4 from "assets/buildings/level-one-4.webp";
import levelOne5 from "assets/buildings/level-one-5.webp";
import levelOne6 from "assets/buildings/level-one-6.webp";
import levelOneFull from "assets/buildings/level-one-full.webp";

/**
 * Interior background images, one per island type. All four are 380x320 native
 * pixels and are positioned bottom-left-anchored within the interior canvas
 * (see INTERIOR_CANVAS in interiorLayouts.ts).
 */
export const INTERIOR_BACKGROUNDS: Record<IslandType, string> = {
  basic: tent,
  spring: home,
  desert: manor,
  volcano: mansion,
};

/**
 * Native pixel dimensions of the background images (before PIXEL_SCALE is
 * applied). Keep this in sync if the artwork is resized.
 */
export const INTERIOR_BACKGROUND_NATIVE = {
  width: 380,
  height: 320,
} as const;

/**
 * Backgrounds for each home-expansion tier. Currently all entries are
 * level-one assets; future expansion tiers (e.g. level-two-*) plug in here
 * alongside without changing the consumer code.
 *
 * These assets are 384x320 native px (24 tiles wide, 20 tall).
 */
export const HOME_EXPANSION_BACKGROUNDS: Record<HomeExpansionTier, string> = {
  "level-one-start": levelOneStart,
  "level-one-2": levelOne2,
  "level-one-3": levelOne3,
  "level-one-4": levelOne4,
  "level-one-5": levelOne5,
  "level-one-6": levelOne6,
  "level-one-full": levelOneFull,
};

export const HOME_EXPANSION_BACKGROUND_NATIVE = {
  width: 384,
  height: 320,
} as const;
