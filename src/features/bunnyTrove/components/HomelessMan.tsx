import React from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import homeless from "assets/events/easter/2023/npcs/homeless.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const HomelessMan: React.FC = () => {
  return (
    <MapPlacement x={-1.5} y={4.5} height={1} width={2.5}>
      <div className="relative w-full h-full">
        <img
          src={homeless}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 32}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
