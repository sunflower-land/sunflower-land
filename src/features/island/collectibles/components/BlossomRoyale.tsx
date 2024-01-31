import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import blossomRoyale from "assets/sfts/blossom_royale.webp";

export const BlossomRoyale: React.FC = () => {
  return (
    <div
      className="absolute flex justify-center w-full h-ful"
      style={{
        bottom: `${PIXEL_SCALE * 0}px`,
      }}
    >
      <img
        src={blossomRoyale}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Blossom Royale"
      />
    </div>
  );
};
