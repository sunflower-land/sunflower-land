import React from "react";

import banner from "assets/decorations/banners/clash_of_factions_banner.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ClashOfFactionsBanner: React.FC = () => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        top: `${PIXEL_SCALE * -3}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
    >
      <img
        src={banner}
        style={{
          width: `${PIXEL_SCALE * 18}px`,
        }}
        alt="Clash of Factions Banner"
      />
    </div>
  );
};
