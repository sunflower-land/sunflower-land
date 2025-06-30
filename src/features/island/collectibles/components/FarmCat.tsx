import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const FarmCat: React.FC = () => {
  return (
    <SFTDetailPopover name="Farm Cat">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 20}px`,
          left: `${PIXEL_SCALE * -2}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={ITEM_DETAILS["Farm Cat"].image}
          style={{
            width: `${PIXEL_SCALE * 20}px`,
          }}
          alt="Farm Cat"
        />
      </div>
    </SFTDetailPopover>
  );
};
