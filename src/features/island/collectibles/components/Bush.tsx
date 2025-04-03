import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";

import { BUSH_VARIANTS } from "features/island/lib/alternateArt";

export const Bush: React.FC<CollectibleProps> = ({ game }) => {
  return (
    <>
      <img
        src={
          BUSH_VARIANTS[game?.island.type ?? "basic"][
            game?.season?.season ?? "spring"
          ]
        }
        style={{
          width: `${PIXEL_SCALE * (game.island.type === "desert" ? 20 : game.island.type === "volcano" ? 28 : 28)}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * (game.island.type === "desert" ? 6 : game.island.type === "volcano" ? 2 : 2)}px`,
        }}
        className="absolute"
        alt="Bush"
      />
    </>
  );
};
