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
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="absolute"
          alt="Immortal Pear"
        />
      </>
    </SFTDetailPopover>
  );
};
