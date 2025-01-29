import React from "react";

import { CropName } from "features/game/types/crops";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CROP_LIFECYCLE, SOIL_IMAGES } from "../lib/plant";
import { IslandType } from "features/game/types/game";

export type GrowthStage = "seedling" | "halfway" | "almost" | "ready";

interface Props {
  cropName?: CropName;
  stage?: GrowthStage;
  islandType: IslandType;
}

const getCropImage = (imageSource: string): JSX.Element => {
  return (
    <img
      className="absolute pointer-events-none"
      src={imageSource}
      style={{
        top: `${PIXEL_SCALE * -12}px`,
        width: `${PIXEL_SCALE * 16}px`,
      }}
    />
  );
};

const SoilComponent: React.FC<Props> = ({ cropName, stage, islandType }) => {
  const soilImage = SOIL_IMAGES[islandType].regular;
  if (!cropName || !stage) return getCropImage(soilImage);

  const lifecycle = CROP_LIFECYCLE[islandType][cropName];

  switch (stage) {
    case "seedling":
      return getCropImage(lifecycle.seedling);
    case "halfway":
      return getCropImage(lifecycle.halfway);
    case "almost":
      return getCropImage(lifecycle.almost);
    case "ready":
      return getCropImage(lifecycle.ready);
  }
};

export const Soil = React.memo(SoilComponent);
