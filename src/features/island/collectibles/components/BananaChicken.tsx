import React from "react";

import bananaChicken from "assets/animals/chickens/banana_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
export const BananaChicken: React.FC = () => {
  return (
    <SFTDetailPopover name="Banana Chicken">
      <>
        <img
          src={bananaChicken}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 0.5}px`,
          }}
          className="absolute"
          alt="Banana Chicken"
        />
      </>
    </SFTDetailPopover>
  );
};
