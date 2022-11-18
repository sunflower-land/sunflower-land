import React from "react";

import apprenticeBeaver from "assets/sfts/apprentice_beaver.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";

export const ApprenticeBeaver: React.FC = () => {
  return (
    <>
      <img
        src={apprenticeBeaver}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Apprentice Beaver"
      />
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0.1}px`,
        }}
        className="absolute w-full left z-29"
      />
    </>
  );
};
