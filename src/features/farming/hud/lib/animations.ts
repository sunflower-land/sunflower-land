/**
 * Cache show timers setting in local storage so we can remember next time we open the HUD.
 */
const LOCAL_STORAGE_KEY = "settings.showAnimations";

export function cacheShowAnimationsSetting(show: boolean) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(show));
}

export function getShowAnimationsSetting(): boolean {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

  return cached ? JSON.parse(cached) : true;
}
