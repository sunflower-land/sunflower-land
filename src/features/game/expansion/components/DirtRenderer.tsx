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
import { LandBiomeName } from "features/island/biomes/biomes";

type CropAlternateArt = Record<LandBiomeName, string>;

const NO_EDGE: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.noEdge,
  "Spring Biome": SUNNYSIDE.land.noEdge,
  "Desert Biome": SUNNYSIDE.land.desertNoEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoNoEdge,
};

const TOP_RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.fullEdge,
  "Spring Biome": SUNNYSIDE.land.fullEdge,
  "Desert Biome": SUNNYSIDE.land.desertFullEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoFullEdge,
};

const TOP_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.topAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopAndLeftEdge,
};

const TOP_RIGHT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topAndRightEdge,
  "Spring Biome": SUNNYSIDE.land.topAndRightEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopAndRightEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopAndRightEdge,
};

const BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertBottomAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoBottomAndLeftEdge,
};

const RIGHT_BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.bottomAndRightEdge,
  "Spring Biome": SUNNYSIDE.land.bottomAndRightEdge,
  "Desert Biome": SUNNYSIDE.land.desertBottomAndRightEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoBottomAndRightEdge,
};

const TOP: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topEdge,
  "Spring Biome": SUNNYSIDE.land.topEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopEdge,
};

const RIGHT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.rightEdge,
  "Spring Biome": SUNNYSIDE.land.rightEdge,
  "Desert Biome": SUNNYSIDE.land.desertRightEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoRightEdge,
};

const BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.bottomEdge,
  "Spring Biome": SUNNYSIDE.land.bottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoBottomEdge,
};

const LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.leftEdge,
  "Spring Biome": SUNNYSIDE.land.leftEdge,
  "Desert Biome": SUNNYSIDE.land.desertLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoLeftEdge,
};

const TOP_BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topAndBottomEdge,
  "Spring Biome": SUNNYSIDE.land.topAndBottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopAndBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopAndBottomEdge,
};

const RIGHT_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.rightAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.rightAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertRightAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoRightAndLeftEdge,
};

const TOP_BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  "Spring Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopLeftAndBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopLeftAndBottomEdge,
};

const TOP_RIGHT_BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  "Spring Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopRightAndBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopRightAndBottomEdge,
};

const TOP_RIGHT_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopRightAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopRightAndLeftEdge,
};

const RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertRightBottomAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoRightBottomAndLeftEdge,
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
  biome: LandBiomeName;
}

const Renderer: React.FC<Props> = ({ grid, biome }) => {
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

      let image = NO_EDGE[biome];
      const edgeNames = getKeys(edges).filter((edge) => !!edges[edge]);
      const name = edgeNames.join("_");
      const path = IMAGE_PATHS[name]?.[biome];
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
