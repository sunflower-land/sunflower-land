import React from "react";

import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { MARKET_VARIANTS } from "features/island/lib/alternateArt";
import { getCurrentBiome } from "features/island/biomes/biomes";

export const FishHouse: React.FC<BuildingProps> = ({ island, season }) => {
  const biome = getCurrentBiome(island);

  // Using the market images as a placeholder
  // TODO: Replace with the fish house images

  return (
    <BuildingImageWrapper name="Fish House" nonInteractible>
      <img
        src={MARKET_VARIANTS[biome][season]}
        className="absolute bottom-0 pointer-events-none"
        style={{ width: `${PIXEL_SCALE * 48}px` }}
      />
    </BuildingImageWrapper>
  );
};
