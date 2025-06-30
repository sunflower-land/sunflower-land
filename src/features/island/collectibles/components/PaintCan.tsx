import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/paint_can.png";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const PaintCan: React.FC = () => {
  return (
    <SFTDetailPopover name="Paint Can">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 21}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 5.5}px`,
          }}
          className="absolute"
          alt="Paint Can"
        />
      </>
    </SFTDetailPopover>
  );
};
