import React from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import sad from "assets/events/easter/2023/npcs/sad_guy.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SadGuy: React.FC = () => {
  return (
    <MapPlacement x={-14} y={4.5} height={1} width={1}>
      <div className="relative w-full h-full">
        <img
          src={sad}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 25}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
