import React from "react";

import sunflowerRock from "assets/nfts/sunflower_rock.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const SunflowerRock: React.FC = () => {
  return (
    <img
      src={sunflowerRock}
      style={{
        width: `${PIXEL_SCALE * 80}px`,
      }}
      alt="Sunflower Rock"
    />
  );
};
