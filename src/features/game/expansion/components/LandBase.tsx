import React from "react";

import basicLevel1 from "assets/land/levels/basic/level_1.webp";
import basicLevel2 from "assets/land/levels/basic/level_2.webp";
import basicLevel3 from "assets/land/levels/basic/level_3.webp";
import basicLevel4 from "assets/land/levels/basic/level_4.webp";
import basicLevel5 from "assets/land/levels/basic/level_5.webp";
import basicLevel6 from "assets/land/levels/basic/level_6.webp";
import basicLevel7 from "assets/land/levels/basic/level_7.webp";
import basicLevel8 from "assets/land/levels/basic/level_8.webp";
import basicLevel9 from "assets/land/levels/basic/level_9.webp";
import basicLevel10 from "assets/land/levels/basic/level_10.webp";
import basicLevel11 from "assets/land/levels/basic/level_11.webp";
import basicLevel12 from "assets/land/levels/basic/level_12.webp";
import basicLevel13 from "assets/land/levels/basic/level_13.webp";
import basicLevel14 from "assets/land/levels/basic/level_14.webp";
import basicLevel15 from "assets/land/levels/basic/level_15.webp";
import basicLevel16 from "assets/land/levels/basic/level_16.webp";
import basicLevel17 from "assets/land/levels/basic/level_17.webp";
import basicLevel18 from "assets/land/levels/basic/level_18.webp";
import basicLevel19 from "assets/land/levels/basic/level_19.webp";
import basicLevel20 from "assets/land/levels/basic/level_20.webp";
import basicLevel21 from "assets/land/levels/basic/level_21.webp";
import basicLevel22 from "assets/land/levels/basic/level_22.webp";
import basicLevel23 from "assets/land/levels/basic/level_23.webp";

import desertLevel1 from "assets/land/levels/desert/level_1.webp";
import desertLevel2 from "assets/land/levels/desert/level_2.webp";
import desertLevel3 from "assets/land/levels/desert/level_3.webp";
import desertLevel4 from "assets/land/levels/desert/level_4.webp";
import desertLevel5 from "assets/land/levels/desert/level_5.webp";
import desertLevel6 from "assets/land/levels/desert/level_6.webp";
import desertLevel7 from "assets/land/levels/desert/level_7.webp";
import desertLevel8 from "assets/land/levels/desert/level_8.webp";
import desertLevel9 from "assets/land/levels/desert/level_9.webp";
import desertLevel10 from "assets/land/levels/desert/level_10.webp";
import desertLevel11 from "assets/land/levels/desert/level_11.webp";
import desertLevel12 from "assets/land/levels/desert/level_12.webp";
import desertLevel13 from "assets/land/levels/desert/level_13.webp";
import desertLevel14 from "assets/land/levels/desert/level_14.webp";
import desertLevel15 from "assets/land/levels/desert/level_15.webp";
import desertLevel16 from "assets/land/levels/desert/level_16.webp";
import desertLevel17 from "assets/land/levels/desert/level_17.webp";
import desertLevel18 from "assets/land/levels/desert/level_18.webp";
import desertLevel19 from "assets/land/levels/desert/level_19.webp";
import desertLevel20 from "assets/land/levels/desert/level_20.webp";
import desertLevel21 from "assets/land/levels/desert/level_21.webp";
import desertLevel22 from "assets/land/levels/desert/level_22.webp";
import desertLevel23 from "assets/land/levels/desert/level_23.webp";
import desertLevel24 from "assets/land/levels/desert/level_24.webp";
import desertLevel25 from "assets/land/levels/desert/level_25.webp";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { IslandType } from "features/game/types/game";

const IMAGE_GRID_WIDTH = 36;

const BASIC_LEVEL_IMAGES = {
  1: basicLevel1,
  2: basicLevel2,
  3: basicLevel3,
  4: basicLevel4,
  5: basicLevel5,
  6: basicLevel6,
  7: basicLevel7,
  8: basicLevel8,
  9: basicLevel9,
  10: basicLevel10,
  11: basicLevel11,
  12: basicLevel12,
  13: basicLevel13,
  14: basicLevel14,
  15: basicLevel15,
  16: basicLevel16,
  17: basicLevel17,
  18: basicLevel18,
  19: basicLevel19,
  20: basicLevel20,
  21: basicLevel21,
  22: basicLevel22,
  23: basicLevel23,
};

const DESERT_LEVEL_IMAGES = {
  1: desertLevel1,
  2: desertLevel2,
  3: desertLevel3,
  4: desertLevel4,
  5: desertLevel5,
  6: desertLevel6,
  7: desertLevel7,
  8: desertLevel8,
  9: desertLevel9,
  10: desertLevel10,
  11: desertLevel11,
  12: desertLevel12,
  13: desertLevel13,
  14: desertLevel14,
  15: desertLevel15,
  16: desertLevel16,
  17: desertLevel17,
  18: desertLevel18,
  19: desertLevel19,
  20: desertLevel20,
  21: desertLevel21,
  22: desertLevel22,
  23: desertLevel23,
  24: desertLevel24,
  25: desertLevel25,
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
