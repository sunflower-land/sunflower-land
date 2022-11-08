import React from "react";

import carrotSword from "assets/sfts/carrot_sword.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const CarrotSword: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 20}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        right: `${PIXEL_SCALE * -1}px`,
      }}
    >
      <img
        src={carrotSword}
        style={{
          width: `${PIXEL_SCALE * 20}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          right: `${PIXEL_SCALE * -1}px`,
        }}
        alt="Carrot Sword"
        className="absolute"
      />
    </div>
  );
};
