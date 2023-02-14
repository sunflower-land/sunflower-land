import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import npc from "assets/events/valentine/npcs/valentin_goblin.gif";
import shadow from "assets/npcs/shadow.png";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const ValentinGoblin: React.FC = () => {
  return (
    <MapPlacement x={5.5} y={-2.6} width={1} height={1}>
      <div className="relative w-full h-full">
        <img
          src={npc}
          className="absolute z-20"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            transform: "scaleX(-1)",
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * -3}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
