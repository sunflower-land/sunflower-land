import React from "react";

import tent from "assets/land/tent_inside.png";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Hud } from "features/island/hud/Hud";

export const Home: React.FC = () => {
  return (
    <>
      <Hud isFarming />
      <div className="absolute inset-0 bg-black">
        <img
          src={tent}
          style={{
            width: `${12 * GRID_WIDTH_PX}px`,
            height: `${12 * GRID_WIDTH_PX}px`,
          }}
        />
      </div>
    </>
  );
};
