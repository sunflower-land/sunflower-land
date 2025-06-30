import React from "react";

import poppy from "assets/sfts/poppy.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Poppy: React.FC = () => {
  return (
    <SFTDetailPopover name="Poppy">
      <div className="flex justify-center items-center h-full w-full">
        <img
          src={poppy}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
          alt="Poppy"
        />
      </div>
    </SFTDetailPopover>
  );
};
