import React from "react";

import bear from "assets/sfts/dawn_flower.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const DawnFlower: React.FC = () => {
  return (
    <SFTDetailPopover name="Dawn Flower">
      <>
        <img
          src={bear}
          style={{
            width: `${PIXEL_SCALE * 13}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1.5}px`,
          }}
          className="absolute"
          alt="Dawn Flower"
        />
      </>
    </SFTDetailPopover>
  );
};
