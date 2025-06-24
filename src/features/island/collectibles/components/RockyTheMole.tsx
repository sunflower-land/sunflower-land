import React from "react";

import rockyTheMole from "assets/sfts/rocky_mole.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const RockyTheMole: React.FC = () => {
  return (
    <SFTDetailPopover name="Rocky The Mole">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          right: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={rockyTheMole}
          style={{
            width: `${PIXEL_SCALE * 21}px`,
          }}
          alt="Rocky The Mole"
        />
      </div>
    </SFTDetailPopover>
  );
};
