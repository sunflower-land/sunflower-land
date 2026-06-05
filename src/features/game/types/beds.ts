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

const EMPTY_COLLECTIBLES: Collectibles = {};

/**
 * The distinct bed types placed across the given placement surfaces.
 *
 * Farm hand capacity is driven by the number of distinct beds placed, so a bed
 * must count no matter where it lives — the farm (`collectibles`), the home
 * interior (`home.collectibles`) or the /interior floors (`interior.ground`
 * and `interior.level_one`). Pass every relevant surface; `undefined` ones
 * (e.g. a not-yet-unlocked level) are skipped.
 */
export const getPlacedBedNames = (
  placements: Array<Collectibles | undefined>,
): Set<BedName> =>
  new Set(
    placements.flatMap((collectibles) =>
      getKeys(collectibles ?? EMPTY_COLLECTIBLES).filter(
        (name): name is BedName => name in BED_FARMHAND_COUNT,
      ),
    ),
  );
