import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";

export const StoneHavenMiner: React.FC = () => {
  return (
    <MapPlacement x={5} y={7} height={2} width={4}>
      <div className="relative w-full h-full">
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 10}px`,
            left: `${PIXEL_SCALE * 21}px`,
          }}
        />
        <img
          src={SUNNYSIDE.npcs.goblin_mining}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 64}px`,
            bottom: `${PIXEL_SCALE * 7}px`,
            left: `${PIXEL_SCALE * 6}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
