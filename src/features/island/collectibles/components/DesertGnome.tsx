import React from "react";

import image from "assets/sfts/desert_gnome.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const DesertGnome: React.FC = () => {
  return (
    <SFTDetailPopover name="Desert Gnome">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 9}px`,
            bottom: `${PIXEL_SCALE * 3}px`,
            left: `${PIXEL_SCALE * 3.5}px`,
          }}
          className="absolute"
          alt="DesertGnome"
        />
      </>
    </SFTDetailPopover>
  );
};
