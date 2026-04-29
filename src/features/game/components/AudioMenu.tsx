import React from "react";
import play from "assets/icons/play.png";
import pause from "assets/icons/pause.png";
import arrow_next from "assets/icons/arrow_next.png";
import arrow_previous from "assets/icons/arrow_previous.png";
import sound_on from "assets/icons/sound_on.png";
import sound_off from "assets/icons/sound_off.png";
import { Song } from "assets/songs/playlist";
import { PIXEL_SCALE } from "../lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useIsAudioMuted } from "lib/utils/hooks/useIsAudioMuted";
import { useIsMusicPaused } from "lib/utils/hooks/useIsMusicPaused";

interface Props {
  song: Song;
  handlePreviousSong: () => void;
  handleNextSong: () => void;
}

export const AudioMenuContent: React.FC<Props> = ({
  song,
  handlePreviousSong,
  handleNextSong,
}) => {
  const { t } = useAppTranslation();

  const { isAudioMuted, toggleAudioMuted } = useIsAudioMuted();
  const { isMusicPaused, toggleMusicPaused } = useIsMusicPaused();

  return (
    <div className="p-1 relative">
      <p className="mb-2">{t("music")}</p>
      {/* Music display */}
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

      {/* Music controls */}
      <div className="flex space-x-2 justify-content-between mb-4">
        <img
          src={arrow_previous}
          className="cursor-pointer hover:img-highlight"
          onClick={handlePreviousSong}
          alt="previous song button"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <img
          src={isMusicPaused ? play : pause}
          className="cursor-pointer hover:img-highlight"
          onClick={toggleMusicPaused}
          alt="play / pause song button"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
          }}
        />
        <img
          src={arrow_next}
          className="cursor-pointer hover:img-highlight"
          onClick={handleNextSong}
          alt="next song button"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>

      {/* Sound effects controls */}
      <p className="mb-2">
        {t("sound.effects")} {isAudioMuted ? t("off") : t("on")}
      </p>
      <img
        src={isAudioMuted ? sound_off : sound_on}
        className="cursor-pointer hover:img-highlight"
        onClick={toggleAudioMuted}
        alt="mute / unmute sound effects button"
        style={{
          width: `${PIXEL_SCALE * 13}px`,
        }}
      />
    </div>
  );
};
