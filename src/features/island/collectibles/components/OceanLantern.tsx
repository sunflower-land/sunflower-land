import React from "react";

import oceanLantern from "assets/decorations/lanterns/ocean_lantern.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const OceanLantern: React.FC = () => {
  return (
    <div className="flex justify-center items-center pointer-events-none">
      <img
        src={oceanLantern}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
        }}
        className="paper-floating"
        alt="Ocean Lantern"
      />
    </div>
  );
};
