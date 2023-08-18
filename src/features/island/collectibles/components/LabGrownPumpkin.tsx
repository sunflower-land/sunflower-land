import React from "react";

import labGrownPumpkin from "assets/sfts/lab_grown_pumpkin.gif";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const LabGrownPumpkin: React.FC = () => {
  return (
    <div
      className="absolute flex justify-center items-end w-full"
      style={{
        height: `${PIXEL_SCALE * 20}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
        }}
        className="absolute bottom-0 pointer-events-none"
      />
      <img
        src={labGrownPumpkin}
        style={{
          width: `${PIXEL_SCALE * 12}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Lab Grown Pumpkin"
      />
    </div>
  );
};
