import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import swimmer from "assets/events/easter/2023/npcs/swimmer.gif";
import goblin from "assets/events/easter/2023/npcs/farting_goblin.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const Water: React.FC = () => {
  return (
    <>
      <MapPlacement x={4} y={-10} height={1} width={1}>
        <div className="relative w-full h-full">
          <img
            src={swimmer}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
            }}
          />
        </div>
      </MapPlacement>
      <MapPlacement x={-13} y={-0.5} height={1} width={3}>
        <div className="relative w-full h-full">
          <img
            src={goblin}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 29}px`,
            }}
          />
        </div>
      </MapPlacement>
    </>
  );
};
