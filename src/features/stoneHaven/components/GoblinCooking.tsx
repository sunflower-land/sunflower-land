import React from "react";

import cook from "assets/npcs/goblin_doing.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const GoblinCook: React.FC = () => {
  return (
    <MapPlacement x={-5} y={9} height={2} width={2}>
      <div className="relative w-full h-full">
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 4}px`,
            right: `${PIXEL_SCALE * 3}px`,
          }}
        />
        <img
          src={cook}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 25}px`,
            bottom: 0,
            right: 0,
          }}
        />
      </div>
    </MapPlacement>
  );
};
