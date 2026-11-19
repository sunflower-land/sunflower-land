import { getKeys } from "lib/object";
import type { GameState, PlacedItem } from "../types/game";
import { WEATHER_EVENTS, type ScheduledWeatherEvent } from "../types/weather";
import {
  WEATHER_ITEM_EVENTS,
  type WeatherItemName,
} from "../types/weatherItems";
import { GUARDIAN_BOOST } from "./getActiveGuardian";
import { getCollectiblesAcrossLocations } from "./getCollectiblesAcrossLocations";
import { populateSeason } from "./season";

/**
 * The server passes the whole schedule (`WEATHER_SCHEDULE`), so an action
 * saved just after a week rolls over still sees last week's events. The
 * client passes its forecast.
 */
export type WeatherEvents = readonly Readonly<ScheduledWeatherEvent>[];

type Game = GameState;

/** The events reducers read: the forecast the server sent. */
export const getWeatherEvents = (game: Game): WeatherEvents =>
  game.weather?.forecast ?? [];

/** Was the Guardian of `startAt`'s season placed at that instant? */
function isGuardianOutAt(game: Game, startAt: number): boolean {
  const { season } = populateSeason(startAt);
  const guardian = getKeys(GUARDIAN_BOOST).find(
    (name) => GUARDIAN_BOOST[name].season === season,
  );
  if (!guardian) return false;

  const placed = getCollectiblesAcrossLocations(game, guardian).some(
    (placement) =>
      !!placement.coordinates && (placement.placedAt ?? 0) <= startAt,
  );
  const wasPlaced = (game.boostHistory?.[guardian] ?? []).some(
    (window) => window.from <= startAt && startAt < window.to,
  );

  return placed || wasPlaced;
}

/**
 * A threat item isn't used on an event its season's Guardian already covered
 * from the start. Positive-event items stack with the Guardian, so they are.
 */
function isCoveredByGuardian(
  game: Game,
  event: Readonly<ScheduledWeatherEvent>,
): boolean {
  return (
    WEATHER_EVENTS[event.name].kind === "threat" &&
    isGuardianOutAt(game, event.startAt)
  );
}

/**
 * The event a copy placed over `[from, to)` was used on: the first matching
 * event it was out for any part of. Lifted at the very moment an event
 * starts, it never covered it.
 */
export function findUsedEvent({
  game,
  item,
  from,
  to,
  events,
}: {
  game: Game;
  item: WeatherItemName;
  from: number;
  to: number;
  events: WeatherEvents;
}): Readonly<ScheduledWeatherEvent> | undefined {
  const name = WEATHER_ITEM_EVENTS[item];

  return events.find(
    (event) =>
      event.name === name &&
      event.startAt < to &&
      from < event.endAt &&
      !isCoveredByGuardian(game, event),
  );
}

/**
 * Where to look for the event a copy was used on: since it was placed, or
 * since the events the server already settled, whichever is later.
 */
export const getUnsettledFrom = (
  placement: Pick<PlacedItem, "placedAt" | "weatherCheckedUntil">,
  placedAt = placement.placedAt,
) => Math.max(placedAt ?? 0, placement.weatherCheckedUntil ?? 0);

/**
 * The end of the event this copy was used on, or undefined while it's unused.
 * A stored `usedUntil` wins; otherwise it's derived from the copy's current
 * placement.
 */
export function getUsedUntil({
  game,
  item,
  placement,
  events,
  now,
}: {
  game: Game;
  item: WeatherItemName;
  placement: PlacedItem;
  events: WeatherEvents;
  now: number;
}): number | undefined {
  if (placement.usedUntil !== undefined) return placement.usedUntil;
  if (!placement.coordinates) return undefined;

  return findUsedEvent({
    game,
    item,
    from: getUnsettledFrom(placement),
    to: now,
    events,
  })?.endAt;
}

/** Used on an event that has ended, and not renewed since. */
export function isWeatherItemGreyed(
  args: Parameters<typeof getUsedUntil>[0],
): boolean {
  const usedUntil = getUsedUntil(args);

  return usedUntil !== undefined && usedUntil <= args.now;
}

/**
 * The item's event, when a placed copy covers it at `now`: one that is unused
 * or was used on this same event (lifted and placed back). The event tickets
 * read this.
 */
export function getWeatherItemCover({
  game,
  item,
  events,
  now,
}: {
  game: Game;
  item: WeatherItemName;
  events: WeatherEvents;
  now: number;
}): Readonly<ScheduledWeatherEvent> | undefined {
  const event = events.find(
    (event) =>
      event.name === WEATHER_ITEM_EVENTS[item] &&
      event.startAt <= now &&
      now < event.endAt,
  );
  if (!event) return undefined;

  const covers = getCollectiblesAcrossLocations(game, item).some(
    (placement) => {
      if (!placement.coordinates) return false;

      const usedUntil = getUsedUntil({ game, item, placement, events, now });

      return usedUntil === undefined || usedUntil === event.endAt;
    },
  );

  return covers ? event : undefined;
}
