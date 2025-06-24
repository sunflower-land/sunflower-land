import React from "react";

import bear from "assets/sfts/bears/sunflower_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SunflowerBear: React.FC = () => {
  return (
    <SFTDetailPopover name="Sunflower Bear">
      <>
        <img
          src={bear}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Sunflower Bear"
        />
      </>
    </SFTDetailPopover>
  );
};
