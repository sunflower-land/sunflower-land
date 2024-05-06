import React from "react";

import banner from "assets/decorations/banners/factions/bumpkins_banner.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BumpkinFactionBanner: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={banner}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
        alt="Bumpkin Faction Banner"
      />
    </div>
  );
};
