import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import molina from "assets/events/valentine/npcs/molina.gif";
import molino from "assets/events/valentine/npcs/molino.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const Moles: React.FC = () => {
  return (
    <>
      <MapPlacement x={-4} y={3.5} width={3}>
        <div className="relative w-full h-full">
          <img
            src={molina}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 24}px`,
            }}
          />
        </div>
      </MapPlacement>
      <MapPlacement x={-2.5} y={3.5} width={3}>
        <div className="relative w-full h-full">
          <img
            src={molino}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 24}px`,
            }}
          />
        </div>
      </MapPlacement>
    </>
  );
};
