import { getKeys } from "lib/object";
import type { GameState, PlacedItem } from "../types/game";
import {
  WEATHER_EVENTS,
  type ScheduledWeatherEvent,
  type WeatherEventName,
} from "../types/weather";
import {
  WEATHER_ITEM_EVENTS,
  type WeatherItemName,
} from "../types/weatherItems";
import { GUARDIAN_BOOST, type SeasonGuardianName } from "./getActiveGuardian";
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

/** The Guardian of `startAt`'s season, if it was placed at that instant. */
function getGuardianOutAt(
  game: Game,
  startAt: number,
): SeasonGuardianName | undefined {
  const { season } = populateSeason(startAt);
  const guardian = getKeys(GUARDIAN_BOOST).find(
    (name) => GUARDIAN_BOOST[name].season === season,
  );
  if (!guardian) return undefined;

  const placed = getCollectiblesAcrossLocations(game, guardian).some(
    (placement) =>
      !!placement.coordinates && (placement.placedAt ?? 0) <= startAt,
  );
  const wasPlaced = (game.boostHistory?.[guardian] ?? []).some(
    (window) => window.from <= startAt && startAt < window.to,
  );

  return placed || wasPlaced ? guardian : undefined;
}

const isGuardianOutAt = (game: Game, startAt: number) =>
  !!getGuardianOutAt(game, startAt);

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

/** A stretch of time a weather item covered its event. */
export type CoverWindow = { from: number; to: number };

/**
 * The part of `[from, to)` a copy covered its event for: the event its
 * stored mark points at, or else the first one it was out for. Nothing when
 * it covered none, e.g. placed back after it was used.
 */
export function getCoveredWindow({
  game,
  item,
  placement,
  from,
  to,
  events,
}: {
  game: Game;
  item: WeatherItemName;
  placement: Pick<PlacedItem, "placedAt" | "usedUntil" | "weatherCheckedUntil">;
  from: number;
  to: number;
  events: WeatherEvents;
}): CoverWindow | undefined {
  const event =
    placement.usedUntil !== undefined
      ? events.find(
          (event) =>
            event.name === WEATHER_ITEM_EVENTS[item] &&
            event.endAt === placement.usedUntil,
        )
      : findUsedEvent({
          game,
          item,
          from: getUnsettledFrom(placement, from),
          to,
          events,
        });
  if (!event) return undefined;

  const window = {
    from: Math.max(from, event.startAt),
    to: Math.min(to, event.endAt),
  };

  return window.to > window.from ? window : undefined;
}

/**
 * Every stretch the item covers its event for, for effects that run as time
 * windows: the windows kept when copies were lifted or renewed, plus each
 * placed copy's window on the event it is used on. An unused copy covers the
 * next event in advance; lifting it ends the window there.
 */
export function getWeatherItemCoverWindows({
  game,
  item,
  events,
}: {
  game: Game;
  item: WeatherItemName;
  events: WeatherEvents;
}): CoverWindow[] {
  const kept = (game.boostHistory?.[item] ?? []).map(({ from, to }) => ({
    from,
    to,
  }));

  const placed = getCollectiblesAcrossLocations(game, item).flatMap(
    (placement) => {
      if (!placement.coordinates) return [];

      const window = getCoveredWindow({
        game,
        item,
        placement,
        from: placement.placedAt ?? 0,
        to: Number.MAX_SAFE_INTEGER,
        events,
      });

      return window ? [window] : [];
    },
  );

  return [...kept, ...placed];
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

/**
 * The threat `name` running at `now`, unless it's covered: by the season's
 * Guardian out when it started, or by its weather item placed now. The event
 * tickets apply their penalty while this returns an event.
 */
export function getUnprotectedThreat({
  game,
  name,
  events,
  now,
}: {
  game: Game;
  name: WeatherEventName;
  events: WeatherEvents;
  now: number;
}): Readonly<ScheduledWeatherEvent> | undefined {
  const event = events.find(
    (event) => event.name === name && event.startAt <= now && now < event.endAt,
  );
  if (!event || isCoveredByGuardian(game, event)) return undefined;

  const item = getKeys(WEATHER_ITEM_EVENTS).find(
    (item) => WEATHER_ITEM_EVENTS[item] === name,
  );
  if (item && getWeatherItemCover({ game, item, events, now })) {
    return undefined;
  }

  return event;
}

export type WindfallName = Extract<
  WeatherEventName,
  "bountifulHarvest" | "fishFrenzy"
>;

/** What each windfall adds per harvest or catch, before the Guardian. */
export const WINDFALL_BONUS: Record<WindfallName, number> = {
  bountifulHarvest: 0.4,
  fishFrenzy: 0.4,
};

/**
 * What the windfall `name` adds at `now`: its bonus while it runs, doubled
 * when its season's Guardian was out when it started (the Guardian is
 * decided at the start, like for threats).
 */
export function getWindfallBonus({
  game,
  name,
  events,
  now,
}: {
  game: Game;
  name: WindfallName;
  events: WeatherEvents;
  now: number;
}): { amount: number; guardian?: SeasonGuardianName } {
  const event = events.find(
    (event) => event.name === name && event.startAt <= now && now < event.endAt,
  );
  if (!event) return { amount: 0 };

  const guardian = getGuardianOutAt(game, event.startAt);
  if (!guardian) return { amount: WINDFALL_BONUS[name] };

  return { amount: WINDFALL_BONUS[name] * 2, guardian };
}
