import { FACTION_KITCHEN_START_TIME } from "features/game/events/landExpansion/deliverFactionKitchen";

/**
 *
 * @param startTimeMs start time. Defaults to faction kitchen start time
 * @param now milliseconds since epoch
 * @returns
 */
export function factionKitchenWeekEndTime({
  startTimeMs = FACTION_KITCHEN_START_TIME,
  now = Date.now(),
}: {
  startTimeMs?: number;
  now?: number;
}) {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsInWeek = 7 * millisecondsInDay;
  const millisecondsInWeekMinusOneMs = millisecondsInWeek - 1;

  const weeksSinceStart = Math.floor((now - startTimeMs) / millisecondsInWeek);

  const endOfThisWeek =
    startTimeMs +
    weeksSinceStart * millisecondsInWeek +
    millisecondsInWeekMinusOneMs;

  return endOfThisWeek;
}

/**
 * Get the current week number of the faction kitchen. Starts at week 1.
 * @param startTimeMs start time. Defaults to faction kitchen start time
 * @param now milliseconds since epoch
 * @returns number of weeks since the faction kitchen started or undefined if the faction kitchen has not started yet
 */
export function getCurrentWeekNumber({
  startTimeMs = FACTION_KITCHEN_START_TIME,
  now = Date.now(),
}: {
  startTimeMs?: number;
  now?: number;
}) {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsInWeek = 7 * millisecondsInDay;
  const weeksSinceStart = Math.floor((now - startTimeMs) / millisecondsInWeek);

  if (weeksSinceStart < 0) return;

  return weeksSinceStart + 1;
}
