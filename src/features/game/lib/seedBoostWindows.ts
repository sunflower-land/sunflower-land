import { hasFeatureAccess } from "lib/flags";
import type { GameState } from "../types/game";
import type { SeedName } from "../types/seeds";
import type { ResourceName, RockName } from "../types/resources";
import { isFlowerSeed } from "../types/flowers";
import { GREENHOUSE_FRUIT_SEEDS, isPatchFruitSeed } from "../types/fruits";
import { GREENHOUSE_SEEDS } from "../types/crops";
import { SEED_TO_PLANT } from "../events/landExpansion/plantGreenhouse";
import {
  getCropPlotBoostWindows,
  getFlowerBoostWindows,
  getFruitBoostWindows,
  getGreenhouseBoostWindows,
  getMineBoostWindows,
  getOilBoostWindows,
  getTreeBoostWindows,
  type BoostWindow,
} from "./boostWindows";

/**
 * Which speed windows would apply to a task the player has NOT started yet.
 *
 * The in-world timers read their windows from the node they belong to; the
 * pre-action panels (seed shop, guides) have only the thing being considered, so
 * they resolve the activity from that. Anything unrecognised — or an activity
 * that was never migrated to the windowed model — yields an empty set, which
 * makes `projectSeconds` the identity.
 *
 * Gated on `SPEED_BOOSTS` — unlike the in-world timers, which key off the node's
 * `baseDurationMs` marker. Nothing has been started here, so there is no marker to
 * read: a task begun without the flag is timed by the legacy baked model, where the
 * boosters are already folded into the number the panel shows and listed by name in
 * `boostsUsed`. Returning windows anyway made those panels state the same boost
 * twice — "x0.75 Moth Shrine" beside "Speed: 1.35x Moth Shrine".
 */
export function getSeedBoostWindows(
  game: GameState,
  seed: SeedName,
): BoostWindow[] {
  if (!hasFeatureAccess(game, "SPEED_BOOSTS")) return [];

  if (isFlowerSeed(seed)) return getFlowerBoostWindows(game);
  if (isPatchFruitSeed(seed)) return getFruitBoostWindows(game);

  if (seed in GREENHOUSE_SEEDS || seed in GREENHOUSE_FRUIT_SEEDS) {
    return getGreenhouseBoostWindows(
      game,
      SEED_TO_PLANT[seed as keyof typeof SEED_TO_PLANT],
    );
  }

  return getCropPlotBoostWindows(game);
}

/** As `getSeedBoostWindows`, for a resource node's recovery (the Tools Guide). */
export function getNodeBoostWindows(
  game: GameState,
  node: ResourceName,
): BoostWindow[] {
  if (!hasFeatureAccess(game, "SPEED_BOOSTS")) return [];

  if (node === "Tree") return getTreeBoostWindows(game);
  if (node === "Oil Reserve") return getOilBoostWindows(game);
  if (node.endsWith("Rock")) return getMineBoostWindows(game, node as RockName);

  // Water traps, salt and everything else were never windowed.
  return [];
}
