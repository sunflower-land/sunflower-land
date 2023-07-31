import { SeasonWeek } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";

/**
 * Helper function to get the week number of the season
 * @param now number representing the current time
 * @returns week number of the season 1-12
 */
export function getSeasonWeek(now: number): SeasonWeek {
  const { startDate, endDate } = SEASONS["Witches' Eve"];
  const endTime = endDate.getTime();
  const startTime = startDate.getTime();

  const timeDiff = now - startTime;
  const totalWeeks = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));

  // Check if the current date is beyond the end date
  if (now >= endTime) {
    throw new Error("The current date is beyond the end date");
  }

  return Math.min(Math.max(totalWeeks + 1, 1), 12) as SeasonWeek; // Return the week number, minimum is 1, maximum is 12
}
