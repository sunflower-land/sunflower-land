import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import soybliss from "assets/sfts/soybliss.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const Soybliss: React.FC = () => {
  return (
    <SFTDetailPopover name="Soybliss">
      <img
        src={soybliss}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Soybliss"
      />
    </SFTDetailPopover>
  );
};
