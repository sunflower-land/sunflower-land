import React from "react";

import fullOilReserve from "assets/resources/oil/oil_reserve_full.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const RecoveredOilReserve: React.FC = () => {
  return (
    <>
      <img
        src={fullOilReserve}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
        alt="Full oil reserve"
      />
    </>
  );
};
