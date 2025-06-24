import React from "react";

import banner from "assets/decorations/banners/factions/sunflorians_banner.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SunflorianFactionBanner: React.FC = () => {
  return (
    <SFTDetailPopover name="Sunflorian Faction Banner">
      <div
        className="flex justify-center"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
      >
        <img
          src={banner}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
          }}
          className="absolute"
          alt="Sunflorians Faction Banner"
        />
      </div>
    </SFTDetailPopover>
  );
};
