import React from "react";

import dinoFossil from "assets/sfts/dinosaur_fossil_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const DinosaurFossil: React.FC = () => {
  return (
    <>
      <img
        src={dinoFossil}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="Dinosaur Fossil"
      />
    </>
  );
};
