import React from "react";

import chefBear from "assets/sfts/bears/chef_bear.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ChefBear: React.FC = () => {
  return (
    <>
      <img
        src={chefBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Chef Bear"
      />
    </>
  );
};
