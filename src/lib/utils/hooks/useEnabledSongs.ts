import { useState, useEffect } from "react";

// Stored as a list of DISABLED song ids so that newly added songs are
// included in the rotation by default.
const LOCAL_STORAGE_KEY = "settings.disabledSongs";
const ENABLED_SONGS_EVENT = "enabledSongsChanged";

// The classic originals start out of the rotation - opt back in via the panel
const DEFAULT_DISABLED = ["willow_tree", "mountain_escape"];

export function getDisabledSongs(): string[] {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached === null) return DEFAULT_DISABLED;
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === "string")
      : DEFAULT_DISABLED;
  } catch {
    return DEFAULT_DISABLED;
  }
}

function cacheDisabledSongs(ids: string[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(ENABLED_SONGS_EVENT, { detail: ids }));
}

export const useEnabledSongs = () => {
  const [disabledSongs, setDisabledSongs] =
    useState<string[]>(getDisabledSongs());

  const toggleSong = (id: string) => {
    const current = getDisabledSongs();
    const next = current.includes(id)
      ? current.filter((songId) => songId !== id)
      : [...current, id];
    setDisabledSongs(next);
    cacheDisabledSongs(next);
  };

  useEffect(() => {
    const handleChange = (event: CustomEvent<string[]>) => {
      setDisabledSongs(event.detail);
    };

    window.addEventListener(ENABLED_SONGS_EVENT as any, handleChange);

    return () => {
      window.removeEventListener(ENABLED_SONGS_EVENT as any, handleChange);
    };
  }, []);

  return {
    isSongEnabled: (id: string) => !disabledSongs.includes(id),
    toggleSong,
  };
};
