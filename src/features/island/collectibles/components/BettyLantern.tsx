import React from "react";

import bettyLantern from "assets/decorations/lanterns/betty_lantern.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BettyLantern: React.FC = () => {
  return (
    <div className="flex justify-center items-center pointer-events-none">
      <img
        src={bettyLantern}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
        }}
        className="paper-floating"
        alt="Betty Lantern"
      />
    </div>
  );
};
