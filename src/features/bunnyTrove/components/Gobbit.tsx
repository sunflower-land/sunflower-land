import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import gobbit from "assets/events/easter/2023/npcs/gobbit.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const Gobbit: React.FC = () => {
  return (
    <MapPlacement x={-2.5} y={8.5} height={1} width={1.8}>
      <div className="relative w-full h-full">
        <img
          src={gobbit}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 40}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
