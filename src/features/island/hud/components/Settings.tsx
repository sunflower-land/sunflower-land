import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "features/game/GameProvider";

import more from "assets/ui/more.png";
import settings from "assets/icons/settings.png";
import sound_on from "assets/icons/sound_on.png";
import zoomIn from "assets/icons/zoomin.png";
import zoomOut from "assets/icons/zoomout.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ResizableBar } from "components/ui/ProgressBar";
import { SettingsMenu } from "./settings-menu/SettingsMenu";
import { AudioMenu } from "features/game/components/AudioMenu";
import {
  getEasterSong,
  getEasterSongCount,
  getFarmingSong,
  getFarmingSongCount,
  getGoblinSong,
  getGoblinSongCount,
} from "assets/songs/playlist";
import { SUNNYSIDE } from "assets/sunnyside";
import { useLocation } from "react-router-dom";
import { ZoomContext } from "components/ZoomProvider";

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
  const { pathname } = useLocation();
  // The actions included in this more buttons should not be shown if the player is in goblin retreat or visiting another farm
  const showLimitedButtons =
    pathname.includes("retreat") || pathname.includes("visit");

  const cogRef = useRef<HTMLDivElement>(null);

  const { scale, setMin, setMax, canZoom, isZoomedIn } =
    useContext(ZoomContext);

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

  const getSongCount = () => {
    if (onEasterIsland) {
      return getEasterSongCount();
    }
    return isFarming ? getFarmingSongCount() : getGoblinSongCount();
  };

  const onEasterIsland = pathname.includes("bunny-trove");
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
    if (onEasterIsland) {
      return getEasterSong(0);
    }
    return isFarming ? getFarmingSong(songIndex) : getGoblinSong(songIndex);
  };

  const song = getSong();

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
        <ResizableBar
          percentage={70}
          type={showTimers ? "progress" : "error"}
        />
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

  const zoomButton = (index: number) =>
    settingButton(
      index,
      () => {
        scale.get() >= 1 ? setMin() : setMax();
      },
      <img
        src={isZoomedIn ? zoomOut : zoomIn}
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 3.5}px`,
          left: `${PIXEL_SCALE * 3.5}px`,
          width: `${PIXEL_SCALE * 15}px`,
        }}
      />
    );

  // list of buttons to show in the HUD from right to left in order
  const buttons = [
    gearButton,
    ...(isFarming ? [progressBarButton] : []),
    audioButton,
    ...(canZoom ? [zoomButton] : []),
    ...(!showLimitedButtons ? [moreButton] : []),
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
      <SettingsMenu
        show={openSettingsMenu}
        onClose={handleCloseSettingsMenu}
        isFarming={isFarming}
      />
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
