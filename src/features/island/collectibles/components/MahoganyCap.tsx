import React from "react";

import image from "assets/decorations/mahogony_cap.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const MahoganyCap: React.FC = () => {
  return (
    <SFTDetailPopover name="Mahogany Cap">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
          className="absolute"
          alt="Mahogany Cap"
        />
      </>
    </SFTDetailPopover>
  );
};
