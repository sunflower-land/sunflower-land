/**
 * Cache show timers setting in local storage so we can remember next time we open the HUD.
 */
const LOCAL_STORAGE_KEY = "settings.express";

export function cacheExpressSetting(show: boolean) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(show));
}

export function getExpressSetting(): boolean {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

  return cached ? JSON.parse(cached) : false;
}
