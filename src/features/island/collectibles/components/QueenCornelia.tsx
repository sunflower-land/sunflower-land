import React from "react";

import queenCornelia from "assets/sfts/aoe/queen_cornelia.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const QueenCornelia: React.FC = () => {
  return (
    <SFTDetailPopover name="Queen Cornelia">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: 0,
        }}
      >
        <img
          src={queenCornelia}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="Queen Cornelia"
        />
      </div>
    </SFTDetailPopover>
  );
};
