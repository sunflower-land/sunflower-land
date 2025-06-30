import React from "react";

import tikiTotem from "assets/sfts/tiki_totem.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const TikiTotem: React.FC = () => {
  return (
    <SFTDetailPopover name="Tiki Totem">
      <>
        <img
          src={tikiTotem}
          style={{
            width: `${PIXEL_SCALE * 13}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute"
          alt="Tiki Totem"
        />
      </>
    </SFTDetailPopover>
  );
};
