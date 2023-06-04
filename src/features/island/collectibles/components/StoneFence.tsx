import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import React from "react";

/**
 * Naming is based on which sides have borders
 * Same as padding/margin order. Top, right, down, left
 * 0_1_1_0 = No top border, right border, bottom border and no bottom border
 */
import fullEdge from "assets/decorations/fence/1_1_1_1.png";
import topAndBottomEdge from "assets/decorations/fence/1_0_1_0.png";
import topLeftAndBottomEdge from "assets/decorations/fence/1_0_1_1.png";
import topRightAndBottomEdge from "assets/decorations/fence/1_1_1_0.png";
import topRightAndLeftEdge from "assets/decorations/fence/1_1_0_1.png";
import rightBottomAndLeftEdge from "assets/decorations/fence/0_1_1_1.png";
import rightAndLeftEdge from "assets/decorations/fence/0_1_0_1.png";

import rightEdge from "assets/decorations/fence/0_1_0_0.png";
import bottomEdge from "assets/decorations/fence/0_0_1_0.png";
import topEdge from "assets/decorations/fence/1_0_0_0.png";
import leftEdge from "assets/decorations/fence/0_0_0_1.png";

import topAndLeftEdge from "assets/decorations/fence/1_0_0_1.png";
import bottomAndLeftEdge from "assets/decorations/fence/0_0_1_1.png";
import topAndRightEdge from "assets/decorations/fence/1_1_0_0.png";
import bottomAndRightEdge from "assets/decorations/fence/0_1_1_0.png";

import horizontalOne from "assets/decorations/stoneFence/x_1.png";
import horizontalTwo from "assets/decorations/stoneFence/x_2.png";
import horizontalThree from "assets/decorations/stoneFence/x_3.png";
import horizontalFour from "assets/decorations/stoneFence/x_4.png";

// Horizontal x 4
// Vertical x 2
// Left-Right-Bottom
// Left-Right-Top
// Left-Top
// Left-Bottom
// Right-Top
// Right-Bottom
// Left-Right-Top-Bottom

import { GameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

const IMAGE_PATHS: Record<string, string> = {
  top_right_bottom_left: fullEdge,
  top_left: topAndLeftEdge,
  top_right: topAndRightEdge,
  bottom_left: bottomAndLeftEdge,
  right_bottom: bottomAndRightEdge,
  top: topEdge,
  right: rightEdge,
  bottom: bottomEdge,
  left: leftEdge,
  top_bottom: topAndBottomEdge,
  right_left: rightAndLeftEdge,
  top_bottom_left: topLeftAndBottomEdge,
  top_right_bottom: topRightAndBottomEdge,
  top_right_left: topRightAndLeftEdge,
  right_bottom_left: rightBottomAndLeftEdge,
};

type Edges = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

interface Props {
  coordinates: Coordinates;
  grid: GameGrid;
}

const horizontalImages = [
  horizontalOne,
  horizontalTwo,
  horizontalThree,
  horizontalFour,
];

export const StoneFence: React.FC<Props> = ({ coordinates, grid }) => {
  const { x, y } = coordinates;

  console.log({ x, y });

  // these are the coordinates of this stone fence

  const edges: Edges = {
    // Check if there is a stone fence directly above this one
    top: grid[x]?.[y + 1] === "Stone Fence",
    // Check if there is a stone fence directly to the right of this one
    right: grid[x + 1]?.[y] === "Stone Fence",
    // Check if there is a stone fence directly below this one
    bottom: grid[x]?.[y - 1] === "Stone Fence",
    // Check if there is a stone fence directly to the left of this one
    left: grid[x - 1]?.[y] === "Stone Fence",
  };

  let image = horizontalOne;

  // If this stone fence has edges solely on the horizontal axis or the vertical axis then we need to count how many there are
  // Based on the number, we will use modular arithmetic to determine which image to use
  if (edges.right || edges.left) {
    let numberToRightOfMe = 1;

    while (grid[x + numberToRightOfMe]?.[y] === "Stone Fence") {
      numberToRightOfMe++;
    }

    console.log({ numberToRightOfMe });

    image = horizontalImages[(numberToRightOfMe - 1) % 4];
  }

  // let image = noEdge;
  const edgeNames = getKeys(edges).filter((edge) => !!edges[edge]);

  // console.log({ edgeNames });
  // const name = edgeNames.join("_");
  // const path = IMAGE_PATHS[name];
  // if (path) {
  //   image = path;
  // }

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
