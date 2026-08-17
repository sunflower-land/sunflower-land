import { useState, useEffect } from "react";

export type VolumeChannel = "music" | "sfx" | "ambience";

const STORAGE_KEYS: Record<VolumeChannel, string> = {
  music: "settings.musicVolume",
  sfx: "settings.sfxVolume",
  ambience: "settings.ambienceVolume",
};

export const VOLUME_CHANGED_EVENT = "audioVolumeChanged";

export interface VolumeChangedDetail {
  channel: VolumeChannel;
  value: number;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function getVolumeSetting(channel: VolumeChannel): number {
  const cached = localStorage.getItem(STORAGE_KEYS[channel]);
  const value = cached ? Number(JSON.parse(cached)) : NaN;
  return Number.isFinite(value) ? clamp(value) : 1;
}

export function cacheVolumeSetting(channel: VolumeChannel, value: number) {
  const clamped = clamp(value);
  localStorage.setItem(STORAGE_KEYS[channel], JSON.stringify(clamped));
  window.dispatchEvent(
    new CustomEvent<VolumeChangedDetail>(VOLUME_CHANGED_EVENT, {
      detail: { channel, value: clamped },
    }),
  );
}

export const useAudioVolume = (channel: VolumeChannel) => {
  const [volume, setVolumeState] = useState(getVolumeSetting(channel));

  const setVolume = (value: number) => {
    setVolumeState(clamp(value));
    cacheVolumeSetting(channel, value);
  };

  useEffect(() => {
    const handleVolumeChange = (event: CustomEvent<VolumeChangedDetail>) => {
      if (event.detail.channel === channel) {
        setVolumeState(event.detail.value);
      }
    };

    window.addEventListener(VOLUME_CHANGED_EVENT as any, handleVolumeChange);

    return () => {
      window.removeEventListener(
        VOLUME_CHANGED_EVENT as any,
        handleVolumeChange,
      );
    };
  }, [channel]);

  return { volume, setVolume };
};
