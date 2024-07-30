import React, { useContext } from "react";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import { SUNNYSIDE } from "assets/sunnyside";

type CloudNumber = 1 | 2 | 3 | 4 | 5 | 6;

const CLOUD_DIMENSIONS: Record<CloudNumber, { width: number }> = {
  1: { width: 68 },
  2: { width: 36 },
  3: { width: 68 },
  4: { width: 68 },
  5: { width: 52 },
  6: { width: 68 },
};

const CLOUDS: Record<CloudNumber, [number, number][]> = {
  1: [
    [214, 6],
    [54, 310],
    [262, 726],
    [358, 838],
    [294, 934],
    [918, 38],
    [1350, 86],
    [1366, 326],
    [838, 902],
    [966, 790],
    [854, 262],
  ],
  2: [
    [374, 262],
    [550, 86],
    [294, 582],
    [486, 662],
    [566, 934],
    [758, 806],
    [1062, 886],
    [1014, 614],
    [1158, 534],
    [1158, 310],
    [982, 278],
  ],
  3: [
    [694, 246],
    [454, 342],
  ],
  4: [
    [438, 502],
    [470, 758],
    [838, 806],
    [1030, 678],
    [998, 358],
  ],
  5: [[566, 246]],
  6: [
    [566, 790],
    [1046, 470],
  ],
};

const CLOUD_WIDTH = 1536;
const CLOUD_HEIGHT = 1088;

interface CloudProps {
  width: number;
  height: number;
}

export const DynamicClouds: React.FC<CloudProps> = ({ width, height }) => {
  const { showAnimations } = useContext(Context);

  const X_SCALE = width / CLOUD_WIDTH;
  const Y_SCALE = height / CLOUD_HEIGHT;

  return (
    <>
      {CLOUDS[1].map((cloud, i) => (
        <img
          key={`cloud1-${i}`}
          src={SUNNYSIDE.land.cloud1}
          className={classNames("z-20 absolute pointer-events-none ", {
            "animate-float": showAnimations,
          })}
          style={{
            top: Math.round(cloud[1] * Y_SCALE),
            left: Math.round(cloud[0] * X_SCALE),
            width: CLOUD_DIMENSIONS[1].width * X_SCALE,
          }}
        />
      ))}

      {CLOUDS[2].map((cloud, i) => (
        <img
          key={`cloud2-${i}`}
          src={SUNNYSIDE.land.cloud2}
          className={classNames("z-20 absolute pointer-events-none ", {
            "animate-float": showAnimations,
          })}
          style={{
            top: Math.round(cloud[1] * Y_SCALE),
            left: Math.round(cloud[0] * X_SCALE),
            width: CLOUD_DIMENSIONS[2].width * X_SCALE,
          }}
        />
      ))}

      {CLOUDS[3].map((cloud, i) => (
        <img
          key={`cloud3-${i}`}
          src={SUNNYSIDE.land.cloud3}
          className={classNames("z-20 absolute pointer-events-none ", {
            "animate-float": showAnimations,
          })}
          style={{
            top: Math.round(cloud[1] * Y_SCALE),
            left: Math.round(cloud[0] * X_SCALE),
            width: Math.round(CLOUD_DIMENSIONS[3].width * X_SCALE),
          }}
        />
      ))}

      {CLOUDS[4].map((cloud, i) => (
        <img
          key={`cloud4-${i}`}
          src={SUNNYSIDE.land.cloud4}
          className={classNames("z-20 absolute pointer-events-none ", {
            "animate-float": showAnimations,
          })}
          style={{
            top: Math.round(cloud[1] * Y_SCALE),
            left: Math.round(cloud[0] * X_SCALE),
            width: CLOUD_DIMENSIONS[4].width * X_SCALE,
          }}
        />
      ))}

      {CLOUDS[5].map((cloud, i) => (
        <img
          key={`cloud5-${i}`}
          src={SUNNYSIDE.land.cloud5}
          className={classNames("z-20 absolute pointer-events-none ", {
            "animate-float": showAnimations,
          })}
          style={{
            top: Math.round(cloud[1] * Y_SCALE),
            left: Math.round(cloud[0] * X_SCALE),
            width: CLOUD_DIMENSIONS[5].width * X_SCALE,
          }}
        />
      ))}

      {CLOUDS[6].map((cloud, i) => (
        <img
          key={`cloud6-${i}`}
          src={SUNNYSIDE.land.cloud6}
          className={classNames("z-20 absolute pointer-events-none ", {
            "animate-float": showAnimations,
          })}
          style={{
            top: Math.round(cloud[1] * Y_SCALE),
            left: Math.round(cloud[0] * X_SCALE),
            width: CLOUD_DIMENSIONS[6].width * X_SCALE,
          }}
        />
      ))}
    </>
  );
};
