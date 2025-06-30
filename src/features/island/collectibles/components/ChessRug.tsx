import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/sfts/chess_rug.webp";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const ChessRug: React.FC = () => {
  return (
    <SFTDetailPopover name="Chess Rug">
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 64}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="ChessRug"
      />
    </SFTDetailPopover>
  );
};
