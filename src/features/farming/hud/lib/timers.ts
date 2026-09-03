/**
 * Cache show timers setting in local storage so we can remember next time we open the HUD.
 */
const LOCAL_STORAGE_KEY = "settings.showTimers";

export function cacheShowTimersSetting(show: boolean) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(show));
}

export function getShowTimersSetting(): boolean {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

  return cached ? JSON.parse(cached) : true;
}

/**
 * Cache the timer reading in local storage.
 *
 * Under the speed-boost model a timer has two readings: the remaining WORK (the
 * default — drains faster than a clock while a boost is active) and the actual
 * wall-clock time until ready. See `timerDisplay.ts`.
 */
const SHOW_ACTUAL_TIME_KEY = "settings.showActualTime";

export function cacheShowActualTimeSetting(show: boolean) {
  localStorage.setItem(SHOW_ACTUAL_TIME_KEY, JSON.stringify(show));
}

export function getShowActualTimeSetting(): boolean {
  const cached = localStorage.getItem(SHOW_ACTUAL_TIME_KEY);

  return cached ? JSON.parse(cached) : false;
}
