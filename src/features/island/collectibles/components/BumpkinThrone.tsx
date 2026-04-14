import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/bumpkins_throne.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const BumpkinThrone: React.FC = () => {
  return (
    <SFTDetailPopover name="Bumpkin Throne">
      <div
        style={{
          width: `${PIXEL_SCALE * 17}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
      >
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 17}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute left-1/2 transform -translate-x-1/2"
          alt="Bumpkin Throne"
        />
      </div>
    </SFTDetailPopover>
  );
};
