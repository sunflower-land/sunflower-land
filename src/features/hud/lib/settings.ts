import { MasterVolumeControls } from ".././types/settings";

/**
 * Cache settings in local storage so we can remember next time we open the HUD
 * and manage the toggles.
 */
const LOCAL_STORAGE_KEY = "settings.volumeControls";

/**
 * Used to cache settings in browser's localStorage.
 * TODO: Use more generic props to allow various of settings to be cached
 */
export function cacheSettings(volumeControls: MasterVolumeControls) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(volumeControls));

  return volumeControls;
}

/**
 * Used to get cached settings from browser's localStorage.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getSettings(): MasterVolumeControls {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  // [TODO]: Modify to return more generic settings

  if (!cached) {
    return {
      bgMusicPaused: true,
      sfxMuted: false,
    };
  }

  return JSON.parse(cached);
}
