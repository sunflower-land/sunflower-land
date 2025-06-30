import React from "react";

import potatoStatue from "assets/sfts/potato_statue.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PotatoStatue: React.FC = () => {
  return (
    <SFTDetailPopover name="Potato Statue">
      <img
        src={potatoStatue}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 1}px `,
          left: `${PIXEL_SCALE * 4}px `,
        }}
        alt="Potato Statue"
        className="absolute"
      />
    </SFTDetailPopover>
  );
};
