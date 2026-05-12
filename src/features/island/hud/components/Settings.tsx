import React, { useRef, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { AudioControlsProvider } from "features/game/components/AudioControlsContext";
import {
  getFarmingSong,
  getFarmingSongCount,
  getGoblinSong,
  getGoblinSongCount,
} from "assets/songs/playlist";
import settings from "assets/icons/settings.png";
import { GameOptionsModal } from "./settings-menu/GameOptions";
import { useSound } from "lib/utils/hooks/useSound";
import { RoundButton } from "components/ui/RoundButton";
import { useVisiting } from "lib/utils/visitUtils";

const buttonWidth = PIXEL_SCALE * 22;
const buttonHeight = PIXEL_SCALE * 23;

interface Props {
  isFarming: boolean;
}

export const Settings: React.FC<Props> = ({ isFarming }) => {
  const [openSettingsMenu, setOpenSettingsMenu] = useState(false);
  const { isVisiting } = useVisiting();

  const button = useSound("button");

  // music controls

  const [songIndex, setSongIndex] = useState<number>(0);
  const musicPlayer = useRef<HTMLAudioElement>(null);

  const getSongCount = () => {
    return isFarming ? getFarmingSongCount() : getGoblinSongCount();
  };

  const handlePreviousSong = () => {
    const songCount = getSongCount();
    if (songIndex === 0) {
      setSongIndex(songCount - 1);
    } else {
      setSongIndex(songIndex - 1);
    }
  };

  const handleNextSong = () => {
    const songCount = getSongCount();
    if (songCount === songIndex + 1) {
      setSongIndex(0);
    } else {
      setSongIndex(songIndex + 1);
    }
  };

  const song = isFarming ? getFarmingSong(songIndex) : getGoblinSong(songIndex);

  if (isVisiting) {
    return null;
  }

  return (
    <AudioControlsProvider
      musicPlayer={musicPlayer}
      song={song}
      handlePreviousSong={handlePreviousSong}
      handleNextSong={handleNextSong}
    >
      <audio
        ref={musicPlayer}
        onEnded={handleNextSong}
        src={song.path}
        className="hidden"
        autoPlay
        muted={true}
        controls
      />
      <>
        <GameOptionsModal
          show={openSettingsMenu}
          onClose={() => setOpenSettingsMenu(false)}
        />
        <div
          className="relative"
          style={{ height: `${buttonHeight}px`, width: `${buttonWidth}px` }}
        >
          <RoundButton
            onClick={() => {
              button.play();
              setOpenSettingsMenu(true);
            }}
          >
            <img
              src={settings}
              className="absolute group-active:translate-y-[2px]"
              style={{
                top: `${PIXEL_SCALE * 4}px`,
                left: `${PIXEL_SCALE * 4}px`,
                width: `${PIXEL_SCALE * 14}px`,
              }}
            />
          </RoundButton>
        </div>
      </>
    </AudioControlsProvider>
  );
};
