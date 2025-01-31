import React from "react";

import frozenCow from "assets/sfts/frozen_mutant_cow.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const FrozenCow: React.FC = () => {
  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{
        width: `${PIXEL_SCALE * 27}px`,
      }}
    >
      <img src={frozenCow} className="w-full" alt="Frozen Cow" />
    </div>
  );
};
