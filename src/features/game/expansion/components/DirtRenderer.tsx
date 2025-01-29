import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import React, { memo } from "react";
import { SUNNYSIDE } from "assets/sunnyside";

/**
 * Naming is based on which sides have borders
 * Same as padding/margin order. Top, right, down, left
 * 0_1_1_0 = No top border, right border, bottom border and no bottom border
 */

import { GameGrid } from "../placeable/lib/makeGrid";
import { IslandType } from "features/game/types/game";

type CropAlternateArt = Record<IslandType, string>;

const NO_EDGE: CropAlternateArt = {
  basic: SUNNYSIDE.land.noEdge,
  spring: SUNNYSIDE.land.noEdge,
  desert: SUNNYSIDE.land.desertNoEdge,
  volcano: SUNNYSIDE.land.universalNoEdge,
};

const TOP_RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  basic: SUNNYSIDE.land.fullEdge,
  spring: SUNNYSIDE.land.fullEdge,
  desert: SUNNYSIDE.land.desertFullEdge,
  volcano: SUNNYSIDE.land.universalFullEdge,
};

const TOP_LEFT: CropAlternateArt = {
  basic: SUNNYSIDE.land.topAndLeftEdge,
  spring: SUNNYSIDE.land.topAndLeftEdge,
  desert: SUNNYSIDE.land.desertTopAndLeftEdge,
  volcano: SUNNYSIDE.land.universalTopAndLeftEdge,
};

const TOP_RIGHT: CropAlternateArt = {
  basic: SUNNYSIDE.land.topAndRightEdge,
  spring: SUNNYSIDE.land.topAndRightEdge,
  desert: SUNNYSIDE.land.desertTopAndRightEdge,
  volcano: SUNNYSIDE.land.universalTopAndRightEdge,
};

const BOTTOM_LEFT: CropAlternateArt = {
  basic: SUNNYSIDE.land.bottomAndLeftEdge,
  spring: SUNNYSIDE.land.bottomAndLeftEdge,
  desert: SUNNYSIDE.land.desertBottomAndLeftEdge,
  volcano: SUNNYSIDE.land.universalBottomAndLeftEdge,
};

const RIGHT_BOTTOM: CropAlternateArt = {
  basic: SUNNYSIDE.land.bottomAndRightEdge,
  spring: SUNNYSIDE.land.bottomAndRightEdge,
  desert: SUNNYSIDE.land.desertBottomAndRightEdge,
  volcano: SUNNYSIDE.land.universalBottomAndRightEdge,
};

const TOP: CropAlternateArt = {
  basic: SUNNYSIDE.land.topEdge,
  spring: SUNNYSIDE.land.topEdge,
  desert: SUNNYSIDE.land.desertTopEdge,
  volcano: SUNNYSIDE.land.universalTopEdge,
};

const RIGHT: CropAlternateArt = {
  basic: SUNNYSIDE.land.rightEdge,
  spring: SUNNYSIDE.land.rightEdge,
  desert: SUNNYSIDE.land.desertRightEdge,
  volcano: SUNNYSIDE.land.universalRightEdge,
};

const BOTTOM: CropAlternateArt = {
  basic: SUNNYSIDE.land.bottomEdge,
  spring: SUNNYSIDE.land.bottomEdge,
  desert: SUNNYSIDE.land.desertBottomEdge,
  volcano: SUNNYSIDE.land.universalBottomEdge,
};

const LEFT: CropAlternateArt = {
  basic: SUNNYSIDE.land.leftEdge,
  spring: SUNNYSIDE.land.leftEdge,
  desert: SUNNYSIDE.land.desertLeftEdge,
  volcano: SUNNYSIDE.land.universalLeftEdge,
};

const TOP_BOTTOM: CropAlternateArt = {
  basic: SUNNYSIDE.land.topAndBottomEdge,
  spring: SUNNYSIDE.land.topAndBottomEdge,
  desert: SUNNYSIDE.land.desertTopAndBottomEdge,
  volcano: SUNNYSIDE.land.universalTopAndBottomEdge,
};

const RIGHT_LEFT: CropAlternateArt = {
  basic: SUNNYSIDE.land.rightAndLeftEdge,
  spring: SUNNYSIDE.land.rightAndLeftEdge,
  desert: SUNNYSIDE.land.desertRightAndLeftEdge,
  volcano: SUNNYSIDE.land.universalRightAndLeftEdge,
};

const TOP_BOTTOM_LEFT: CropAlternateArt = {
  basic: SUNNYSIDE.land.topLeftAndBottomEdge,
  spring: SUNNYSIDE.land.topLeftAndBottomEdge,
  desert: SUNNYSIDE.land.desertTopLeftAndBottomEdge,
  volcano: SUNNYSIDE.land.universalTopLeftAndBottomEdge,
};

const TOP_RIGHT_BOTTOM: CropAlternateArt = {
  basic: SUNNYSIDE.land.topRightAndBottomEdge,
  spring: SUNNYSIDE.land.topRightAndBottomEdge,
  desert: SUNNYSIDE.land.desertTopRightAndBottomEdge,
  volcano: SUNNYSIDE.land.universalTopRightAndBottomEdge,
};

const TOP_RIGHT_LEFT: CropAlternateArt = {
  basic: SUNNYSIDE.land.topRightAndLeftEdge,
  spring: SUNNYSIDE.land.topRightAndLeftEdge,
  desert: SUNNYSIDE.land.desertTopRightAndLeftEdge,
  volcano: SUNNYSIDE.land.universalTopRightAndLeftEdge,
};

const RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  basic: SUNNYSIDE.land.rightBottomAndLeftEdge,
  spring: SUNNYSIDE.land.rightBottomAndLeftEdge,
  desert: SUNNYSIDE.land.desertRightBottomAndLeftEdge,
  volcano: SUNNYSIDE.land.universalRightBottomAndLeftEdge,
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
