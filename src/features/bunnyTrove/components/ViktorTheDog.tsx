import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import viktor from "assets/events/easter/2023/npcs/viktor.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const ViktorTheDog: React.FC = () => {
  return (
    <MapPlacement x={0} y={-5.5} height={1} width={1}>
      <div className="relative w-full h-full">
        <img
          src={viktor}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 29}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
