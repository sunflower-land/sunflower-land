import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/events/valentine/buildings/love_cafe.webp";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const LoveCafe: React.FC = () => {
  return (
    <MapPlacement x={-7.4} y={5.9} height={3} width={9}>
      <div className="relative w-full h-full">
        <img
          src={building}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 112}px`,
            right: `${PIXEL_SCALE * 8}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
