import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import npc from "assets/events/easter/2023/npcs/swimmer.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const Swimmer: React.FC = () => {
  return (
    <MapPlacement x={4} y={-10} height={1} width={1}>
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
