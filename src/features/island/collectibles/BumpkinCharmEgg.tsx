import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import image from "assets/factions/bumpkin_charm_egg.webp";

export const BumpkinCharmEgg: React.FC = () => {
  return (
    <div
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `-${PIXEL_SCALE * 0}px`,
      }}
      className="absolute left-1/2 transform -translate-x-1/2"
    >
      <img
        src={image}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `-${PIXEL_SCALE * 0}px`,
        }}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt="Bumpkin Charm Egg"
      />
    </div>
  );
};
