import React from "react";

import treasureMap from "assets/sfts/treasure/treasure_map.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const TreasureMap: React.FC = () => {
  return (
    <>
      <img
        src={treasureMap}
        style={{
          width: `${PIXEL_SCALE * 34}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Treasure Map"
      />
    </>
  );
};
