import React from "react";

import { PlotCropName } from "features/game/types/crops";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "../lib/plant";

export type GrowthStage = "seedling" | "halfway" | "almost" | "ready";

interface Props {
  cropName?: PlotCropName;
  stage?: GrowthStage;
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
