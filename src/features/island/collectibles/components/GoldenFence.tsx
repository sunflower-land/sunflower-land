import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { GameGrid } from "features/game/expansion/placeable/lib/makeGrid";

const IMAGE_PATHS: Record<string, string> = {
  top_right_bottom_left: SUNNYSIDE.decorations.goldenFenceFullEdge,
  top_left: SUNNYSIDE.decorations.goldenFenceTopAndLeftEdge,
  top_right: SUNNYSIDE.decorations.goldenFenceTopAndRightEdge,
  bottom_left: SUNNYSIDE.decorations.goldenFenceBottomAndLeftEdge,
  right_bottom: SUNNYSIDE.decorations.goldenFenceBottomAndRightEdge,
  top: SUNNYSIDE.decorations.goldenFenceTopEdge,
  right: SUNNYSIDE.decorations.goldenFenceRightEdge,
  bottom: SUNNYSIDE.decorations.goldenFenceBottomEdge,
  left: SUNNYSIDE.decorations.goldenFenceLeftEdge,
  top_bottom: SUNNYSIDE.decorations.goldenFenceTopAndBottomEdge,
  right_left: SUNNYSIDE.decorations.goldenFenceRightAndLeftEdge,
  top_bottom_left: SUNNYSIDE.decorations.goldenFenceTopLeftAndBottomEdge,
  top_right_bottom: SUNNYSIDE.decorations.goldenFenceTopRightAndBottomEdge,
  top_right_left: SUNNYSIDE.decorations.goldenFenceTopRightAndLeftEdge,
  right_bottom_left: SUNNYSIDE.decorations.goldenFenceRightBottomAndLeftEdge,
};

type Edges = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

interface Props {
  x: number;
  y: number;
  grid: GameGrid;
}

export const GoldenFence: React.FC<Props> = ({ x, y, grid }) => {
  const edges: Edges = {
    top:
      grid[x]?.[y + 1] === "Fence" ||
      grid[x]?.[y + 1] === "Stone Fence" ||
      grid[x]?.[y + 1] === "Golden Fence" ||
      grid[x]?.[y + 1] === "Golden Stone Fence",
    right:
      grid[x + 1]?.[y] === "Fence" ||
      grid[x + 1]?.[y] === "Stone Fence" ||
      grid[x + 1]?.[y] === "Golden Fence" ||
      grid[x + 1]?.[y] === "Golden Stone Fence",
    bottom:
      grid[x]?.[y - 1] === "Fence" ||
      grid[x]?.[y - 1] === "Stone Fence" ||
      grid[x]?.[y - 1] === "Golden Fence" ||
      grid[x]?.[y - 1] === "Golden Stone Fence",
    left:
      grid[x - 1]?.[y] === "Fence" ||
      grid[x - 1]?.[y] === "Stone Fence" ||
      grid[x - 1]?.[y] === "Golden Fence" ||
      grid[x - 1]?.[y] === "Golden Stone Fence",
  };

  let image = SUNNYSIDE.decorations.goldenFenceNoEdge;
  const edgeNames = getKeys(edges).filter((edge) => !!edges[edge]);
  const name = edgeNames.join("_");
  const path = IMAGE_PATHS[name];
  if (path) {
    image = path;
  }

  return (
    <img
      className="absolute"
      src={image}
      key={`${x}_${y}`}
      style={{
        height: `${GRID_WIDTH_PX}px`,
        width: `${GRID_WIDTH_PX}px`,
      }}
    />
  );
};
