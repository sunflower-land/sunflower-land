import React from "react";

import blacksmith from "assets/npcs/blacksmith.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const StoneHavenBlacksmith: React.FC = () => {
  return (
    <MapPlacement x={6} y={13} height={1} width={1}>
      <div className="relative w-full h-full">
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
        <img
          src={blacksmith}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
            transform: "scaleX(-1)",
          }}
        />
      </div>
    </MapPlacement>
  );
};
