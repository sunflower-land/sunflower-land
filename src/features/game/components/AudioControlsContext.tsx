import React, { createContext, useContext, useEffect } from "react";
import { Howler } from "howler";
import { Song } from "assets/songs/playlist";
import { useIsAudioMuted } from "lib/utils/hooks/useIsAudioMuted";
import { useIsMusicPaused } from "lib/utils/hooks/useIsMusicPaused";

export interface AudioControls {
  musicPlayer: React.RefObject<HTMLAudioElement | null>;
  song: Song;
  handlePreviousSong: () => void;
  handleNextSong: () => void;
}

const AudioControlsContext = createContext<AudioControls | null>(null);

export const AudioControlsProvider: React.FC<
  AudioControls & { children: React.ReactNode }
> = ({ children, ...controls }) => {
  const { musicPlayer } = controls;
  const { isAudioMuted } = useIsAudioMuted();
  const { isMusicPaused } = useIsMusicPaused();

  useEffect(() => {
    Howler.mute(isAudioMuted);
  }, [isAudioMuted]);

  useEffect(() => {
    const player = musicPlayer.current;
    if (!player) return;

    // Modifying HTMLAudioElement properties is necessary for audio control
    // eslint-disable-next-line react-hooks/immutability
    player.volume = 0.15;

    if (isMusicPaused) {
      player.pause();
    } else {
      player.play();
      player.muted = false;
    }
  }, [isMusicPaused, musicPlayer]);

  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
    const handleVisibilityChange = () => {
      const player = musicPlayer.current;
      if (!player) return;

      if (document.visibilityState === "visible") {
        if (!isMusicPaused) {
          player.play();
          player.muted = false;
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

export const useAudioControls = (): AudioControls => {
  const ctx = useContext(AudioControlsContext);
  if (!ctx) {
    throw new Error(
      "useAudioControls must be used within an AudioControlsProvider",
    );
  }
  return ctx;
};
