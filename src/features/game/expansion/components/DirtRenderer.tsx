import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import React, { memo } from "react";

/**
 * Naming is based on which sides have borders
 * Same as padding/margin order. Top, right, down, left
 * 0_1_1_0 = No top border, right border, bottom border and no bottom border
 */
import fullEdge from "assets/land/dirt/1_1_1_1.png";
import desertFullEdge from "assets/desert/land/dirt/1_1_1_1.png";

import noEdge from "assets/land/dirt/0_0_0_0.png";
import desertNoEdge from "assets/desert/land/dirt/0_0_0_0.png";

import topAndBottomEdge from "assets/land/dirt/1_0_1_0.png";
import desertTopAndBottomEdge from "assets/desert/land/dirt/1_0_1_0.png";

import topLeftAndBottomEdge from "assets/land/dirt/1_0_1_1.png";
import desertTopLeftAndBottomEdge from "assets/desert/land/dirt/1_0_1_1.png";

import topRightAndBottomEdge from "assets/land/dirt/1_1_1_0.png";
import desertTopRightAndBottomEdge from "assets/desert/land/dirt/1_1_1_0.png";

import topRightAndLeftEdge from "assets/land/dirt/1_1_0_1.png";
import desertTopRightAndLeftEdge from "assets/desert/land/dirt/1_1_0_1.png";

import rightBottomAndLeftEdge from "assets/land/dirt/0_1_1_1.png";
import desertRightBottomAndLeftEdge from "assets/desert/land/dirt/0_1_1_1.png";

import rightAndLeftEdge from "assets/land/dirt/0_1_0_1.png";
import desertRightAndLeftEdge from "assets/desert/land/dirt/0_1_0_1.png";

import rightEdge from "assets/land/dirt/0_1_0_0.png";
import desertRightEdge from "assets/desert/land/dirt/0_1_0_0.png";

import bottomEdge from "assets/land/dirt/0_0_1_0.png";
import desertBottomEdge from "assets/desert/land/dirt/0_0_1_0.png";

import topEdge from "assets/land/dirt/1_0_0_0.png";
import desertTopEdge from "assets/desert/land/dirt/1_0_0_0.png";

import leftEdge from "assets/land/dirt/0_0_0_1.png";
import desertLeftEdge from "assets/desert/land/dirt/0_0_0_1.png";

import topAndLeftEdge from "assets/land/dirt/1_0_0_1.png";
import desertTopAndLeftEdge from "assets/desert/land/dirt/1_0_0_1.png";

import bottomAndLeftEdge from "assets/land/dirt/0_0_1_1.png";
import desertBottomAndLeftEdge from "assets/desert/land/dirt/0_0_1_1.png";

import topAndRightEdge from "assets/land/dirt/1_1_0_0.png";
import desertTopAndRightEdge from "assets/desert/land/dirt/1_1_0_0.png";

import bottomAndRightEdge from "assets/land/dirt/0_1_1_0.png";
import desertBottomAndRightEdge from "assets/desert/land/dirt/0_1_1_0.png";

import { GameGrid } from "../placeable/lib/makeGrid";
import { IslandType } from "features/game/types/game";

type CropAlternateArt = Record<IslandType, string>;

const NO_EDGE: CropAlternateArt = {
  basic: noEdge,
  spring: noEdge,
  desert: desertNoEdge,
};

const TOP_RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  basic: fullEdge,
  spring: fullEdge,
  desert: desertFullEdge,
};

const TOP_LEFT: CropAlternateArt = {
  basic: topAndLeftEdge,
  spring: topAndLeftEdge,
  desert: desertTopAndLeftEdge,
};

const TOP_RIGHT: CropAlternateArt = {
  basic: topAndRightEdge,
  spring: topAndRightEdge,
  desert: desertTopAndRightEdge,
};

const BOTTOM_LEFT: CropAlternateArt = {
  basic: bottomAndLeftEdge,
  spring: bottomAndLeftEdge,
  desert: desertBottomAndLeftEdge,
};

const RIGHT_BOTTOM: CropAlternateArt = {
  basic: bottomAndRightEdge,
  spring: bottomAndRightEdge,
  desert: desertBottomAndRightEdge,
};

