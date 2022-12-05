import React, { useContext, useEffect, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";

import roundButton from "assets/ui/button/round_button.png";
import saveIcon from "assets/icons/save.webp";
import loadingIcon from "assets/icons/timer.gif";
import savedIcon from "assets/icons/confirm.png";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import classNames from "classnames";

type ButtonState = "unsaved" | "inProgress" | "saved";

export const Save: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const playing = gameState.matches("playing");
  const autoSaving = gameState.matches("autosaving");
  const hasUnsavedProgress = gameState.context.actions.length > 0;
  const buttonState: ButtonState =
    playing && !hasUnsavedProgress
      ? "saved"
      : autoSaving
      ? "inProgress"
      : "unsaved";

  const [showButton, setShowButton] = useState<boolean>(false);
  const [hideShowButtonTimer, setHideShowButtonTimer] = useState<number>();

  useEffect(() => {
    // show button when there are unsaved progress
    if (hasUnsavedProgress) {
      setShowButton(true);
      setHideShowButtonTimer(clearTimeout(hideShowButtonTimer) as undefined);
    }

    // hide button after 2 seconds when changes are saved
    if (showButton && !hasUnsavedProgress) {
      setHideShowButtonTimer(
        window.setTimeout(() => setShowButton(false), 2000)
      );
    }
  }, [hasUnsavedProgress]);

  const save = () => {
    gameService.send("SAVE");
  };

  return (
    <div
      onClick={save}
      className={classNames(
        "fixed z-50 cursor-pointer hover:img-highlight transition-opacity",
        {
          "opacity-100": showButton,
          "opacity-0 pointer-events-none": !showButton,
        }
      )}
      style={{
        right: `${PIXEL_SCALE * 3}px`,
        bottom: `${PIXEL_SCALE * 52}px`,
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

      {buttonState === "unsaved" && (
        <img
          src={saveIcon}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 4}px`,
            width: `${PIXEL_SCALE * 14}px`,
          }}
        />
      )}
      {buttonState === "inProgress" && (
        <img
          src={loadingIcon}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 7}px`,
            width: `${PIXEL_SCALE * 8}px`,
          }}
        />
      )}
      {buttonState === "saved" && (
        <img
          src={savedIcon}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
      )}
    </div>
  );
};
