import React from "react";

import flowerFox from "assets/sfts/flower_fox.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const FlowerFox: React.FC = () => {
  return (
    <SFTDetailPopover name="Flower Fox">
      <div
        className="absolute flex justify-center"
        style={{
          width: `${PIXEL_SCALE * 21}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={flowerFox}
          style={{
            width: `${PIXEL_SCALE * 21}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Flower Fox"
        />
      </div>
    </SFTDetailPopover>
  );
};
