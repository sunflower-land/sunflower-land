import { SeasonWeek } from "features/game/types/game";
import {
  CHAPTERS,
  CHAPTER_ORDER,
  ChapterName,
  getCurrentChapter,
} from "features/game/types/chapters";
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
 * From this chapter onwards, holidays are computed deterministically:
 * the holiday window runs from the chapter's startDate (inclusive) until
 * midnight UTC of the 2nd Monday of the chapter's start month (exclusive).
 *
 * Chapters before this still use the hardcoded HOLIDAYS list below.
 */
const COMPUTED_HOLIDAY_FROM_CHAPTER: ChapterName = "Salt Awakening";

function isComputedHolidayChapter(chapter: ChapterName): boolean {
  return CHAPTER_ORDER[chapter] >= CHAPTER_ORDER[COMPUTED_HOLIDAY_FROM_CHAPTER];
}

/**
 * Returns the holiday window for a chapter using the 2nd-Monday rule.
 * `start` is inclusive, `end` is exclusive (midnight UTC of the 2nd Monday).
 */
export function getChapterHolidayPeriod(chapter: ChapterName): {
  start: Date;
  end: Date;
} {
  const start = CHAPTERS[chapter].startDate;
  const year = start.getUTCFullYear();
  const monthIdx = start.getUTCMonth();

  const firstOfMonth = new Date(Date.UTC(year, monthIdx, 1));
  const dayOfWeek = firstOfMonth.getUTCDay(); // 0 = Sun … 1 = Mon … 6 = Sat
  const daysToFirstMonday = (1 - dayOfWeek + 7) % 7;
  const secondMondayDay = 1 + daysToFirstMonday + 7;

  const end = new Date(Date.UTC(year, monthIdx, secondMondayDay));

  return { start, end };
}

/**
 * The holiday window for the chapter that contains `now`, or undefined if
 * the chapter has no holiday. Used by tests to step around the freeze.
 */
export function getCurrentChapterHolidayPeriod(
  now: number,
): { start: Date; end: Date } | undefined {
  const chapter = getCurrentChapter(now);

  if (isComputedHolidayChapter(chapter)) {
    return getChapterHolidayPeriod(chapter);
  }

  const chapterStart = CHAPTERS[chapter].startDate.getTime();
  const chapterEnd = CHAPTERS[chapter].endDate.getTime();
  const inChapter = HOLIDAYS.filter((d) => {
    const t = new Date(d).getTime();
    return t >= chapterStart && t < chapterEnd;
  });
  if (inChapter.length === 0) return undefined;

  const start = new Date(inChapter[0]);
  const lastDay = new Date(inChapter[inChapter.length - 1]);
  const end = new Date(lastDay.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

/**
 * The days that Bumpkins are on holiday (no deliveries) — legacy, hand-maintained.
 * Only covers chapters before {@link COMPUTED_HOLIDAY_FROM_CHAPTER}; from that
 * chapter onwards holidays are computed via {@link getChapterHolidayPeriod}.
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

export function getBumpkinHoliday({ now }: { now: number }): {
  holiday: string | undefined;
} {
  const todayKey = new Date(now).toISOString().split("T")[0];

  // Active legacy holiday today
  if (HOLIDAYS.includes(todayKey)) {
    return { holiday: todayKey };
  }

  // Active computed holiday today, and earliest upcoming computed holiday.
  // Iterate directly so we don't call getCurrentChapter() for timestamps
  // that fall outside any chapter range (e.g. createdAt: 0).
  let nextComputed: string | undefined;
  for (const chapter of Object.keys(CHAPTERS) as ChapterName[]) {
    if (!isComputedHolidayChapter(chapter)) continue;
    const { start, end } = getChapterHolidayPeriod(chapter);
    if (now >= start.getTime() && now < end.getTime()) {
      return { holiday: todayKey };
    }
    if (!nextComputed && start.getTime() > now) {
      nextComputed = start.toISOString().split("T")[0];
    }
  }

  // Next upcoming legacy holiday.
  const nextLegacy = HOLIDAYS.find(
    (holiday) => new Date(holiday).getTime() > now,
  );

  if (nextLegacy && nextComputed) {
    return { holiday: nextLegacy < nextComputed ? nextLegacy : nextComputed };
  }
  return { holiday: nextLegacy ?? nextComputed };
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
