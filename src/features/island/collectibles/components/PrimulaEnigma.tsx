import React from "react";
import primulaEnigma from "assets/flowers/primula_enigma.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PrimulaEnigma: React.FC = () => {
  return (
    <>
      <img
        src={primulaEnigma}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Primula Enigma"
      />
    </>
  );
};
