import React from "react";

import jellyfish from "assets/fish/jellyfish.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Jellyfish: React.FC = () => {
  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{
        width: `${PIXEL_SCALE * 19}px`,
      }}
    >
      <img src={jellyfish} className="w-full" alt="Jellyfish" />
    </div>
  );
};
