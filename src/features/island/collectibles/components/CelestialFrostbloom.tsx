import React from "react";
import celestialFrostbloom from "assets/flowers/celestial_frostbloom.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const CelestialFrostbloom: React.FC = () => {
  return (
    <SFTDetailPopover name="Celestial Frostbloom">
      <>
        <img
          src={celestialFrostbloom}
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute"
          alt="Celestial Frostbloom"
        />
      </>
    </SFTDetailPopover>
  );
};
