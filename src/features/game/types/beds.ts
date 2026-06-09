import { getCollectiblesAcrossLocations } from "features/game/lib/getCollectiblesAcrossLocations";
import { getKeys } from "lib/object";
import type { BedName, Collectibles } from "./game";

export const BED_FARMHAND_COUNT: Record<BedName, number> = {
  "Basic Bed": 1,
  "Fisher Bed": 2,
  "Floral Bed": 3,
  "Sturdy Bed": 4,
  "Desert Bed": 5,
  "Cow Bed": 6,
  "Pirate Bed": 7,
  "Royal Bed": 8,
  "Double Bed": 9,
  "Messy Bed": 10,
  "Pearl Bed": 11,
  "Salt Crystal Bed": 12,
};

/**
 * The distinct bed types placed across every placement surface — the farm, the
 * home, and both /interior floors. Farm hand capacity is driven by this count,
 * so a bed counts no matter where it lives.
 */
export const getPlacedBedNames = (game: {
  collectibles: Collectibles;
  home: { collectibles: Collectibles };
  interior?: {
    ground: { collectibles: Collectibles };
    level_one?: { collectibles: Collectibles };
  };
}): Set<BedName> =>
  new Set(
    getKeys(BED_FARMHAND_COUNT).filter(
      (bedName) => getCollectiblesAcrossLocations(game, bedName).length > 0,
    ),
  );
