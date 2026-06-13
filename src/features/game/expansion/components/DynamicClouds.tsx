import React, { useContext, useMemo } from "react";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import { SUNNYSIDE } from "assets/sunnyside";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { getLandBounds, getLandLeftEdge } from "../lib/constants";

type CloudNumber = 1 | 2 | 3 | 4 | 5 | 6;

// Source sprite sizes (the drop shadow is baked in below the puff, so the
// sprites are taller than they are wide — height matters for collision).
const CLOUD_DIMENSIONS: Record<CloudNumber, { width: number; height: number }> =
  {
    1: { width: 68, height: 78 },
    2: { width: 36, height: 62 },
    3: { width: 68, height: 78 },
    4: { width: 68, height: 78 },
    5: { width: 52, height: 62 },
    6: { width: 68, height: 78 },
  };

// Cloud variety mix, matching the proportions of the original hand-authored
// layout (11:11:2:5:1:2). Consecutive indices land far apart on the board, so
// repeats in the pool don't visually cluster.
const TYPE_POOL: CloudNumber[] = [
  1, 2, 1, 2, 4, 1, 2, 3, 1, 2, 4, 1, 2, 6, 1, 2, 4, 1, 2, 5, 1, 2, 3, 1, 2, 4,
  1, 2, 6, 1, 2, 1,
];

// One cloud per this many board tiles — the original layout's density
// (32 clouds on the 84x56 board), now kept constant as the board grows.
const TILES_PER_CLOUD = 150;

// R2 low-discrepancy sequence constants (plastic number) — deterministic,
// evenly scattered positions with no clumps and no reshuffling on re-render.
const A1 = 0.7548776662466927;
const A2 = 0.5698402909980532;
const frac = (v: number) => v - Math.floor(v);

// Clear water to keep between a relocated cloud and land/island (tiles).
const MARGIN_TILES = 1;

type Rect = { left: number; top: number; right: number; bottom: number };

const overlaps = (a: Rect, b: Rect) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

interface CloudProps {
  width: number;
  height: number;
  expansionCount: number;
}

export const DynamicClouds: React.FC<CloudProps> = ({
  width,
  height,
  expansionCount,
}) => {
  const { showAnimations } = useContext(Context);

  // Clouds are scattered evenly across the whole board, with density constant
  // per ocean area. Any cloud that would sit on the land (or the mushroom
  // island) is physically moved into the nearest open water instead.
  const clouds = useMemo(() => {
    const cx = width / 2;
    const cy = height / 2;
    const margin = MARGIN_TILES * GRID_WIDTH_PX;

    // Land bounding box in board px (tile y is up; screen y is down).
    const bounds = getLandBounds(expansionCount);
    const land: Rect = {
      left: cx + bounds.left * GRID_WIDTH_PX - margin,
      right: cx + bounds.right * GRID_WIDTH_PX + margin,
      top: cy - bounds.top * GRID_WIDTH_PX - margin,
      bottom: cy - bounds.bottom * GRID_WIDTH_PX + margin,
    };

    // The mushroom island floats off the land's left edge (see Water.tsx).
    const islandAnchorX = getLandLeftEdge(expansionCount) - 6;
    const island: Rect = {
      left: cx + islandAnchorX * GRID_WIDTH_PX - margin,
      right: cx + (islandAnchorX + 4) * GRID_WIDTH_PX + margin,
      top: cy - 7 * GRID_WIDTH_PX - margin,
      bottom: cy - 1 * GRID_WIDTH_PX + margin,
    };

    const boardTiles = (width / GRID_WIDTH_PX) * (height / GRID_WIDTH_PX);
    const count = Math.round(boardTiles / TILES_PER_CLOUD);

    return Array.from({ length: count }, (_, i) => {
      const number = TYPE_POOL[i % TYPE_POOL.length];
      const w = CLOUD_DIMENSIONS[number].width * PIXEL_SCALE;
      const h = CLOUD_DIMENSIONS[number].height * PIXEL_SCALE;

      let left = Math.round(frac(0.5 + (i + 1) * A1) * (width - w));
      let top = Math.round(frac(0.5 + (i + 1) * A2) * (height - h));

      const rect = (): Rect => ({
        left,
        top,
        right: left + w,
        bottom: top + h,
      });

      // Push out of the land along the axis needing the smallest shift.
      if (overlaps(rect(), land)) {
        const shifts: [number, () => void][] = [
          [left + w - land.left, () => (left = land.left - w)],
          [land.right - left, () => (left = land.right)],
          [top + h - land.top, () => (top = land.top - h)],
          [land.bottom - top, () => (top = land.bottom)],
        ];
        shifts.sort((a, b) => a[0] - b[0])[0][1]();
      }

      // The island sits in the water west of the land — if the cloud landed
      // on it, slide it further out into open ocean.
      if (overlaps(rect(), island)) {
        left = island.left - w;
      }

      // Keep it on the board.
      left = Math.max(0, Math.min(left, width - w));
      top = Math.max(0, Math.min(top, height - h));

      return { key: `cloud-${i}`, number, left, top, width: w };
    });
  }, [width, height, expansionCount]);

  return (
    <>
      {clouds.map((cloud) => (
        <img
          key={cloud.key}
          src={SUNNYSIDE.land[`cloud${cloud.number}`]}
          className={classNames("z-20 absolute pointer-events-none ", {
            "animate-float": showAnimations,
          })}
          style={{
            top: cloud.top,
            left: cloud.left,
            width: cloud.width,
          }}
        />
      ))}
    </>
  );
};
