import React from "react";

import image from "assets/decorations/dawn_umbrella_seat.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const DawnUmbreallSeat: React.FC = () => {
  return (
    <SFTDetailPopover name="Dawn Umbreall Seat">
      <>
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 2}px`,
          }}
          className="absolute"
          alt="Dawn Umbrella Seat"
        />
      </>
    </SFTDetailPopover>
  );
};
