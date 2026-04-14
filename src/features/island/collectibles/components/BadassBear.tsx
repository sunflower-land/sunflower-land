import React from "react";

import bear from "assets/sfts/bears/badass_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BadassBear: React.FC = () => {
  return (
    <SFTDetailPopover name="Badass Bear">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={bear}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
          }}
          alt="Badass Bear"
        />
      </div>
    </SFTDetailPopover>
  );
};
