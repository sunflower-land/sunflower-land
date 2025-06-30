import React from "react";

import emeraldTurtle from "assets/sfts/aoe/emerald_turtle.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const EmeraldTurtle: React.FC = () => {
  return (
    <SFTDetailPopover name="Emerald Turtle">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * -3}px`,
          left: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={emeraldTurtle}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="Emerald Turtle"
        />
      </div>
    </SFTDetailPopover>
  );
};
