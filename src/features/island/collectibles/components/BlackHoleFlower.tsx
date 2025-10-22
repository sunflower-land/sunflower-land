import React from "react";

import image from "assets/sfts/black_hole_flower.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BlackHoleFlower: React.FC = () => {
  return (
    <SFTDetailPopover name="Black Hole Flower">
      <img
        src={image}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        alt="Black Hole Flower"
      />
    </SFTDetailPopover>
  );
};
