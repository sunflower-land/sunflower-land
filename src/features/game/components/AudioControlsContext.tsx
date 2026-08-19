import React, { createContext, useContext, useEffect } from "react";
import { Howler } from "howler";
import type { Song } from "assets/songs/playlist";
import { useIsAudioMuted } from "lib/utils/hooks/useIsAudioMuted";
import { useIsMusicPaused } from "lib/utils/hooks/useIsMusicPaused";
import { useAudioVolume } from "lib/utils/hooks/useAudioVolume";

// The authored mix level of the music player at a full music slider
const MUSIC_BASE_VOLUME = 0.15;

export interface AudioControls {
  musicPlayer: React.RefObject<HTMLAudioElement | null>;
  song: Song;
  handlePreviousSong: () => void;
  handleNextSong: () => void;
  handlePlaySong: (id: string) => void;
}

const AudioControlsContext = createContext<AudioControls | null>(null);

export const AudioControlsProvider: React.FC<
  AudioControls & { children: React.ReactNode }
> = ({ children, ...controls }) => {
  const { musicPlayer } = controls;
  const { isAudioMuted } = useIsAudioMuted();
  const { isMusicPaused } = useIsMusicPaused();
  const { volume: musicVolume } = useAudioVolume("music");

  useEffect(() => {
    Howler.mute(isAudioMuted);
  }, [isAudioMuted]);

  useEffect(() => {
    const player = musicPlayer.current;
    if (!player) return;

    // Modifying HTMLAudioElement properties is necessary for audio control
    // eslint-disable-next-line react-hooks/immutability
    player.volume = MUSIC_BASE_VOLUME * musicVolume;

    if (isMusicPaused) {
      player.pause();
    } else {
      player.play();
      player.muted = isAudioMuted;
    }
  }, [isMusicPaused, isAudioMuted, musicVolume, musicPlayer]);

  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
    const handleVisibilityChange = () => {
      const player = musicPlayer.current;
      if (!player) return;

      if (document.visibilityState === "visible") {
        if (!isMusicPaused) {
          player.play();
          player.muted = isAudioMuted;
        }
        Howler.mute(isAudioMuted);
      } else {
        player.pause();
        Howler.mute(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMusicPaused, isAudioMuted, musicPlayer]);

  return (
    <AudioControlsContext.Provider value={controls}>
      {children}
    </AudioControlsContext.Provider>
  );
};

// Null outside the game (e.g. the login screen's settings menu), where
// there is no music player - callers must handle the missing controls
export const useAudioControls = (): AudioControls | null =>
  useContext(AudioControlsContext);
