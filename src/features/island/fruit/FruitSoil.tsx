import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SOIL_IMAGES } from "../plots/lib/plant";
import { getCurrentBiome } from "../biomes/biomes";
import { useIsland } from "features/game/hooks";

export const FruitSoil: React.FC = () => {
  const island = useIsland();

  const biome = getCurrentBiome(island);
  const soilImage = SOIL_IMAGES[biome].regular;

  return (
    <div className="absolute w-full h-full cursor-pointer hover:img-highlight">
      <img
        src={soilImage}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          left: `${PIXEL_SCALE * 8}px`,
          bottom: `${PIXEL_SCALE * 9}px`,
        }}
      />
    </div>
  );
};
