import React, { useContext } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";

import roundButton from "assets/ui/button/round_button.png";
import saveIcon from "assets/icons/save.webp";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import classNames from "classnames";

export const Save: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const save = () => {
    gameService.send("SAVE");
  };

  return (
    <div
      onClick={save}
      className="fixed z-50 cursor-pointer hover:img-highlight"
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

      <img
        src={saveIcon}
        className={classNames("absolute", {
          "animate-pulsate": gameState.matches("autosaving"),
        })}
        style={{
          top: `${PIXEL_SCALE * 4.9}px`,
          left: `${PIXEL_SCALE * 5.1}px`,
          width: `${PIXEL_SCALE * 11.8}px`,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};
