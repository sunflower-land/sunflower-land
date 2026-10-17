import React from "react";

import immortalPear from "assets/sfts/immortal_pear.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const ImmortalPear: React.FC = () => {
  return (
    <SFTDetailPopover name="Immortal Pear">
      <>
        <img
          src={immortalPear}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            bottom: 0,
          }}
          className="absolute left-1/2 -translate-x-1/2"
          alt="Immortal Pear"
        />
      </>
    </SFTDetailPopover>
  );
};
