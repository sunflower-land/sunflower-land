import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import npc from "assets/events/valentine/npcs/chicken_couple.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const ChickenCouple: React.FC = () => {
  return (
    <MapPlacement x={5} y={2.1} width={2}>
      <div className="relative w-full h-full">
        <img
          src={npc}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 24}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
