import React from "react";

import hungryCaterpillar from "assets/sfts/hungry_caterpillar.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const HungryCaterpillar: React.FC = () => {
  return (
    <SFTDetailPopover name="Hungry Caterpillar">
      <div
        className="absolute flex justify-center"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={hungryCaterpillar}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Hungry Caterpillar"
        />
      </div>
    </SFTDetailPopover>
  );
};
