import React from "react";

import banner from "assets/decorations/banners/pharaohs_treasure_banner.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PharaohsTreasureBanner: React.FC = () => {
  return (
    <SFTDetailPopover name="Pharaoh's Treasure Banner">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          top: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={banner}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
          alt="Pharaoh's Treasure Banner"
        />
      </div>
    </SFTDetailPopover>
  );
};
