import { SeasonWeek } from "features/game/types/game";
import { SEASONS, getCurrentSeason } from "features/game/types/seasons";

/**
 * Helper function to get the week number of the season
 * @returns week number of the season 1-12
 */
export function getSeasonWeek(): SeasonWeek {
  const now = Date.now();
  const { startDate, endDate } = SEASONS["Witches' Eve"];
  const endTime = endDate.getTime();
  const startTime = startDate.getTime();

  const timeDiff = now - startTime;
  const totalWeeks = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));

  // Check if the current date is beyond the end date
  if (now >= endTime) {
    throw new Error("The current date is beyond the end date");
  }

  return Math.min(Math.max(totalWeeks + 1, 1), 13) as SeasonWeek; // Return the week number, minimum is 1, maximum is 12
}

/**
 *
 */
export function getSeasonTasksEndAt(): number {
  const currentSeason = getCurrentSeason();

  return SEASONS[currentSeason].endDate.getTime() - 24 * 60 * 60 * 1000;
}

/**
 * When seasonal activities can commence (3 hrs after start)
 */
export function getSeasonTasksStartAt(): number {
  let season = getCurrentSeason();

  const tasksHaveEnded = getSeasonTasksEndAt() > Date.now();

  // Return next season
  if (tasksHaveEnded) {
    season = getCurrentSeason(new Date(Date.now() + 36 * 60 * 60 * 1000));
  }

  return SEASONS[season].startDate.getTime() + 3 * 60 * 60 * 1000;
}

/**
 * Helps implement a preseason where tasks are 'frozen'
 * This ensures a smooth transition and testing period.
 */
export function getSeasonChangeover(now = Date.now()) {
  const season = getCurrentSeason(new Date(now));
  const incomingSeason = getCurrentSeason(new Date(now + 24 * 60 * 60 * 1000));

  const tasksCloseAt = SEASONS[season].endDate.getTime() - 24 * 60 * 60 * 1000;
  const tasksStartAt =
    SEASONS[incomingSeason].startDate.getTime() + 3 * 60 * 60 * 1000;

  return {
    tasksCloseAt,
    tasksStartAt,
    tasksAreClosing:
      now < tasksCloseAt && now >= tasksCloseAt - 24 * 60 * 60 * 1000,
    tasksAreFrozen: now <= tasksStartAt,
  };
}
