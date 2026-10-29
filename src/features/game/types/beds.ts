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
  "Cloud Bed": 13,
  "Miner's Bed": 14,
};

/**
 * The distinct bed types placed across every placement surface — the farm, the
 * home, and both /interior floors. Farm hand capacity is driven by this count,
 * so a bed counts no matter where it lives.
 *
 * Only beds that are actually placed (have `coordinates`) count. A bed that was
 * picked up keeps an entry with `removedAt` and no coordinates; the API's
 * `farmHand.unlocked` handler ignores those, so counting them here would show a
 * bed as sleepable and then fail server-side with "No beds available".
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
    getKeys(BED_FARMHAND_COUNT).filter((bedName) =>
      getCollectiblesAcrossLocations(game, bedName).some(
        (bed) => !!bed.coordinates,
      ),
    ),
  );
