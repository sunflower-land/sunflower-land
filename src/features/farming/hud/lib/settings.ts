/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BgMusicPausedControl,
  SfxMutedControl,
  MasterVolumeControls,
} from ".././types/settings";

/**
 * Cache settings in local storage so we can remember next time we open the HUD
 * and manage the toggles.
 */
const LOCAL_STORAGE_KEY_BG_MUSIC = "settings.bgMusic";
const LOCAL_STORAGE_KEY_SFX = "settings.SFX";

/**
 * Used to cache settings in browser's localStorage.
 * TODO: Use more generic props to allow various settings to be cached
 */
export function cacheSettings(forKey: BgMusicPausedControl | SfxMutedControl) {
  try {
    (forKey as any).isBgMusicPaused === undefined
      ? localStorage.setItem(
          LOCAL_STORAGE_KEY_SFX,
          JSON.stringify(forKey as any)
        )
      : localStorage.setItem(
          LOCAL_STORAGE_KEY_BG_MUSIC,
          JSON.stringify(forKey as any)
        );
  } catch (e: any) {
    console.warn(
      "Unable to Store the settings in localStorage!\nPossible Fix: Enable storage for sunflower-land(dot)com/play\nerror:",
      e
    );
  }

  return forKey;
}

/**
 * Used to get cached music/sfx settings from browser's localStorage.
 */
export function getSettings(
  forKey: "BgMusicPausedControl" | "SfxMutedControl"
): BgMusicPausedControl | SfxMutedControl {
  // [TODO]: Modify to return more generic settings

  if (forKey === "SfxMutedControl") {
    const cachedSfxMuted = localStorage.getItem(LOCAL_STORAGE_KEY_SFX);

    if (!cachedSfxMuted) {
      return {
        isSfxMuted: false,
      };
    }
    return JSON.parse(cachedSfxMuted);
  } else {
    const cachedBgMusicPaused = localStorage.getItem(
      LOCAL_STORAGE_KEY_BG_MUSIC
    );

    if (!cachedBgMusicPaused) {
      return {
        isBgMusicPaused: false,
      };
    }
    return JSON.parse(cachedBgMusicPaused);
  }
}

export function getAllSettings(): MasterVolumeControls {
  const cached = {
    isBgMusicPaused: (getSettings("BgMusicPausedControl") as any)
      .isBgMusicPaused as boolean,
    isSfxMuted: (getSettings("SfxMutedControl") as any).isSfxMuted as boolean,
  };

  return cached as unknown as MasterVolumeControls;
}
