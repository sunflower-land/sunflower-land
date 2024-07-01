import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "features/game/GameProvider";

import more from "assets/ui/more.png";
import settings from "assets/icons/settings.png";
import sound_on from "assets/icons/sound_on.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ResizableBar } from "components/ui/ProgressBar";
import { AudioMenu } from "features/game/components/AudioMenu";
import {
  getFarmingSong,
  getFarmingSongCount,
  getGoblinSong,
  getGoblinSongCount,
} from "assets/songs/playlist";
import { SUNNYSIDE } from "assets/sunnyside";
import { useLocation } from "react-router-dom";
import { GameOptionsModal } from "./settings-menu/GameOptions";
import { useSound } from "lib/utils/hooks/useSound";

const buttonWidth = PIXEL_SCALE * 22;
const buttonHeight = PIXEL_SCALE * 23;

interface Props {
  isFarming: boolean;
}

export const Settings: React.FC<Props> = ({ isFarming }) => {
  const { showTimers, toggleTimers } = useContext(Context);
  const [showMoreButtons, setShowMoreButtons] = useState(false);
  const [openAudioMenu, setOpenAudioMenu] = useState(false);
  const [openSettingsMenu, setOpenSettingsMenu] = useState(false);
  const { pathname } = useLocation();

  const button = useSound("button");

  // The actions included in this more buttons should not be shown if the player is in goblin retreat or visiting another farm
  const showLimitedButtons =
    pathname.includes("retreat") || pathname.includes("visit");

  const cogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (cogRef.current && !cogRef.current.contains(event.target)) {
        setShowMoreButtons(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleCloseAudioMenu = () => {
    setOpenAudioMenu(false);
    setShowMoreButtons(false);
  };

  const handleCloseSettingsMenu = () => {
    setOpenSettingsMenu(false);
    setShowMoreButtons(false);
  };

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

  const getSong = () => {
    return isFarming ? getFarmingSong(songIndex) : getGoblinSong(songIndex);
  };

  const song = getSong();

  // buttons

  const settingButton = (
    index: number,
    onClick: () => void,
    children: JSX.Element,
  ) => {
    const rightMargin = 8;

    return (
      <div
        key={`button-${index}`}
        onClick={onClick}
        className="absolute z-50 mb-2 cursor-pointer hover:img-highlight"
        style={{
          width: `${buttonWidth}px`,
          height: `${buttonHeight}px`,
          transition: "transform 250ms ease",
          transform: "translateX(0)",
          ...(showMoreButtons && {
            transform: `translateX(-${(buttonWidth + rightMargin) * index}px)`,
          }),
        }}
      >
        <img
          src={SUNNYSIDE.ui.round_button}
          className="absolute"
          style={{
            width: `${buttonWidth}px`,
          }}
        />
        {children}
      </div>
    );
  };

  const gearButton = (index: number) =>
    settingButton(
      index,
      () => {
        button.play();
        setShowMoreButtons(!showMoreButtons);
      },
      <img
        src={settings}
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 4}px`,
          width: `${PIXEL_SCALE * 14}px`,
        }}
      />,
    );

  const audioButton = (index: number) =>
    settingButton(
      index,
      () => {
        setOpenAudioMenu(true);
      },
      <img
        src={sound_on}
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 5}px`,
          width: `${PIXEL_SCALE * 13}px`,
        }}
      />,
    );

  const progressBarButton = (index: number) =>
    settingButton(
      index,
      () => {
        button.play();
        toggleTimers();
      },
      <div
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 7.5}px`,
          left: `${PIXEL_SCALE * 3.5}px`,
        }}
      >
        <ResizableBar
          percentage={70}
          type={showTimers ? "progress" : "error"}
        />
      </div>,
    );

  const moreButton = (index: number) =>
    settingButton(
      index,
      () => {
        setOpenSettingsMenu(true);
      },
      <img
        src={more}
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 10}px`,
          left: `${PIXEL_SCALE * 6}px`,
          width: `${PIXEL_SCALE * 10}px`,
        }}
      />,
    );

  // list of buttons to show in the HUD from right to left in order
  const buttons = [
    gearButton,
    ...(isFarming ? [progressBarButton] : []),
    audioButton,
    ...(!showLimitedButtons ? [moreButton] : []),
  ];

  return (
    <>
      <audio
        ref={musicPlayer}
        onEnded={handleNextSong}
        src={song.path}
        className="hidden"
        autoPlay
        muted={true}
        controls
      />
      <GameOptionsModal
        show={openSettingsMenu}
        onClose={handleCloseSettingsMenu}
      />
      <AudioMenu
        musicPlayer={musicPlayer}
        song={song}
        handlePreviousSong={handlePreviousSong}
        handleNextSong={handleNextSong}
        show={openAudioMenu}
        onClose={handleCloseAudioMenu}
      />
      <div
        className="relative"
        style={{ height: `${buttonHeight}px`, width: `${buttonWidth}px` }}
        ref={cogRef}
      >
        {buttons.map((item, index) => item(index)).reverse()}
      </div>
    </>
  );
};
