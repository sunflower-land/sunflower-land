import type {
  GameState,
  InventoryItemName,
  TemperateSeasonName,
} from "../types/game";
import { getObjectEntries } from "lib/object";
import { isCollectibleBuilt } from "./collectibleBuilt";

type SeasonGuardianName = Extract<
  InventoryItemName,
  "Winter Guardian" | "Spring Guardian" | "Autumn Guardian" | "Summer Guardian"
>;

export const GUARDIAN_BOOST: Record<
  SeasonGuardianName,
  { season: TemperateSeasonName }
> = {
  "Spring Guardian": { season: "spring" },
  "Summer Guardian": { season: "summer" },
  "Autumn Guardian": { season: "autumn" },
  "Winter Guardian": { season: "winter" },
};

/**
 * The season Guardian collectible currently active — one whose matching season is
 * the in-game season AND which is built — or `undefined` when none is.
 *
 * Lives in its own leaf module importing only cycle-free helpers, mirroring the
 * BE structure so `boostWindows` imports an identical `./getActiveGuardian` path
 * in both repos (and stays cycle-free). Previously hosted in `types/calendar`.
 */
export const getActiveGuardian = ({
  game,
}: {
  game: GameState;
}): {
  activeGuardian: SeasonGuardianName | undefined;
} => {
  const guardian = getObjectEntries(GUARDIAN_BOOST).find(
    ([guardian, { season }]) =>
      season === game.season.season &&
      isCollectibleBuilt({ game, name: guardian }),
  );

  if (!guardian) return { activeGuardian: undefined };

  const [guardianName] = guardian;
  return { activeGuardian: guardianName };
};
