import React from "react";

import bananaChicken from "assets/animals/chickens/banana_chicken.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import shadow from "assets/npcs/shadow.png";
export const BananaChicken: React.FC = () => {
  return (
    <>
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute pointer-events-none"
      />
      <img
        src={bananaChicken}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="El Pollo Veloz"
      />
    </>
  );
};
