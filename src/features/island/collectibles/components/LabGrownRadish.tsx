import React from "react";

import labGrownRadish from "assets/sfts/lab_grown_radish.gif";
import shadow from "assets/npcs/shadow16px.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const LabGrownRadish: React.FC = () => {
  return (
    <SFTDetailPopover name="Lab Grown Radish">
      <div
        className="absolute w-full h-full pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute"
        />
        <img
          src={labGrownRadish}
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute"
          alt="Lab Grown Radish"
        />
      </div>
    </SFTDetailPopover>
  );
};
