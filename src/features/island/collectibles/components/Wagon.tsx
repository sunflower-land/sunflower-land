import React from "react";

import wagon from "assets/decorations/wagon.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Wagon: React.FC = () => {
  return (
    <div
      className="absolute flex justify-center w-full h-ful"
      style={{
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={wagon}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Wagon"
      />
    </div>
  );
};
