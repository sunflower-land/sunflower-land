import React, { useRef, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { AudioControlsProvider } from "features/game/components/AudioControlsContext";
import { getSongs } from "assets/songs/playlist";
import { useEnabledSongs } from "lib/utils/hooks/useEnabledSongs";
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

  const [currentSongId, setCurrentSongId] = useState<string>();
  const musicPlayer = useRef<HTMLAudioElement>(null);
  const { isSongEnabled } = useEnabledSongs();

  const allSongs = getSongs(isFarming);
  const enabledSongs = allSongs.filter(({ id }) => isSongEnabled(id));
  // Defensive: never leave the player without a source
  const playlist = enabledSongs.length > 0 ? enabledSongs : allSongs;

  // A deselected song can still be played directly from the panel - it
  // just won't be part of the rotation once it ends
  const song = allSongs.find(({ id }) => id === currentSongId) ?? playlist[0];

  // -1 when the current song is not in the rotation; next then starts at 0
  const currentIndex = playlist.findIndex(({ id }) => id === song.id);

  const handlePreviousSong = () => {
    const previous =
      playlist[
        currentIndex === -1
          ? playlist.length - 1
          : (currentIndex - 1 + playlist.length) % playlist.length
      ];
    setCurrentSongId(previous.id);
  };

  const handleNextSong = () => {
    const next = playlist[(currentIndex + 1) % playlist.length];
    setCurrentSongId(next.id);
  };

  const handlePlaySong = (id: string) => setCurrentSongId(id);

  if (isVisiting) {
    return null;
  }

  return (
    <AudioControlsProvider
      musicPlayer={musicPlayer}
      song={song}
      handlePreviousSong={handlePreviousSong}
      handleNextSong={handleNextSong}
      handlePlaySong={handlePlaySong}
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
