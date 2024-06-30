import React from "react";

import sunflowerCoin from "assets/sfts/sunflower_coin_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SunflowerCoin: React.FC = () => {
  return (
    <>
      <img
        src={sunflowerCoin}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="Sunflower Coin"
      />
    </>
  );
};
