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
  SUNNYSIDE.decorations.goldenStoneHorizontalOne,
  SUNNYSIDE.decorations.goldenStoneHorizontalTwo,
  SUNNYSIDE.decorations.goldenStoneHorizontalThree,
  SUNNYSIDE.decorations.goldenStoneHorizontalFour,
];

const verticalImages = [
  SUNNYSIDE.decorations.goldenStoneVerticalOne,
  SUNNYSIDE.decorations.goldenStoneVerticalTwo,
  SUNNYSIDE.decorations.goldenStoneVerticalThree,
  SUNNYSIDE.decorations.goldenStoneVerticalFour,
];

export const GoldenStoneFence: React.FC<Props> = ({ x, y, grid }) => {
  const edges: Edges = {
    top:
      grid[x]?.[y + 1] === "Stone Fence" ||
      grid[x]?.[y + 1] === "Fence" ||
      grid[x]?.[y + 1] === "Golden Stone Fence" ||
      grid[x]?.[y + 1] === "Golden Fence",
    right:
      grid[x + 1]?.[y] === "Stone Fence" ||
      grid[x + 1]?.[y] === "Fence" ||
      grid[x + 1]?.[y] === "Golden Stone Fence" ||
      grid[x + 1]?.[y] === "Golden Fence",
    bottom:
      grid[x]?.[y - 1] === "Stone Fence" ||
      grid[x]?.[y - 1] === "Fence" ||
      grid[x]?.[y - 1] === "Golden Stone Fence" ||
      grid[x]?.[y - 1] === "Golden Fence",
    left:
      grid[x - 1]?.[y] === "Stone Fence" ||
      grid[x - 1]?.[y] === "Fence" ||
      grid[x - 1]?.[y] === "Golden Stone Fence" ||
      grid[x - 1]?.[y] === "Golden Fence",
  };

  let image = SUNNYSIDE.decorations.goldenStoneHorizontalOne;

  if (edges.top && edges.right && edges.bottom && edges.left) {
    image = SUNNYSIDE.decorations.goldenStoneTopAndLeftAndRightAndBottom;
  } else if (edges.left && edges.right && edges.bottom) {
    image = SUNNYSIDE.decorations.goldenStoneTopAndLeftAndRight;
  } else if (edges.left && edges.right && edges.top) {
    image = SUNNYSIDE.decorations.goldenStoneBottomAndLeftAndRight;
  } else if (edges.top && edges.bottom && edges.right) {
    image = SUNNYSIDE.decorations.goldenStoneLeftTopAndBottom;
  } else if (edges.top && edges.bottom && edges.left) {
    image = SUNNYSIDE.decorations.goldenStoneRightTopAndBottom;
  } else if (edges.right && edges.bottom) {
    image = SUNNYSIDE.decorations.goldenStoneTopAndRightEdge;
  } else if (edges.left && edges.bottom) {
    image = SUNNYSIDE.decorations.goldenStoneTopAndLeftEdge;
  } else if (edges.right && edges.top) {
    image = SUNNYSIDE.decorations.goldenStoneBottomAndRightEdge;
  } else if (edges.top && edges.left) {
    image = SUNNYSIDE.decorations.goldenStoneBottomAndLeftEdge;
  } else if (edges.top && !edges.bottom) {
    image = SUNNYSIDE.decorations.goldenStoneBottom;
  } else if (edges.bottom && !edges.top) {
    image = SUNNYSIDE.decorations.goldenStoneVerticalOne;
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
