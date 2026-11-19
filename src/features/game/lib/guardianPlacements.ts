import type { GameState } from "../types/game";
import { getKeys } from "lib/object";
import { GUARDIAN_BOOST, type SeasonGuardianName } from "./getActiveGuardian";
import { getCollectiblesAcrossLocations } from "./getCollectiblesAcrossLocations";
import { appendBoostHistory } from "./boostWindows";
import {
  isWeatherItemName,
  WEATHER_ITEM_RECIPES,
  type WeatherItemName,
} from "../types/weatherItems";
import { hasFeatureAccess } from "lib/flags";
import {
  findUsedEvent,
  getUnsettledFrom,
  getWeatherEvents,
} from "./weatherItemCover";

/** `placedAt` of every placed tracked item, keyed by `${name}:${id}`. */
export type GuardianPlacements = Map<string, number | undefined>;

// Read lazily: this module sits in the collectible-event import graph, where
// `GUARDIAN_BOOST` may not be initialised yet at module-evaluation time.
const seasonGuardians = () => getKeys(GUARDIAN_BOOST);

/** Season Guardians, plus the weather items while the Weather flag is on. */
const trackedItems = (
  game: GameState,
): (SeasonGuardianName | WeatherItemName)[] => [
  ...seasonGuardians(),
  ...(hasFeatureAccess(game, "WEATHER") ? getKeys(WEATHER_ITEM_RECIPES) : []),
];

export function snapshotGuardianPlacements(
  game: GameState,
): GuardianPlacements {
  const placements: GuardianPlacements = new Map();

  trackedItems(game).forEach((name) => {
    getCollectiblesAcrossLocations(game, name).forEach((placement) => {
      if (placement.coordinates) {
        placements.set(`${name}:${placement.id}`, placement.placedAt);
      }
    });
  });

  return placements;
}

/**
 * Keep the placed periods of season Guardians (their sunshower boost windows
 * are built from them, see `getSunshowerGuardianWindows`) and of weather items
 * (see `weatherItemCover`). Compares against a snapshot taken before the event:
 * an item that became placed gets `placedAt = now`, and one that was lifted (or
 * deleted) has its placed period archived into `boostHistory`. A weather item
 * lifted after its event started is marked used on that event. Diffing, rather
 * than hooking each code path, covers every way an event can place or lift a
 * collectible (single place/remove, remove-all, arrangements, layouts). Mutates
 * `game` in place (immer-draft friendly).
 */
export function syncGuardianPlacements(
  game: GameState,
  before: GuardianPlacements,
  now: number,
): void {
  const seen = new Set<string>();
  const names = trackedItems(game);

  names.forEach((name) => {
    getCollectiblesAcrossLocations(game, name).forEach((placement) => {
      const key = `${name}:${placement.id}`;
      seen.add(key);

      const wasPlaced = before.has(key);

      if (placement.coordinates && !wasPlaced) {
        placement.placedAt = now;
      } else if (!placement.coordinates && wasPlaced) {
        const from = before.get(key) ?? 0;

        if (isWeatherItemName(name) && placement.usedUntil === undefined) {
          const used = findUsedEvent({
            game,
            item: name,
            from: getUnsettledFrom(placement, from),
            to: now,
            events: getWeatherEvents(game),
          });
          if (used) placement.usedUntil = used.endAt;
        }

        appendBoostHistory(game, name, { from, to: now }, now);
        delete placement.placedAt;
      }
    });
  });

  before.forEach((placedAt, key) => {
    if (seen.has(key)) return;

    const name = names.find((item) => key.startsWith(`${item}:`));
    if (!name) return;

    appendBoostHistory(game, name, { from: placedAt ?? 0, to: now }, now);
  });
}
