import React from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import tree from "assets/events/easter/2023/npcs/sleeping_bumpkin.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SleepingBumpkin: React.FC = () => {
  return (
    <MapPlacement x={10} y={5} height={1} width={2.2}>
      <div className="relative w-full h-full">
        <img
          src={tree}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 41}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
