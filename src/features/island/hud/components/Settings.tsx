import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "features/game/GameProvider";

import more from "assets/ui/more.png";
import roundButton from "assets/ui/button/round_button.png";
import settings from "assets/icons/settings.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Bar } from "components/ui/ProgressBar";
import { SettingsMenu } from "./SettingsMenu";

export const Settings = () => {
  const { gameService, showTimers, toggleTimers } = useContext(Context);
  const [showMoreButtons, setShowMoreButtons] = useState(false);
  const [settingMenuOpen, setSettingsMenuOpen] = useState(false);

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

  const buttonWidth = PIXEL_SCALE * 22;
  const buttonMargin = 8;

  const handleMenuClose = () => {
    setSettingsMenuOpen(false);
    setShowMoreButtons(false);
  };

  return (
    <>
      {!gameService.state.matches("editing") && (
        <>
          <SettingsMenu show={settingMenuOpen} onClose={handleMenuClose} />
          <div ref={cogRef}>
            {/* Timers toggle */}
            <div
              onClick={toggleTimers}
              className="fixed z-50 cursor-pointer hover:img-highlight"
              style={{
                right: `${PIXEL_SCALE * 3}px`,
                bottom: `${PIXEL_SCALE * 26}px`,
                width: `${PIXEL_SCALE * 22}px`,
                transition: "transform 250ms ease",
                transform: "translateX(0)",
                ...(showMoreButtons && {
                  transform: `translateX(-${buttonWidth + buttonMargin}px)`,
                }),
              }}
            >
              <img
                src={roundButton}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 22}px`,
                }}
              />
              <div
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 7.4}px`,
                  left: `${PIXEL_SCALE * 3.6}px`,
                }}
              >
                <Bar percentage={70} type={showTimers ? "progress" : "error"} />
              </div>
            </div>
            {/* More Button */}
            <div
              onClick={() => setSettingsMenuOpen(true)}
              className="fixed z-50 cursor-pointer hover:img-highlight"
              style={{
                right: `${PIXEL_SCALE * 3}px`,
                bottom: `${PIXEL_SCALE * 26}px`,
                width: `${PIXEL_SCALE * 22}px`,
                transition: "transform 250ms ease",
                transform: "translateX(0)",
                ...(showMoreButtons && {
                  transform: `translateX(-${
                    (buttonWidth + buttonMargin) * 2
                  }px)`,
                }),
              }}
            >
              <img
                src={roundButton}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 22}px`,
                }}
              />
              <img
                src={more}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 6}px`,
                  width: `${PIXEL_SCALE * 10}px`,
                }}
              />
            </div>
            {/* Settings Button */}
            <div
              onClick={() => setShowMoreButtons(!showMoreButtons)}
              className="fixed z-50 cursor-pointer hover:img-highlight"
              style={{
                right: `${PIXEL_SCALE * 3}px`,
                bottom: `${PIXEL_SCALE * 26}px`,
                width: `${PIXEL_SCALE * 22}px`,
              }}
            >
              <img
                src={roundButton}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 22}px`,
                }}
              />
              <img
                src={settings}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 4}px`,
                  left: `${PIXEL_SCALE * 4}px`,
                  width: `${PIXEL_SCALE * 14}px`,
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
