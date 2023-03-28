import React from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";

export const HomelessMan: React.FC = () => {
  return (
    <MapPlacement x={-1.3} y={4.5} height={1} width={1}>
      <div className="relative w-full h-full">
        <NPC
          body="Beige Farmer Potion"
          shirt="Gray Shirt"
          pants="Brown Suspenders"
          hair="Gray Hair"
        />
      </div>
    </MapPlacement>
  );
};
