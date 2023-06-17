import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { GameGrid } from "features/game/expansion/placeable/lib/makeGrid";

import topAndRightEdge from "assets/decorations/stoneFence/top_right.png";
import topAndLeftEdge from "assets/decorations/stoneFence/top_left.png";
import bottomAndLeftEdge from "assets/decorations/stoneFence/bottom_left.png";
import bottomAndRightEdge from "assets/decorations/stoneFence/bottom_right.png";
import topAndLeftAndRightAndBottom from "assets/decorations/stoneFence/top_left_right_bottom.png";
import topAndLeftAndRight from "assets/decorations/stoneFence/top_left_right.png";
import bottomAndLeftAndRight from "assets/decorations/stoneFence/bottom_left_right.png";
import rightTopAndBottom from "assets/decorations/stoneFence/right_top_bottom.png";
import leftTopAndBottom from "assets/decorations/stoneFence/left_top_bottom.png";
import bottom from "assets/decorations/stoneFence/bottom.png";

import horizontalOne from "assets/decorations/stoneFence/x_1.png";
import horizontalTwo from "assets/decorations/stoneFence/x_2.png";
import horizontalThree from "assets/decorations/stoneFence/x_3.png";
import horizontalFour from "assets/decorations/stoneFence/x_4.png";

import verticalOne from "assets/decorations/stoneFence/y_1.png";
import verticalTwo from "assets/decorations/stoneFence/y_2.png";
import verticalThree from "assets/decorations/stoneFence/y_3.png";
import verticalFour from "assets/decorations/stoneFence/y_2.png";

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
  horizontalOne,
  horizontalTwo,
  horizontalThree,
  horizontalFour,
];

const verticalImages = [verticalOne, verticalTwo, verticalThree, verticalFour];

export const StoneFence: React.FC<Props> = ({ x, y, grid }) => {
  const edges: Edges = {
    top: grid[x]?.[y + 1] === "Stone Fence" || grid[x]?.[y + 1] === "Fence",
    right: grid[x + 1]?.[y] === "Stone Fence" || grid[x + 1]?.[y] === "Fence",
    bottom: grid[x]?.[y - 1] === "Stone Fence" || grid[x]?.[y - 1] === "Fence",
    left: grid[x - 1]?.[y] === "Stone Fence" || grid[x - 1]?.[y] === "Fence",
  };

  let image = horizontalOne;

  if (edges.top && edges.right && edges.bottom && edges.left) {
    image = topAndLeftAndRightAndBottom;
  } else if (edges.left && edges.right && edges.bottom) {
    image = topAndLeftAndRight;
  } else if (edges.left && edges.right && edges.top) {
    image = bottomAndLeftAndRight;
  } else if (edges.top && edges.bottom && edges.right) {
    image = leftTopAndBottom;
  } else if (edges.top && edges.bottom && edges.left) {
    image = rightTopAndBottom;
  } else if (edges.right && edges.bottom) {
    image = topAndRightEdge;
  } else if (edges.left && edges.bottom) {
    image = topAndLeftEdge;
  } else if (edges.right && edges.top) {
    image = bottomAndRightEdge;
  } else if (edges.top && edges.left) {
    image = bottomAndLeftEdge;
  } else if (edges.top && !edges.bottom) {
    image = bottom;
  } else if (edges.bottom && !edges.top) {
    image = verticalOne;
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
