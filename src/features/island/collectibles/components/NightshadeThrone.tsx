import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/nightshade_throne.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const NightshadeThrone: React.FC = () => {
  return (
    <SFTDetailPopover name="Nightshade Throne">
      <div
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
      >
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute left-1/2 transform -translate-x-1/2"
          alt="Nightshade Throne"
        />
      </div>
    </SFTDetailPopover>
  );
};
