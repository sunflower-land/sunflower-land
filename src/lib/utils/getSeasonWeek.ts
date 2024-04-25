import { SeasonWeek } from "features/game/types/game";
import { SEASONS, getCurrentSeason } from "features/game/types/seasons";
import { ADMIN_IDS } from "lib/flags";

/**
 * Helper function to get the week number of the season
 * @returns week number of the season 1-12
 */
export function getSeasonWeek(): SeasonWeek {
  const now = Date.now();
  const { startDate, endDate } = SEASONS[getCurrentSeason()];
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
 * Helps implement a preseason where tasks are 'frozen'
 * This ensures a smooth transition and testing period.
 */
export function getSeasonChangeover({
  id,
  now = Date.now(),
}: {
  id: number;
  now?: number;
}) {
  const season = getCurrentSeason(new Date(now));
  const incomingSeason = getCurrentSeason(new Date(now + 24 * 60 * 60 * 1000));

  // 24 hours before the season ends
  const tasksCloseAt = SEASONS[season].endDate.getTime() - 24 * 60 * 60 * 1000;

  // 7 days after the season starts
  const tasksStartAt =
    SEASONS[incomingSeason].startDate.getTime() + 7 * 24 * 60 * 60 * 1000;

  const isAdmin = ADMIN_IDS.includes(id);

  return {
    tasksCloseAt,
    tasksStartAt,
    tasksAreClosing:
      now < tasksCloseAt && now >= tasksCloseAt - 24 * 60 * 60 * 1000,
    tasksAreFrozen: !isAdmin && now <= tasksStartAt,
  };
}

/**
 * Helper function to get the week number of the season
 * @returns week number of the season 1-12
 */
export function getSeasonWeekByCreatedAt(createdAt: number): SeasonWeek {
  const now = createdAt;

  const season = getCurrentSeason(new Date(now));
  const { startDate, endDate } = SEASONS[season];
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
