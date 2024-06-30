import React from "react";
import celestialFrostbloom from "assets/flowers/celestial_frostbloom.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const CelestialFrostbloom: React.FC = () => {
  return (
    <>
      <img
        src={celestialFrostbloom}
        style={{
          width: `${PIXEL_SCALE * 12}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Celestial Frostbloom"
      />
    </>
  );
};
