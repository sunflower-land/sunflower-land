import { hasFeatureAccess } from "lib/flags";
import type { GameState } from "../types/game";
import type { ScheduledWeatherEvent } from "../types/weather";
import { getUnprotectedThreat, getWeatherEvents } from "./weatherItemCover";

/** The share of the farm's crop plots a Great Freeze locks, rounded. */
export const GREAT_FREEZE_PLOT_SHARE = 0.3;

/**
 * The Great Freeze running at `now` and the plots it locks: the ones the
 * server picked when it started. Nothing is locked while the season's Guardian
 * out at the start, or a Thaw Stone placed now, covers it.
 */
export function getGreatFreezeLock({
  game,
  now,
}: {
  game: GameState;
  now: number;
}):
  | { event: Readonly<ScheduledWeatherEvent>; plotIds: readonly string[] }
  | undefined {
  if (!hasFeatureAccess(game, "WEATHER")) return undefined;

  const pick = game.weather?.greatFreeze;
  if (!pick) return undefined;

  const event = getUnprotectedThreat({
    game,
    name: "greatFreeze",
    events: getWeatherEvents(game),
    now,
  });
  if (!event || event.startAt !== pick.startAt) return undefined;

  return { event, plotIds: pick.plotIds };
}

/** Whether a Great Freeze locks the plot `id` at `now`. */
export const isPlotFrozen = ({
  game,
  id,
  now,
}: {
  game: GameState;
  id: string;
  now: number;
}) => !!getGreatFreezeLock({ game, now })?.plotIds.includes(id);
