import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { GameGrid } from "features/game/expansion/placeable/lib/makeGrid";

const IMAGE_PATHS: Record<string, string> = {
  top_right_bottom_left: SUNNYSIDE.decorations.woodFenceFullEdge,
  top_left: SUNNYSIDE.decorations.woodFenceTopAndLeftEdge,
  top_right: SUNNYSIDE.decorations.woodFenceTopAndRightEdge,
  bottom_left: SUNNYSIDE.decorations.woodFenceBottomAndLeftEdge,
  right_bottom: SUNNYSIDE.decorations.woodFenceBottomAndRightEdge,
  top: SUNNYSIDE.decorations.woodFenceTopEdge,
  right: SUNNYSIDE.decorations.woodFenceRightEdge,
  bottom: SUNNYSIDE.decorations.woodFenceBottomEdge,
  left: SUNNYSIDE.decorations.woodFenceLeftEdge,
  top_bottom: SUNNYSIDE.decorations.woodFenceTopAndBottomEdge,
  right_left: SUNNYSIDE.decorations.woodFenceRightAndLeftEdge,
  top_bottom_left: SUNNYSIDE.decorations.woodFenceTopLeftAndBottomEdge,
  top_right_bottom: SUNNYSIDE.decorations.woodFenceTopRightAndBottomEdge,
  top_right_left: SUNNYSIDE.decorations.woodFenceTopRightAndLeftEdge,
  right_bottom_left: SUNNYSIDE.decorations.woodFenceRightBottomAndLeftEdge,
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

export const Fence: React.FC<Props> = ({ x, y, grid }) => {
  const edges: Edges = {
    top: grid[x]?.[y + 1] === "Fence" || grid[x]?.[y + 1] === "Stone Fence",
    right: grid[x + 1]?.[y] === "Fence" || grid[x + 1]?.[y] === "Stone Fence",
    bottom: grid[x]?.[y - 1] === "Fence" || grid[x]?.[y - 1] === "Stone Fence",
    left: grid[x - 1]?.[y] === "Fence" || grid[x - 1]?.[y] === "Stone Fence",
  };

  let image = SUNNYSIDE.decorations.woodFenceNoEdge;
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
