import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import flowerRug from "assets/sfts/flower_rug.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const FlowerRug: React.FC = () => {
  return (
    <SFTDetailPopover name="Flower Rug">
      <div
        className="absolute flex justify-center items-center"
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          height: `${PIXEL_SCALE * 49}px`,
        }}
      >
        <img src={flowerRug} className="w-full h-full" alt="Flower Rug" />
      </div>
    </SFTDetailPopover>
  );
};
