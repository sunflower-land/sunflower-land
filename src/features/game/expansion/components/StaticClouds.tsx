import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";

const CLOUD_WIDTH = 1536;
const CLOUD_HEIGHT = 1088;

interface StaticCloudsProps {
  width: number;
  height: number;
}

export const StaticClouds: React.FC<StaticCloudsProps> = ({
  width,
  height,
}) => {
  const X_SCALE = width / CLOUD_WIDTH;
  const Y_SCALE = height / CLOUD_HEIGHT;

  return (
    <>
      <img
        src={SUNNYSIDE.land.mainCloudsTop}
        className="z-30 absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: Math.round(1536 * X_SCALE),
          height: Math.round(304 * Y_SCALE),
        }}
      />

      <img
        src={SUNNYSIDE.land.mainCloudsLeft}
        className="z-30 absolute pointer-events-none"
        style={{
          top: Math.round(304 * Y_SCALE),
          left: 0,
          width: Math.round(496 * X_SCALE),
          height: Math.round(528 * Y_SCALE),
        }}
      />

      <img
        src={SUNNYSIDE.land.mainCloudsRight}
        className="z-30 absolute pointer-events-none"
        style={{
          top: Math.round(304 * Y_SCALE),
          right: 0,
          width: Math.round(512 * X_SCALE),
          height: Math.round(528 * Y_SCALE),
        }}
      />

      <img
        src={SUNNYSIDE.land.mainCloudsBottom}
        className="z-30 absolute pointer-events-none"
        style={{
          top: Math.round(528 * Y_SCALE) + Math.round(304 * Y_SCALE),
          left: 0,
          width: Math.round(1536 * X_SCALE),
          height: Math.round(256 * Y_SCALE),
        }}
      />
    </>
  );
};
