import timeWarpTotem from "assets/sfts/time_warp_totem.webp";
import superTotem from "assets/sfts/super_totem.webp";
import fastForward from "assets/icons/fast_forward.png";
import gourmetHourglassFull from "assets/factions/boosts/cooking_boost_full.webp";
import gourmetHourglassHalf from "assets/factions/boosts/cooking_boost_half.webp";
import gourmetHourglassDone from "assets/factions/boosts/cooking_boost_done.webp";
import harvestHourglassFull from "assets/factions/boosts/crop_boost_full.webp";
import harvestHourglassHalf from "assets/factions/boosts/crop_boost_half.webp";
import harvestHourglassDone from "assets/factions/boosts/crop_boost_done.webp";
import timberHourglassFull from "assets/factions/boosts/wood_boost_full.webp";
import timberHourglassHalf from "assets/factions/boosts/wood_boost_half.webp";
import timberHourglassDone from "assets/factions/boosts/wood_boost_done.webp";
import oreHourglassFull from "assets/factions/boosts/mineral_boost_full.webp";
import oreHourglassHalf from "assets/factions/boosts/mineral_boost_half.webp";
import oreHourglassDone from "assets/factions/boosts/mineral_boost_done.webp";
import orchardHourglassFull from "assets/factions/boosts/fruit_boost_full.webp";
import orchardHourglassHalf from "assets/factions/boosts/fruit_boost_half.webp";
import orchardHourglassDone from "assets/factions/boosts/fruit_boost_done.webp";
import blossomHourglassFull from "assets/factions/boosts/flower_boost_full.webp";
import blossomHourglassHalf from "assets/factions/boosts/flower_boost_half.webp";
import blossomHourglassDone from "assets/factions/boosts/flower_boost_done.webp";
import fisherHourglassFull from "assets/factions/boosts/fish_boost_full.webp";
import fisherHourglassHalf from "assets/factions/boosts/fish_boost_half.webp";
import fisherHourglassDone from "assets/factions/boosts/fish_boost_done.webp";

import type { CollectibleName } from "features/game/types/craftables";
import type { TemporaryCollectibleName } from "features/game/lib/collectibleBuilt";
import { ITEM_DETAILS } from "features/game/types/images";
import { PET_SHRINE_DIMENSIONS } from "features/island/collectibles/components/PetShrine";
import { getObjectEntries } from "lib/object";

/**
 * The expiring boost collectibles [TimeWarpTotem.tsx / SuperTotem.tsx /
 * Hourglass.tsx]: countdown bar while active, staged art (hourglasses),
 * grayscale + burn/renew flow once expired. Geometry in source px from the
 * DOM components; `left` undefined = centred in the tile.
 */

export type ExpiringConfig = {
  /** Staged art — half kicks in below 50% remaining, done when expired. */
  images: { full: string; half?: string; done?: string };
  width: number;
  left?: number;
  bottom: number;
  /** Hourglasses draw the npc shadow under the glass (12px, centred). */
  shadow?: boolean;
  /** Totems pulse the fast-forward icon while the boost runs. */
  activeIcon?: { src: string; width: number; top: number; left: number };
  /** Shrines show a centred progress bar while ACTIVE too [PetShrine.tsx]. */
  activeBar?: boolean;
  /** Shrines renew via RenewPetShrine and never offer the dig/burn path. */
  renewFlow?: "petShrine";
  /** "!" vertical offset when expired (shrines sit it higher). */
  alertTop?: number;
};

const hourglass = (
  full: string,
  half: string,
  done: string,
): ExpiringConfig => ({
  images: { full, half, done },
  width: 11,
  bottom: 0,
  shadow: true,
});

export const EXPIRING_COLLECTIBLES: Partial<
  Record<CollectibleName, ExpiringConfig>
> = {
  "Time Warp Totem": {
    images: { full: timeWarpTotem },
    width: 13,
    left: 1,
    bottom: 0,
    activeIcon: { src: fastForward, width: 10, top: -5, left: 3 },
  },
  "Super Totem": {
    images: { full: superTotem },
    width: 20,
    left: 0,
    bottom: 0,
    activeIcon: { src: fastForward, width: 10, top: -5, left: 3 },
  },
  "Gourmet Hourglass": hourglass(
    gourmetHourglassFull,
    gourmetHourglassHalf,
    gourmetHourglassDone,
  ),
  "Harvest Hourglass": hourglass(
    harvestHourglassFull,
    harvestHourglassHalf,
    harvestHourglassDone,
  ),
  "Timber Hourglass": hourglass(
    timberHourglassFull,
    timberHourglassHalf,
    timberHourglassDone,
  ),
  "Ore Hourglass": hourglass(
    oreHourglassFull,
    oreHourglassHalf,
    oreHourglassDone,
  ),
  "Orchard Hourglass": hourglass(
    orchardHourglassFull,
    orchardHourglassHalf,
    orchardHourglassDone,
  ),
  "Blossom Hourglass": hourglass(
    blossomHourglassFull,
    blossomHourglassHalf,
    blossomHourglassDone,
  ),
  "Fisher's Hourglass": hourglass(
    fisherHourglassFull,
    fisherHourglassHalf,
    fisherHourglassDone,
  ),
};

// Every pet shrine (incl. the Obsidian and event shrines) shares the
// PetShrine.tsx layout: ITEM_DETAILS art at per-name width/left, active
// progress bar, renew-only expiry.
getObjectEntries(PET_SHRINE_DIMENSIONS).forEach(([name, dims]) => {
  EXPIRING_COLLECTIBLES[name as CollectibleName] = {
    images: { full: ITEM_DETAILS[name as CollectibleName]?.image ?? "" },
    width: dims.width ?? 16,
    left: dims.left,
    bottom: 0,
    activeBar: true,
    renewFlow: "petShrine",
    alertTop: -20,
  };
});

export const isExpiringCollectible = (
  name: CollectibleName,
): name is TemporaryCollectibleName & CollectibleName =>
  name in EXPIRING_COLLECTIBLES;
