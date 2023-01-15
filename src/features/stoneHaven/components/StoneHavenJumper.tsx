import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";

export const StoneHavenJumper: React.FC = () => {
  return (
    <MapPlacement x={1} y={3} height={1} width={1}>
      <div className="relative w-full h-full">
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            right: 0,
            transform: "scaleX(-1)",
          }}
        >
          <img
            src={SUNNYSIDE.npcs.goblin_jumping}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
            }}
          />
        </div>
      </div>
    </MapPlacement>
  );
};
