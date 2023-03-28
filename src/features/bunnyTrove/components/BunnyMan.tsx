import React from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";
import bunny from "assets/events/easter/2023/npcs/jumping_bunny.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BunnyMan: React.FC = () => {
  return (
    <>
      <MapPlacement x={-7.1} y={1.5} height={1} width={1}>
        <div className="relative w-full h-full">
          <NPC
            body="Beige Farmer Potion"
            shirt="Red Farmer Shirt"
            pants="Brown Suspenders"
            hair="Sun Spots"
            onesie="Bunny Onesie"
          />
        </div>
      </MapPlacement>
      <MapPlacement x={8} y={-1.5} height={1} width={3}>
        <div className="relative w-full h-full">
          <img
            src={bunny}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 30}px`,
            }}
          />
        </div>
      </MapPlacement>
    </>
  );
};
