import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { IslandType } from "features/game/types/game";

const IMAGE_GRID_WIDTH = 36;

const BASIC_LEVEL_IMAGES = {
  1: SUNNYSIDE.land.basicLevel1,
  2: SUNNYSIDE.land.basicLevel2,
  3: SUNNYSIDE.land.basicLevel3,
  4: SUNNYSIDE.land.basicLevel4,
  5: SUNNYSIDE.land.basicLevel5,
  6: SUNNYSIDE.land.basicLevel6,
  7: SUNNYSIDE.land.basicLevel7,
  8: SUNNYSIDE.land.basicLevel8,
  9: SUNNYSIDE.land.basicLevel9,
  10: SUNNYSIDE.land.basicLevel10,
  11: SUNNYSIDE.land.basicLevel11,
  12: SUNNYSIDE.land.basicLevel12,
  13: SUNNYSIDE.land.basicLevel13,
  14: SUNNYSIDE.land.basicLevel14,
  15: SUNNYSIDE.land.basicLevel15,
  16: SUNNYSIDE.land.basicLevel16,
  17: SUNNYSIDE.land.basicLevel17,
  18: SUNNYSIDE.land.basicLevel18,
  19: SUNNYSIDE.land.basicLevel19,
  20: SUNNYSIDE.land.basicLevel20,
  21: SUNNYSIDE.land.basicLevel21,
  22: SUNNYSIDE.land.basicLevel22,
  23: SUNNYSIDE.land.basicLevel23,
};

const DESERT_LEVEL_IMAGES = {
  1: SUNNYSIDE.land.desertLevel1,
  2: SUNNYSIDE.land.desertLevel2,
  3: SUNNYSIDE.land.desertLevel3,
  4: SUNNYSIDE.land.desertLevel4,
  5: SUNNYSIDE.land.desertLevel5,
  6: SUNNYSIDE.land.desertLevel6,
  7: SUNNYSIDE.land.desertLevel7,
  8: SUNNYSIDE.land.desertLevel8,
  9: SUNNYSIDE.land.desertLevel9,
  10: SUNNYSIDE.land.desertLevel10,
  11: SUNNYSIDE.land.desertLevel11,
  12: SUNNYSIDE.land.desertLevel12,
  13: SUNNYSIDE.land.desertLevel13,
  14: SUNNYSIDE.land.desertLevel14,
  15: SUNNYSIDE.land.desertLevel15,
  16: SUNNYSIDE.land.desertLevel16,
  17: SUNNYSIDE.land.desertLevel17,
  18: SUNNYSIDE.land.desertLevel18,
  19: SUNNYSIDE.land.desertLevel19,
  20: SUNNYSIDE.land.desertLevel20,
  21: SUNNYSIDE.land.desertLevel21,
  22: SUNNYSIDE.land.desertLevel22,
  23: SUNNYSIDE.land.desertLevel23,
  24: SUNNYSIDE.land.desertLevel24,
  25: SUNNYSIDE.land.desertLevel25,
};

const LEVEL_IMAGES: Record<IslandType, Record<number, string>> = {
  basic: BASIC_LEVEL_IMAGES,
  spring: BASIC_LEVEL_IMAGES,
  desert: DESERT_LEVEL_IMAGES,
};

interface Props {
  type: IslandType;
  expandedCount: number;
}

export const LandBase: React.FC<Props> = ({ type, expandedCount }) => {
  return (
    <img
      id={Section.GenesisBlock}
      src={LEVEL_IMAGES[type][expandedCount]}
      alt="land"
      className="h-auto -z-10"
      style={{
        width: `${IMAGE_GRID_WIDTH * GRID_WIDTH_PX}px`,
      }}
    />
  );
};
