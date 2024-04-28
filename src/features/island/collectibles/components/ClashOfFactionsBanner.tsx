import React from "react";

import banner from "assets/decorations/banners/clash_of_factions_banner.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ClashOfFactionsBanner: React.FC = () => {
  return (
    <>
      <img
        src={banner}
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Clash of Factions Banner"
      />
    </>
  );
};
