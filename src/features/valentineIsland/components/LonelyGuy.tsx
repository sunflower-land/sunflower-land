import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import npc from "assets/events/valentine/npcs/alone_guy.gif";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const LonelyGuy: React.FC = () => {
  return (
    <MapPlacement x={0.5} y={6.5} width={3}>
      <div className="relative w-full h-full">
        <img
          src={npc}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 26}px`,
          }}
        />
      </div>
    </MapPlacement>
  );
};
