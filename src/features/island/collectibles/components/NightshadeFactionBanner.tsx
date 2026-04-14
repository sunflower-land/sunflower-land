import React from "react";

import banner from "assets/decorations/banners/factions/nightshades_banner.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const NightshadeFactionBanner: React.FC = () => {
  return (
    <SFTDetailPopover name="Nightshade Faction Banner">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 20}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={banner}
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: -5,
          }}
          className="absolute"
          alt="Nightshades Faction Banner"
        />
      </div>
    </SFTDetailPopover>
  );
};
