import type { GameState } from "../types/game";
import { getKeys } from "lib/object";
import { GUARDIAN_BOOST } from "./getActiveGuardian";
import { getCollectiblesAcrossLocations } from "./getCollectiblesAcrossLocations";
import { appendBoostHistory } from "./boostWindows";

/** `placedAt` of every placed season Guardian, keyed by `${name}:${id}`. */
export type GuardianPlacements = Map<string, number | undefined>;

// Read lazily: this module sits in the collectible-event import graph, where
// `GUARDIAN_BOOST` may not be initialised yet at module-evaluation time.
const seasonGuardians = () => getKeys(GUARDIAN_BOOST);

export function snapshotGuardianPlacements(
  game: GameState,
): GuardianPlacements {
  const placements: GuardianPlacements = new Map();

  seasonGuardians().forEach((name) => {
    getCollectiblesAcrossLocations(game, name).forEach((placement) => {
      if (placement.coordinates) {
        placements.set(`${name}:${placement.id}`, placement.placedAt);
      }
    });
  });

  return placements;
}

/**
 * Keep season Guardians' placed periods, which their sunshower boost windows are
 * built from (see `getSunshowerGuardianWindows`). Compares against a snapshot
 * taken before the event: a Guardian that became placed gets `placedAt = now`,
 * and one that was lifted (or deleted) has its placed period archived into
 * `boostHistory`. Diffing, rather than hooking each code path, covers every way
 * an event can place or lift a collectible (single place/remove, remove-all,
 * arrangements, layouts). Mutates `game` in place (immer-draft friendly).
 */
export function syncGuardianPlacements(
  game: GameState,
  before: GuardianPlacements,
  now: number,
): void {
  const seen = new Set<string>();

  seasonGuardians().forEach((name) => {
    getCollectiblesAcrossLocations(game, name).forEach((placement) => {
      const key = `${name}:${placement.id}`;
      seen.add(key);

      const wasPlaced = before.has(key);

      if (placement.coordinates && !wasPlaced) {
        placement.placedAt = now;
      } else if (!placement.coordinates && wasPlaced) {
        appendBoostHistory(
          game,
          name,
          { from: before.get(key) ?? 0, to: now },
          now,
        );
        delete placement.placedAt;
      }
    });
  });

  before.forEach((placedAt, key) => {
    if (seen.has(key)) return;

    const name = seasonGuardians().find((guardian) =>
      key.startsWith(`${guardian}:`),
    )!;
    appendBoostHistory(game, name, { from: placedAt ?? 0, to: now }, now);
  });
}
