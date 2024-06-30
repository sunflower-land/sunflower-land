import React from "react";

import banner from "assets/decorations/banners/lifetime_farmer_banner.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const LifetimeFarmerBanner: React.FC = () => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        top: `${PIXEL_SCALE * -3}px`,
      }}
    >
      <img
        src={banner}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
        alt="Lifetime Farmer Banner"
      />
    </div>
  );
};
