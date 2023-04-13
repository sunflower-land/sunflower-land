import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import victoria from "assets/events/easter/2023/npcs/victoria.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const VictoriaTheCat: React.FC = () => {
  return (
    <MapPlacement x={11.7} y={8} height={1} width={2.5}>
      <div className="relative w-full h-full">
        <img
          src={victoria}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 25}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
