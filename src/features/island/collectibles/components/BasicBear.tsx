import React from "react";

import basicBear from "assets/sfts/bears/basic_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BasicBear: React.FC = () => {
  return (
    <SFTDetailPopover name="Basic Bear">
      <>
        <img
          src={basicBear}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Basic Bear"
        />
      </>
    </SFTDetailPopover>
  );
};
