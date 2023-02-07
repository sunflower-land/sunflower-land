import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import npc from "assets/events/valentine/npcs/valentin_farmer.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const ValentinFarmer: React.FC = () => {
  return (
    <MapPlacement x={3.2} y={2} width={3}>
      <div className="relative w-full h-full">
        <img
          src={npc}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
