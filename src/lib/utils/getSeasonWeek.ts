import { SeasonWeek } from "features/game/types/game";
import { CHAPTERS, getCurrentChapter } from "features/game/types/chapters";
import { ADMIN_IDS } from "lib/access";

/**
 * Helper function to get the week number of the season
 * @returns week number of the season 1-12
 */
export function getSeasonWeek(now: number): SeasonWeek {
  const { startDate, endDate } = CHAPTERS[getCurrentChapter(now)];
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
export function getChapterChangeover({
  id,
  now = Date.now(),
}: {
  id: number;
  now?: number;
}) {
  const season = getCurrentChapter(now);

  const tasksCloseAt = CHAPTERS[season].endDate.getTime();

  // 7 days after the season starts
  const tasksStartAt =
    CHAPTERS[season].startDate.getTime() + 7 * 24 * 60 * 60 * 1000;

  const isAdmin = ADMIN_IDS.includes(id);

  return {
    tasksCloseAt,
    tasksStartAt,
    ticketTasksAreClosing:
      now < tasksCloseAt && now >= tasksCloseAt - 24 * 60 * 60 * 1000,
    ticketTasksAreFrozen:
      !isAdmin &&
      now >= CHAPTERS[season].startDate.getTime() &&
      now <= tasksStartAt,
  };
}

/**
 * The days that Bumpkins are on holiday (no deliveries)
 */
export const HOLIDAYS: string[] = [
  "2024-11-01",
  "2024-11-02",
  "2024-11-03",
  "2024-11-04",
  "2024-11-05",

  "2025-02-01",
  "2025-02-02",
  "2025-02-03",
  "2025-02-04",
  "2025-02-05",
  "2025-02-06",
  "2025-02-07",
  "2025-02-08",
  "2025-02-09",

  // Start of Great Bloom
  "2025-05-01",
  "2025-05-02",
  "2025-05-03",
  "2025-05-04",

  // Start of Better Together
  "2025-08-04",
  "2025-08-05",
  "2025-08-06",
  "2025-08-07",
  "2025-08-08",
  "2025-08-09",
  "2025-08-10",

  // Start of Paw Prints
  "2025-11-03",
  "2025-11-04",
  "2025-11-05",
  "2025-11-06",
  "2025-11-07",
  "2025-11-08",
  "2025-11-09",

  // Start of Crabs and Traps
  "2026-02-02",
  "2026-02-03",
  "2026-02-04",
  "2026-02-05",
  "2026-02-06",
  "2026-02-07",
  "2026-02-08",
];

export function getBumpkinHoliday({ now }: { now: number }) {
  // Get upcoming holiday, return today if there is one today.
  const todayKey = new Date(now).toISOString().split("T")[0];

  if (HOLIDAYS.includes(todayKey)) {
    return { holiday: todayKey };
  }

  const nextHoliday = HOLIDAYS.find(
    (holiday) => new Date(holiday) > new Date(now),
  );

  return { holiday: nextHoliday };
}

/**
 * Helper function to get the week number of the season
 * @returns week number of the season 1-12
 */
export function getSeasonWeekByCreatedAt(createdAt: number): SeasonWeek {
  const now = createdAt;

  const season = getCurrentChapter(now);
  const { startDate, endDate } = CHAPTERS[season];
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
