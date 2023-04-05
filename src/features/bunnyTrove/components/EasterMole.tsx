import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import mole from "assets/events/easter/2023/npcs/mole.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const EasterMole: React.FC = () => {
  return (
    <MapPlacement x={-8.8} y={5} height={1} width={1.2}>
      <div className="relative w-full h-full">
        <img
          src={mole}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 28}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
