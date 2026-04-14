import React from "react";

import nugget from "assets/sfts/nugget.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Nugget: React.FC = () => {
  return (
    <SFTDetailPopover name="Nugget">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          right: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={nugget}
          style={{
            width: `${PIXEL_SCALE * 21}px`,
          }}
          alt="Nugget"
        />
      </div>
    </SFTDetailPopover>
  );
};
