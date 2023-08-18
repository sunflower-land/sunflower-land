import React from "react";

import labGrownRadish from "assets/sfts/lab_grown_radish.gif";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const LabGrownRadish: React.FC = () => {
  return (
    <div
      className="absolute flex justify-center items-end w-full"
      style={{
        height: `${PIXEL_SCALE * 21}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 14}px`,
        }}
        className="absolute bottom-0 pointer-events-none"
      />
      <img
        src={labGrownRadish}
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Lab Grown Radish"
      />
    </div>
  );
};
