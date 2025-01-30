import React from "react";

import chamomile from "assets/flowers/chamomile.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Chamomile: React.FC = () => {
  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{
        width: `${PIXEL_SCALE * 14}px`,
      }}
    >
      <img src={chamomile} className="w-full" alt="Chamomile" />
    </div>
  );
};
