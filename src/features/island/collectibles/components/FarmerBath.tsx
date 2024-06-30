import React from "react";

import farmerBath from "assets/sfts/farmer_bath.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FarmerBath: React.FC = () => {
  return (
    <img
      src={farmerBath}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
      }}
      className="absolute"
      alt="Farmer Bath"
    />
  );
};
