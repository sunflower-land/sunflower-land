import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "features/game/GameProvider";

import more from "assets/ui/more.png";
import roundButton from "assets/ui/button/round_button.png";
import settings from "assets/icons/settings.png";
import sound_on from "assets/icons/sound_on.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Bar } from "components/ui/ProgressBar";
import { SettingsMenu } from "./SettingsMenu";
import { AudioMenu } from "features/game/components/AudioMenu";
import {
  getFarmingSong,
  getFarmingSongCount,
  getGoblinSong,
  getGoblinSongCount,
} from "assets/songs/playlist";

const buttonWidth = PIXEL_SCALE * 22;
const buttonHeight = PIXEL_SCALE * 23;
const buttonBottom = PIXEL_SCALE * 3;
const buttonRight = PIXEL_SCALE * 3;

interface Props {
  isFarming: boolean;
}

export const Settings: React.FC<Props> = ({ isFarming }) => {
  const { showTimers, toggleTimers } = useContext(Context);
  const [showMoreButtons, setShowMoreButtons] = useState(false);
  const [openAudioMenu, setOpenAudioMenu] = useState(false);
  const [openSettingsMenu, setOpenSettingsMenu] = useState(false);

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
  const musicPlayer = useRef<any>(null);

  const handlePreviousSong = () => {
    const songCount = isFarming ? getFarmingSongCount() : getGoblinSongCount();
    if (songIndex === 0) {
      setSongIndex(songCount - 1);
    } else {
      setSongIndex(songIndex - 1);
    }
  };

  const handleNextSong = () => {
    const songCount = isFarming ? getFarmingSongCount() : getGoblinSongCount();
    if (songCount === songIndex + 1) {
      setSongIndex(0);
    } else {
      setSongIndex(songIndex + 1);
    }
  };

  const song = isFarming ? getFarmingSong(songIndex) : getGoblinSong(songIndex);

  // buttons

  const settingButton = (
    index: number,
    onClick: () => void,
    children: JSX.Element
  ) => {
    return (
      <div
        key={`button-${index}`}
        onClick={onClick}
        className="fixed z-50 cursor-pointer hover:img-highlight"
        style={{
          right: `${buttonRight}px`,
          bottom: `${buttonBottom}px`,
          width: `${buttonWidth}px`,
          height: `${buttonHeight}px`,
          transition: "transform 250ms ease",
          transform: "translateX(0)",
          ...(showMoreButtons && {
            transform: `translateX(-${(buttonWidth + buttonRight) * index}px)`,
          }),
        }}
      >
        <img
          src={roundButton}
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
      () => setShowMoreButtons(!showMoreButtons),
      <img
        src={settings}
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 4}px`,
          width: `${PIXEL_SCALE * 14}px`,
        }}
      />
    );

  const audioButton = (index: number) =>
    settingButton(
      index,
      () => setOpenAudioMenu(true),
      <img
        src={sound_on}
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 5}px`,
          width: `${PIXEL_SCALE * 13}px`,
        }}
      />
    );

  const progressBarButton = (index: number) =>
    settingButton(
      index,
      toggleTimers,
      <div
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 7.5}px`,
          left: `${PIXEL_SCALE * 3.5}px`,
        }}
      >
        <Bar percentage={70} type={showTimers ? "progress" : "error"} />
      </div>
    );

  const moreButton = (index: number) =>
    settingButton(
      index,
      () => setOpenSettingsMenu(true),
      <img
        src={more}
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 10}px`,
          left: `${PIXEL_SCALE * 6}px`,
          width: `${PIXEL_SCALE * 10}px`,
        }}
      />
    );

  // list of buttons to show in the HUD from right to left in order
  const buttons = [
    gearButton,
    ...(isFarming ? [progressBarButton] : []),
    audioButton,
    ...(isFarming ? [moreButton] : []),
  ];

  return (
    <>
      <audio
        ref={musicPlayer}
        onEnded={handleNextSong}
        src={song.path}
        className="d-none"
        autoPlay
        muted={true}
        controls
      />
      <SettingsMenu show={openSettingsMenu} onClose={handleCloseSettingsMenu} />
      <AudioMenu
        musicPlayer={musicPlayer}
        song={song}
        handlePreviousSong={handlePreviousSong}
        handleNextSong={handleNextSong}
        show={openAudioMenu}
        onClose={handleCloseAudioMenu}
      />
      <div ref={cogRef}>
        {buttons.map((item, index) => item(index)).reverse()}
      </div>
    </>
  );
};
