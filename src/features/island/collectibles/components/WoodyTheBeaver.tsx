import React from "react";

import woodyTheBeaver from "assets/sfts/beaver.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";

export const WoodyTheBeaver: React.FC = () => {
  return (
    <>
      <img
        src={woodyTheBeaver}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Woody the Beaver"
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
