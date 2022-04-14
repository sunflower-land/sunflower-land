import { MasterVolumeControls } from ".././types/settings";

/**
 * Cache settings in local storage so we can remember next time we open the HUD
 * and manage the toggles.
 */
const LOCAL_STORAGE_KEY = "settings.volumeControls";

/**
 * Used to cache settings in browser's localStorage.
 * TODO: Use more generic props to allow multiple types of settings to be cached
 */
export function cacheSettings(volumeControls: MasterVolumeControls) {
  console.log("cacheSettings called\n", volumeControls);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(volumeControls));

  return volumeControls;
}

/**
 * Used to get cached settings from browser's localStorage.
 * TODO: Modify to return more generic settings
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getSettings(): MasterVolumeControls {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  // console.log("getSettings called\ncached settings:", cached);

  if (!cached) {
    // console.log("no cache!!");
    return {
      bgMusicMuted: true,
      sfxMuted: true,
    };
  }

  return JSON.parse(cached);
}
