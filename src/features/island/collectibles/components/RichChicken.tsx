import React from "react";

import richChicken from "assets/animals/chickens/rich_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const RichChicken: React.FC = () => {
  return (
    <SFTDetailPopover name="Rich Chicken">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          right: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={richChicken}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
          alt="Rich Chicken"
        />
      </div>
    </SFTDetailPopover>
  );
};
