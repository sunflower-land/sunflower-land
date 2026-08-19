import React from "react";
import play from "assets/icons/play.png";
import pause from "assets/icons/pause.png";
import arrow_next from "assets/icons/arrow_next.png";
import arrow_previous from "assets/icons/arrow_previous.png";
import sound_on from "assets/icons/sound_on.png";
import sound_off from "assets/icons/sound_off.png";
import { SONGS, type Song } from "assets/songs/playlist";
import { PIXEL_SCALE } from "../lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useIsAudioMuted } from "lib/utils/hooks/useIsAudioMuted";
import { useIsMusicPaused } from "lib/utils/hooks/useIsMusicPaused";
import {
  useAudioVolume,
  type VolumeChannel,
} from "lib/utils/hooks/useAudioVolume";
import { useEnabledSongs } from "lib/utils/hooks/useEnabledSongs";
import { Slider } from "components/ui/Slider";
import { Checkbox } from "components/ui/Checkbox";

// All player controls are optional - outside the game (login screen)
// there is no music player, so only mute, volumes and song selection show
interface Props {
  song?: Song;
  handlePreviousSong?: () => void;
  handleNextSong?: () => void;
  handlePlaySong?: (id: string) => void;
}

const VolumeSlider: React.FC<{
  label: string;
  channel: VolumeChannel;
  disabled: boolean;
}> = ({ label, channel, disabled }) => {
  const { t } = useAppTranslation();
  const { volume, setVolume } = useAudioVolume(channel);

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs">{label}</p>
        <p className="text-xxs">{`${Math.round(volume * 100)}%`}</p>
      </div>
      <Slider
        value={volume}
        onChange={setVolume}
        disabled={disabled}
        aria-label={t("audio.volumeOf", { label })}
      />
    </div>
  );
};

export const AudioMenuContent: React.FC<Props> = ({
  song,
  handlePreviousSong,
  handleNextSong,
  handlePlaySong,
}) => {
  const { t } = useAppTranslation();

  const { isAudioMuted, toggleAudioMuted } = useIsAudioMuted();
  const { isMusicPaused, toggleMusicPaused } = useIsMusicPaused();
  const { isSongEnabled, toggleSong } = useEnabledSongs();

  const enabledCount = SONGS.filter(({ id }) => isSongEnabled(id)).length;

  return (
    <div className="p-1 relative">
      {/* Master mute */}
      <div
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={toggleAudioMuted}
      >
        <p>{t("audio.muteAll")}</p>
        <img
          src={isAudioMuted ? sound_off : sound_on}
          className="hover:img-highlight"
          alt={t("audio.muteAll")}
          style={{
            width: `${PIXEL_SCALE * 13}px`,
          }}
        />
      </div>

      {/* Volume sliders */}
      <VolumeSlider
        label={t("audio.music")}
        channel="music"
        disabled={isAudioMuted}
      />
      <VolumeSlider
        label={t("audio.ambience")}
        channel="ambience"
        disabled={isAudioMuted}
      />
      <VolumeSlider
        label={t("audio.sfx")}
        channel="sfx"
        disabled={isAudioMuted}
      />

      {/* Music display + controls - only in-game, where a player exists */}
      {song && (
        <>
          <p className="mb-1 mt-3">{t("music")}</p>
          <div className="mb-1.5 overflow-hidden bg-brown-200">
            <p
              className="whitespace-no-wrap w-fit text-white text-sm pt-1 pb-2"
              style={{
                animation: "marquee-like-effect 10s infinite linear",
                whiteSpace: "nowrap",
                animationPlayState: isMusicPaused ? "paused" : "running",
              }}
            >
              {song.name} {"-"} {song.artist}
            </p>
          </div>

          <div className="flex space-x-2 justify-content-between mb-3">
            <img
              src={arrow_previous}
              className="cursor-pointer hover:img-highlight"
              onClick={handlePreviousSong}
              alt={t("audio.previousSong")}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            <img
              src={isMusicPaused ? play : pause}
              className="cursor-pointer hover:img-highlight"
              onClick={toggleMusicPaused}
              alt={t("audio.playPause")}
              style={{
                width: `${PIXEL_SCALE * 10}px`,
              }}
            />
            <img
              src={arrow_next}
              className="cursor-pointer hover:img-highlight"
              onClick={handleNextSong}
              alt={t("audio.nextSong")}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
        </>
      )}

      {/* Song selection */}
      <p className="mb-1">{t("audio.songs")}</p>
      <div className="flex flex-col space-y-1 max-h-48 overflow-y-auto scrollable pr-1">
        {SONGS.map(({ id, name, artist }) => {
          const enabled = isSongEnabled(id);
          // Keep at least one song in the rotation
          const lastEnabled = enabled && enabledCount === 1;

          return (
            <div key={id} className="flex items-center space-x-2">
              {/* The checkbox decides whether the song is part of the loop */}
              <Checkbox
                checked={enabled}
                disabled={lastEnabled}
                onChange={() => {
                  if (!lastEnabled) toggleSong(id);
                }}
                aria-label={t("audio.includeInPlaylist", { name })}
              />
              {/* Clicking the song plays it right away */}
              <div
                className={handlePlaySong ? "cursor-pointer" : undefined}
                onClick={
                  handlePlaySong
                    ? () => {
                        handlePlaySong(id);
                        if (isMusicPaused) toggleMusicPaused();
                      }
                    : undefined
                }
              >
                <p
                  className={song?.id === id ? "text-xs underline" : "text-xs"}
                >
                  {name}
                </p>
                <p className="text-xxs opacity-70">{artist}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
