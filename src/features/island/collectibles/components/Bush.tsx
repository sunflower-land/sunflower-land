import React from "react";

import bush from "assets/decorations/bush.png";
import springBush from "assets/decorations/flower_bush.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { IslandType } from "features/game/types/game";
import { CollectibleProps } from "../Collectible";

const BUSH_IMAGE: Record<IslandType, string> = {
  basic: bush,
  spring: springBush,
  desert: bush,
};
export const Bush: React.FC<CollectibleProps> = ({ game }) => {
  return (
    <>
      <img
        src={BUSH_IMAGE[game?.island.type ?? "basic"]}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Bush"
      />
    </>
  );
};
