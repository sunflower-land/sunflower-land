import React from "react";

import carrotSword from "assets/sfts/carrot_sword.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const CarrotSword: React.FC = () => {
  return (
    <SFTDetailPopover name="Carrot Sword">
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 20}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -2}px`,
        }}
      >
        <img
          src={carrotSword}
          style={{
            width: `${PIXEL_SCALE * 20}px`,
          }}
          alt="Carrot Sword"
        />
      </div>
    </SFTDetailPopover>
  );
};
