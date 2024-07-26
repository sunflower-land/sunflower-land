import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";

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
        src={SUNNYSIDE.land.lavaIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(79 * Y_SCALE),
          left: Math.round(82 * X_SCALE),
          width: 192 * X_SCALE,
        }}
      />

      <img
        src={SUNNYSIDE.land.greenIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(799 * Y_SCALE),
          left: Math.round(192 * X_SCALE),
          width: 128 * X_SCALE,
        }}
      />

      <img
        src={SUNNYSIDE.land.cactusIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(753 * Y_SCALE),
          left: Math.round(1321 * X_SCALE),
          width: 142 * X_SCALE,
        }}
      />

      <img
        src={SUNNYSIDE.land.crabAtoll}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(153 * Y_SCALE),
          left: Math.round(1241 * X_SCALE),
          width: 62 * X_SCALE,
        }}
      />

      <img
        src={SUNNYSIDE.land.starfishAtoll}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(329 * Y_SCALE),
          left: Math.round(1433 * X_SCALE),
          width: 62 * X_SCALE,
        }}
      />

      <img
        src={SUNNYSIDE.land.tombStoneIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(976 * Y_SCALE),
          left: Math.round(1053 * X_SCALE),
          width: 54 * X_SCALE,
        }}
      />

      <img
        src={SUNNYSIDE.land.potionIsland}
        className="z-10 absolute pointer-events-none"
        style={{
          top: Math.round(97 * Y_SCALE),
          left: Math.round(957 * X_SCALE),
          width: 54 * X_SCALE,
        }}
      />

      <img
        src={SUNNYSIDE.land.crossIsland}
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
