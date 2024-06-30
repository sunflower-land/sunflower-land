import React from "react";

import queenBee from "assets/sfts/queen_bee.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const QueenBee: React.FC = () => {
  return (
    <div className="flex justify-center">
      <img
        src={queenBee}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Queen Bee"
      />
    </div>
  );
};
