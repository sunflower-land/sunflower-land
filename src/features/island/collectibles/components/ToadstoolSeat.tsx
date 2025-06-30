import React from "react";

import image from "assets/decorations/toadstool_seat.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const ToadstoolSeat: React.FC = () => {
  return (
    <SFTDetailPopover name="Toadstool Seat">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 2}px`,
          }}
          className="absolute"
          alt="Toadstool Seat"
        />
      </>
    </SFTDetailPopover>
  );
};
