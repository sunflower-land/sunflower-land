import React from "react";

import banner from "assets/decorations/banners/factions/goblins_banner.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const GoblinFactionBanner: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 20}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={banner}
        style={{
          width: `${PIXEL_SCALE * 20}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: -5,
        }}
        className="absolute"
        alt="Goblin Banner"
      />
    </div>
  );
};
