import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { GameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import { SUNNYSIDE } from "assets/sunnyside";

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

const horizontalImages = [
  SUNNYSIDE.decorations.stoneHorizontalOne,
  SUNNYSIDE.decorations.stoneHorizontalTwo,
  SUNNYSIDE.decorations.stoneHorizontalThree,
  SUNNYSIDE.decorations.stoneHorizontalFour,
];

const verticalImages = [
  SUNNYSIDE.decorations.stoneVerticalOne,
  SUNNYSIDE.decorations.stoneVerticalTwo,
  SUNNYSIDE.decorations.stoneVerticalThree,
  SUNNYSIDE.decorations.stoneVerticalFour,
];

export const StoneFence: React.FC<Props> = ({ x, y, grid }) => {
  const edges: Edges = {
    top: grid[x]?.[y + 1] === "Stone Fence" || grid[x]?.[y + 1] === "Fence",
    right: grid[x + 1]?.[y] === "Stone Fence" || grid[x + 1]?.[y] === "Fence",
    bottom: grid[x]?.[y - 1] === "Stone Fence" || grid[x]?.[y - 1] === "Fence",
    left: grid[x - 1]?.[y] === "Stone Fence" || grid[x - 1]?.[y] === "Fence",
  };

  let image = SUNNYSIDE.decorations.stoneHorizontalOne;

  if (edges.top && edges.right && edges.bottom && edges.left) {
    image = SUNNYSIDE.decorations.stoneTopAndLeftAndRightAndBottom;
  } else if (edges.left && edges.right && edges.bottom) {
    image = SUNNYSIDE.decorations.stoneTopAndLeftAndRight;
  } else if (edges.left && edges.right && edges.top) {
    image = SUNNYSIDE.decorations.stoneBottomAndLeftAndRight;
  } else if (edges.top && edges.bottom && edges.right) {
    image = SUNNYSIDE.decorations.stoneLeftTopAndBottom;
  } else if (edges.top && edges.bottom && edges.left) {
    image = SUNNYSIDE.decorations.stoneRightTopAndBottom;
  } else if (edges.right && edges.bottom) {
    image = SUNNYSIDE.decorations.stoneTopAndRightEdge;
  } else if (edges.left && edges.bottom) {
    image = SUNNYSIDE.decorations.stoneTopAndLeftEdge;
  } else if (edges.right && edges.top) {
    image = SUNNYSIDE.decorations.stoneBottomAndRightEdge;
  } else if (edges.top && edges.left) {
    image = SUNNYSIDE.decorations.stoneBottomAndLeftEdge;
  } else if (edges.top && !edges.bottom) {
    image = SUNNYSIDE.decorations.stoneBottom;
  } else if (edges.bottom && !edges.top) {
    image = SUNNYSIDE.decorations.stoneVerticalOne;
  } else if (edges.right) {
    let numberToRightOfMe = 1;
    while (grid[x + numberToRightOfMe]?.[y] === "Stone Fence") {
      numberToRightOfMe++;
    }
    image = horizontalImages[(numberToRightOfMe - 1) % 4];
  } else if (edges.left) {
    let numberToLeftOfMe = 1;
    while (grid[x - numberToLeftOfMe]?.[y] === "Stone Fence") {
      numberToLeftOfMe++;
    }
    image = horizontalImages[(numberToLeftOfMe - 1) % 4];
  } else if (edges.top) {
    let numberAboveMe = 1;
    while (grid[x]?.[y + numberAboveMe] === "Stone Fence") {
      numberAboveMe++;
    }
    image = verticalImages[(numberAboveMe - 1) % 4];
  } else if (edges.bottom) {
    let numberBelowMe = 1;
    while (grid[x]?.[y - numberBelowMe] === "Stone Fence") {
      numberBelowMe++;
    }
    image = verticalImages[(numberBelowMe - 1) % 4];
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
