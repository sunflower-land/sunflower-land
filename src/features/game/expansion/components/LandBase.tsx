import React from "react";

import level1 from "assets/land/levels/level_1.png";
import level2 from "assets/land/levels/level_2.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  level: number;
}

// Actual pixel width dimensions
const IMAGE_WIDTH = 512;

const LEVEL_IMAGES: Record<number, string> = {
  1: level1,
  2: level2,
};

export const LandBase: React.FC<Props> = ({ level }) => {
  console.log({ level });
  return (
    <img
      id="genesisBlock"
      src={LEVEL_IMAGES[level]}
      alt="land"
      className="h-auto"
      style={{
        width: `${IMAGE_WIDTH * PIXEL_SCALE}px`,
      }}
    />
  );
};
