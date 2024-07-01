import React from "react";

import radianceLantern from "assets/decorations/lanterns/radiance_lantern.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const RadianceLantern: React.FC = () => {
  return (
    <div className="flex justify-center items-center pointer-events-none">
      <img
        src={radianceLantern}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
        }}
        className="paper-floating"
        alt="Radiance Lantern"
      />
    </div>
  );
};
