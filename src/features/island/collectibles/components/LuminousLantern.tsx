import React from "react";

import luminousLantern from "assets/decorations/lanterns/luminous_lantern.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const LuminousLantern: React.FC = () => {
  return (
    <div className="flex justify-center items-center pointer-events-none">
      <img
        src={luminousLantern}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
        }}
        className="paper-floating"
        alt="Luminous Lantern"
      />
    </div>
  );
};
