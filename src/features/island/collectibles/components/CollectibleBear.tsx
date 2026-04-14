import React from "react";

import collectibleBear from "assets/sfts/bears/collectible_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const CollectibleBear: React.FC = () => {
  return (
    <SFTDetailPopover name="Collectible Bear">
      <>
        <img
          src={collectibleBear}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
            left: `${PIXEL_SCALE * 6}px`,
          }}
          className="absolute"
          alt="Collectible Bear"
        />
      </>
    </SFTDetailPopover>
  );
};
