import React from "react";

import potatoStatue from "assets/sfts/potato_statue.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PotatoStatue: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 2}px `,
        right: `${PIXEL_SCALE * 2}px `,
      }}
    >
      <img
        src={potatoStatue}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 2}px `,
          right: `${PIXEL_SCALE * 2}px `,
        }}
        alt="Potato Statue"
        className="absolute"
      />
    </div>
  );
};
