import React from "react";

import farmerBath from "assets/nfts/farm_dog.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const FarmerBath: React.FC = () => {
  return (
    <img
      src={farmerBath}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Farmer Bath"
    />
  );
};
