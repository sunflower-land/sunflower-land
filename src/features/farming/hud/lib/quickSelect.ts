/**
 * Cache show timers setting in local storage so we can remember next time we open the HUD.
 */
const LOCAL_STORAGE_KEY = "settings.enableQuickSelect";

export function cacheEnableQuickSelectSetting(show: boolean) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(show));
}

export function getEnableQuickSelectSetting(): boolean {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

  return cached ? JSON.parse(cached) : true;
}

const FULL_MOON_SEEDS_LOCAL_STORAGE_KEY =
  "settings.showFullMoonSeedsInQuickSelect";

export function cacheShowFullMoonSeedsInQuickSelectSetting(show: boolean) {
  localStorage.setItem(FULL_MOON_SEEDS_LOCAL_STORAGE_KEY, JSON.stringify(show));
}

export function getShowFullMoonSeedsInQuickSelectSetting(): boolean {
  const cached = localStorage.getItem(FULL_MOON_SEEDS_LOCAL_STORAGE_KEY);

  return cached ? JSON.parse(cached) : true;
}
