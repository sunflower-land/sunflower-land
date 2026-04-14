import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import enchantedRose from "assets/sfts/enchanted_rose.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const EnchantedRose: React.FC = () => {
  return (
    <SFTDetailPopover name="Enchanted Rose">
      <div className="flex justify-center">
        <img
          src={enchantedRose}
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Enchanted Rose"
        />
      </div>
    </SFTDetailPopover>
  );
};
