import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import React, { memo } from "react";

/**
 * Naming is based on which sides have borders
 * Same as padding/margin order. Top, right, down, left
 * 0_1_1_0 = No top border, right border, bottom border and no bottom border
 */
import fullEdge from "assets/land/home-island/1_1_1_1.webp";
import noEdge from "assets/land/home-island/0_0_0_0.webp";
import topAndBottomEdge from "assets/land/home-island/1_0_1_0.webp";
import topLeftAndBottomEdge from "assets/land/home-island/1_0_1_1.webp";
import topRightAndBottomEdge from "assets/land/home-island/1_1_1_0.webp";
import topRightAndLeftEdge from "assets/land/home-island/1_1_0_1.webp";
import rightBottomAndLeftEdge from "assets/land/home-island/0_1_1_1.webp";
import rightAndLeftEdge from "assets/land/home-island/0_1_0_1.webp";
import rightEdge from "assets/land/home-island/0_1_0_0.webp";
import bottomEdge from "assets/land/home-island/0_0_1_0.webp";
import topEdge from "assets/land/home-island/1_0_0_0.webp";
import leftEdge from "assets/land/home-island/0_0_0_1.webp";
import topAndLeftEdge from "assets/land/home-island/1_0_0_1.webp";
import bottomAndLeftEdge from "assets/land/home-island/0_0_1_1.webp";
import topAndRightEdge from "assets/land/home-island/1_1_0_0.webp";
import bottomAndRightEdge from "assets/land/home-island/0_1_1_0.webp";

import topLeftAndBottomCorner from "assets/land/home-island/next_1_0_1_1.webp";
import topRightAndBottomCorner from "assets/land/home-island/next_1_1_1_0.webp";
import topRightAndLeftCorner from "assets/land/home-island/next_1_1_0_1.webp";
import rightBottomAndLeftCorner from "assets/land/home-island/next_0_1_1_1.webp";
import topAndLeftCorner from "assets/land/home-island/next_1_0_0_1.webp";
import bottomAndLeftCorner from "assets/land/home-island/next_0_0_1_1.webp";
import topAndRightCorner from "assets/land/home-island/next_1_1_0_0.webp";
import bottomAndRightCorner from "assets/land/home-island/next_0_1_1_0.webp";

import dock from "assets/land/home-island/dock.webp";

import { Section } from "lib/utils/hooks/useScrollIntoView";
import { IslandPlotPositions, islandTileType } from "./HomeIslandGenerator";

// images for land plots
const LAND_IMAGE_PATHS: Record<string, string> = {
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

// images for next plots
const NEXT_IMAGE_PATHS: Record<string, string> = {
  top_right_bottom_left: "",
  top_left: topAndLeftCorner,
  top_right: topAndRightCorner,
  bottom_left: bottomAndLeftCorner,
  right_bottom: bottomAndRightCorner,
  top: "",
  right: "",
  bottom: "",
  left: "",
  top_bottom: "",
  right_left: "",
  top_bottom_left: topLeftAndBottomCorner,
  top_right_bottom: topRightAndBottomCorner,
  top_right_left: topRightAndLeftCorner,
  right_bottom_left: rightBottomAndLeftCorner,
};

const DIMENSIONS = {
  plotGridWidth: 6,
  width: 112,
  height: 125,
  xOffset: -44,
  yOffset: 55,
};

type Edges = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

interface Props {
  plotPositions: IslandPlotPositions;
}

const Renderer: React.FC<Props> = ({ plotPositions }) => {
  const xPositions = getKeys(plotPositions).map(Number);
  const homeIsland = xPositions.flatMap((x) => {
    const yPositions = getKeys(plotPositions[x]).map(Number);

    return yPositions.map((y) => {
      const type = plotPositions[x][y];

      // It is an edge, if there is NOT a piece next to it
      const edges: Edges = {
        top: plotPositions[x][y + 1] !== "land",
        right: plotPositions[x + 1]?.[y] !== "land",
        bottom: plotPositions[x][y - 1] !== "land",
        left: plotPositions[x - 1]?.[y] !== "land",
      };

      // get image for each tile
      let image = undefined;
      const edgeNames = getKeys(edges).filter((edge) => !!edges[edge]);
      const name = edgeNames.join("_");
      switch (type) {
        case "land":
          {
            image = noEdge;
            const path = LAND_IMAGE_PATHS[name];
            if (path) {
              image = path;
            }
          }
          break;
        case "next":
          {
            const path = NEXT_IMAGE_PATHS[name];
            if (path) {
              image = path;
            }
          }
          break;
        case "dock":
          image = dock;
          break;
      }

      return (
        <img
          className="absolute"
          id={x === 0 && y === 0 ? Section.GenesisBlock : undefined}
          src={image}
          key={`${type}_${x}_${y}`}
          style={{
            top: `${
              GRID_WIDTH_PX * DIMENSIONS.plotGridWidth * -y -
              PIXEL_SCALE * DIMENSIONS.yOffset
            }px`,
            left: `${
              GRID_WIDTH_PX * DIMENSIONS.plotGridWidth * x +
              PIXEL_SCALE * DIMENSIONS.xOffset
            }px`,
            height: `${PIXEL_SCALE * DIMENSIONS.height}px`,
            width: `${PIXEL_SCALE * DIMENSIONS.width}px`,
          }}
        />
      );
    });
  });

  // render land plots before next plot and dock so next plot and dock will always be rendered above land plots
  const landType: islandTileType = "land";
  homeIsland.sort((a, _) =>
    a.key?.toString().includes(landType.toString()) ? -1 : 1
  );

  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * DIMENSIONS.width}px`,
        height: `${PIXEL_SCALE * DIMENSIONS.height}px`,
      }}
    >
      {homeIsland}
    </div>
  );
};

export const HomeIslandRenderer = memo(Renderer);
