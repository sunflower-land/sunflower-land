import React from "react";

import tinTurtle from "assets/sfts/aoe/tin_turtle.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const TinTurtle: React.FC = () => {
  return (
    <SFTDetailPopover name="Tin Turtle">
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * -3}px`,
          left: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img
          src={tinTurtle}
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            bottom: 0,
          }}
          className="absolute"
          alt="Tin Turtle"
        />
      </div>
    </SFTDetailPopover>
  );
};
