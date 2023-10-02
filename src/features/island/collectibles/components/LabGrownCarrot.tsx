import React from "react";

import labGrownCarrot from "assets/sfts/lab_grown_carrot.gif";
import shadow from "assets/npcs/shadow16px.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const LabGrownCarrot: React.FC = () => {
  return (
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
        src={labGrownCarrot}
        style={{
          width: `${PIXEL_SCALE * 12}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Lab Grown Carrot"
      />
    </div>
  );
};
