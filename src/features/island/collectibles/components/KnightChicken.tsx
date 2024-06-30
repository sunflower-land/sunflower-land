import React from "react";

import knightChicken from "assets/animals/chickens/knight_chicken.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const KnightChicken: React.FC = () => {
  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 23}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -5}px`,
        }}
      >
        <img
          src={knightChicken}
          style={{
            width: `${PIXEL_SCALE * 23}px`,
          }}
          alt="Knight Chicken"
        />
      </div>
    </>
  );
};
