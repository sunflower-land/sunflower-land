import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "settings.musicPaused";
const MUSIC_PAUSED_EVENT = "musicPausedChanged";

export function cacheMusicPausedSetting(value: boolean) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(MUSIC_PAUSED_EVENT, { detail: value }));
}

export function getMusicPausedSetting(): boolean {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  return cached ? JSON.parse(cached) : false;
}

export const useIsMusicPaused = () => {
  const [isMusicPaused, setIsMusicPaused] = useState(getMusicPausedSetting());

  const toggleMusicPaused = () => {
    const newValue = !isMusicPaused;
    setIsMusicPaused(newValue);
    cacheMusicPausedSetting(newValue);
  };

  useEffect(() => {
    const handleMusicPausedChange = (event: CustomEvent) => {
      setIsMusicPaused(event.detail);
    };

    window.addEventListener(MUSIC_PAUSED_EVENT as any, handleMusicPausedChange);

    return () => {
      window.removeEventListener(
        MUSIC_PAUSED_EVENT as any,
        handleMusicPausedChange,
      );
    };
  }, []);

  return { isMusicPaused, toggleMusicPaused };
};
