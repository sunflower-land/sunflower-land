import React from "react";

import { CropName } from "features/game/types/crops";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "../lib/plant";
import { FarmSprite } from "features/game/expansion/FarmSprite";

export type GrowthStage = "seedling" | "halfway" | "almost" | "ready";

interface Props {
  cropName?: CropName;
  stage?: GrowthStage;
}

const getCropImage = (imageSource: string): JSX.Element => {
  return (
    <FarmSprite
      image={imageSource}
      pointer-events="none"
      top={PIXEL_SCALE * -12}
      width={PIXEL_SCALE * 16}
      z={1}
      collide={false}
    />
  );
};

const SoilComponent: React.FC<Props> = ({ cropName, stage }) => {
  if (!cropName || !stage) return getCropImage(SUNNYSIDE.soil.soil2);

  const lifecycle = CROP_LIFECYCLE[cropName];

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
