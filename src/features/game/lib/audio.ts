export enum AudioLocalStorageKeys {
  audioMuted = "settings.audioMuted",
  musicPaused = "settings.musicPaused",
}

export function cacheAudioSetting(
  key: AudioLocalStorageKeys,
  value: boolean | number,
) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCachedAudioSetting<T>(
  key: AudioLocalStorageKeys,
  defaultValue: T,
): T {
  const cached = localStorage.getItem(key);

  return cached ? JSON.parse(cached) : defaultValue;
}
