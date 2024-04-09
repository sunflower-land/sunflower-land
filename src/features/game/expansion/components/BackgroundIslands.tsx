import React from "react";

import lavaIsland from "assets/land/islands/lava_island.webp";
import greenIsland from "assets/land/islands/green_island.webp";
import cactusIsland from "assets/land/islands/cactus_island.webp";
import crabAtoll from "assets/land/islands/crab_atoll.webp";
import crossIsland from "assets/land/islands/cross_island.webp";
import potionIsland from "assets/land/islands/potion_island.webp";
import starfishAtoll from "assets/land/islands/starfish_atoll.webp";
import tombStoneIsland from "assets/land/islands/tombstone_island.webp";

const ISLANDS_WIDTH = 1536;
const ISLANDS_HEIGHT = 1088;

interface BackgroundIslandsProps {
  width: number;
  height: number;
}

export const BackgroundIslands: React.FC<BackgroundIslandsProps> = ({
  width,
  height,
}) => {
  const X_SCALE = width / ISLANDS_WIDTH;
  const Y_SCALE = height / ISLANDS_HEIGHT;

  return (
    <>
      <img
        src={lavaIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(79 * Y_SCALE),
          left: Math.round(82 * X_SCALE),
          width: 192 * X_SCALE,
        }}
      />

      <img
        src={greenIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(799 * Y_SCALE),
          left: Math.round(192 * X_SCALE),
          width: 128 * X_SCALE,
        }}
      />

      <img
        src={cactusIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(753 * Y_SCALE),
          left: Math.round(1321 * X_SCALE),
          width: 142 * X_SCALE,
        }}
      />

      <img
        src={crabAtoll}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(153 * Y_SCALE),
          left: Math.round(1241 * X_SCALE),
          width: 62 * X_SCALE,
        }}
      />

      <img
        src={starfishAtoll}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(329 * Y_SCALE),
          left: Math.round(1433 * X_SCALE),
          width: 62 * X_SCALE,
        }}
      />

      <img
        src={tombStoneIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(976 * Y_SCALE),
          left: Math.round(1053 * X_SCALE),
          width: 54 * X_SCALE,
        }}
      />

      <img
        src={potionIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(97 * Y_SCALE),
          left: Math.round(957 * X_SCALE),
          width: 54 * X_SCALE,
        }}
      />

      <img
        src={crossIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(592 * Y_SCALE),
          left: Math.round(125 * X_SCALE),
          width: 54 * X_SCALE,
        }}
      />
    </>
  );
};
