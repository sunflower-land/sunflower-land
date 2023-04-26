import React, { useContext, useEffect, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";

import saveIcon from "assets/icons/save.webp";
import loadingIcon from "assets/icons/timer.gif";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";

type ButtonState = "unsaved" | "inProgress" | "saved";

export const Save: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const playing =
    gameState.matches("playingGuestGame") ||
    gameState.matches("playingFullGame");
  const autoSaving = gameState.matches("autosaving");
  const hasUnsavedProgress = gameState.context.actions.length > 0;
  const savedWithoutError = playing && !hasUnsavedProgress;

  const [enableButton, setEnableButton] = useState<boolean>(false);
  const [disableSaveButtonTimer, setDisableSaveButtonTimer] =
    useState<number>();

  const showSaved = savedWithoutError && enableButton;
  const buttonState: ButtonState = autoSaving
    ? "inProgress"
    : showSaved
    ? "saved"
    : "unsaved";

  useEffect(() => {
    // show button when there are unsaved progress
    if (hasUnsavedProgress) {
      setEnableButton(true);
      setDisableSaveButtonTimer(
        clearTimeout(disableSaveButtonTimer) as undefined
      );
    }

    // hide button after 2 seconds when changes are saved
    if (showSaved) {
      setDisableSaveButtonTimer(
        window.setTimeout(() => setEnableButton(false), 2000)
      );
    }

    return () => clearTimeout(disableSaveButtonTimer);
  }, [playing && !hasUnsavedProgress]);

  const save = () => {
    gameService.send("SAVE");
  };

  return (
    <div
      onClick={enableButton ? save : undefined}
      className={classNames({
        "cursor-pointer hover:img-highlight":
          enableButton && buttonState === "unsaved",
      })}
      style={{
        // right: `${PIXEL_SCALE * 3}px`,
        bottom: `${PIXEL_SCALE * 52}px`,
        width: `${PIXEL_SCALE * 22}px`,
      }}
    >
      <img
        src={SUNNYSIDE.ui.round_button}
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
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 12}px`,
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
          src={SUNNYSIDE.icons.confirm}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
      )}

      <img
        src={SUNNYSIDE.ui.round_button}
        className={classNames("absolute", {
          "opacity-0": enableButton,
          "opacity-40": !enableButton,
        })}
        style={{
          width: `${PIXEL_SCALE * 22}px`,
        }}
      />
    </div>
  );
};
