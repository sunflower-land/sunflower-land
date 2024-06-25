import React, { useContext } from "react";

import sign from "assets/decorations/woodsign.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const Sign: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <div
      style={{
        width: `${PIXEL_SCALE * 34}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      className="absolute"
    >
      <img src={sign} className="w-full" />
      <div
        className="flex flex-col absolute text-xxs w-full"
        style={{
          color: "#ead4aa",
          left: 0,
          top: "2px",
          textAlign: "center",
          textShadow: "1px 1px #723e39",
        }}
      >
        <p className="text-xxs mt-2 font-pixel">
          {"#"}
          {gameState.context.nftId
            ? gameState.context.nftId
            : gameState.context.farmId}
        </p>
      </div>
    </div>
  );
};
