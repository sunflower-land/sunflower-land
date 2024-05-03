import React from "react";

import halfFullOilReserve from "assets/resources/oil/oil_reserve_half.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const RecoveringOilReserve: React.FC = () => {
  return (
    <>
      <img
        src={halfFullOilReserve}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
        alt="Full oil reserve"
      />
    </>
  );
};