const TOP: CropAlternateArt = {
  basic: topEdge,
  spring: topEdge,
  desert: desertTopEdge,
};

const RIGHT: CropAlternateArt = {
  basic: rightEdge,
  spring: rightEdge,
  desert: desertRightEdge,
};

const BOTTOM: CropAlternateArt = {
  basic: bottomEdge,
  spring: bottomEdge,
  desert: desertBottomEdge,
};

const LEFT: CropAlternateArt = {
  basic: leftEdge,
  spring: leftEdge,
  desert: desertLeftEdge,
};

const TOP_BOTTOM: CropAlternateArt = {
  basic: topAndBottomEdge,
  spring: topAndBottomEdge,
  desert: desertTopAndBottomEdge,
};

const RIGHT_LEFT: CropAlternateArt = {
  basic: rightAndLeftEdge,
  spring: rightAndLeftEdge,
  desert: desertRightAndLeftEdge,
};

const TOP_BOTTOM_LEFT: CropAlternateArt = {
  basic: topLeftAndBottomEdge,
  spring: topLeftAndBottomEdge,
  desert: desertTopLeftAndBottomEdge,
};

const TOP_RIGHT_BOTTOM: CropAlternateArt = {
  basic: topRightAndBottomEdge,
  spring: topRightAndBottomEdge,
  desert: desertTopRightAndBottomEdge,
};

const TOP_RIGHT_LEFT: CropAlternateArt = {
  basic: topRightAndLeftEdge,
  spring: topRightAndLeftEdge,
  desert: desertTopRightAndLeftEdge,
};

const RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  basic: rightBottomAndLeftEdge,
  spring: rightBottomAndLeftEdge,
  desert: desertRightBottomAndLeftEdge,
};

const IMAGE_PATHS: Record<string, CropAlternateArt> = {
  top_right_bottom_left: TOP_RIGHT_BOTTOM_LEFT,
  top_left: TOP_LEFT,
  top_right: TOP_RIGHT,
  bottom_left: BOTTOM_LEFT,
  right_bottom: RIGHT_BOTTOM,
  top: TOP,
  right: RIGHT,
  bottom: BOTTOM,
  left: LEFT,
  top_bottom: TOP_BOTTOM,
  right_left: RIGHT_LEFT,
  top_bottom_left: TOP_BOTTOM_LEFT,
  top_right_bottom: TOP_RIGHT_BOTTOM,
  top_right_left: TOP_RIGHT_LEFT,
  right_bottom_left: RIGHT_BOTTOM_LEFT,
};

type Edges = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

interface Props {
  grid: GameGrid;
  island: IslandType;
}

const Renderer: React.FC<Props> = ({ grid, island }) => {
  const xPositions = getKeys(grid).map(Number);

  const dirt = xPositions.flatMap((x) => {
    const yPositions = getKeys(grid[x]).map(Number);

    return yPositions.map((y) => {
      if (grid[x][y] !== "Dirt Path") {
        return;
      }

      // It is an edge, if there is NOT a piece next to it
      const edges: Edges = {
        top: grid[x][y + 1] !== "Dirt Path",
        right: grid[x + 1]?.[y] !== "Dirt Path",
        bottom: grid[x][y - 1] !== "Dirt Path",
        left: grid[x - 1]?.[y] !== "Dirt Path",
      };

      let image = NO_EDGE[island];
      const edgeNames = getKeys(edges).filter((edge) => !!edges[edge]);
      const name = edgeNames.join("_");
      const path = IMAGE_PATHS[name]?.[island];
      if (path) {
        image = path;
      }

      return (
        <img
          className="absolute"
          src={image}
          key={`${x}_${y}`}
          style={{
            top: `calc(50% - ${GRID_WIDTH_PX * y}px)`,
            left: `calc(50% + ${GRID_WIDTH_PX * x}px)`,
            height: `${GRID_WIDTH_PX}px`,
            width: `${GRID_WIDTH_PX}px`,
          }}
        />
      );
    });
  });

  return <>{dirt}</>;
};

export const DirtRenderer = memo(Renderer);
