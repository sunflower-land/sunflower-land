import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getKeys } from "lib/object";
import React, { memo } from "react";
import { SUNNYSIDE } from "assets/sunnyside";

/**
 * Naming is based on which sides have borders
 * Same as padding/margin order. Top, right, down, left
 * 0_1_1_0 = No top border, right border, bottom border and no bottom border
 */

import type { GameGrid } from "../placeable/lib/makeGrid";
import type { LandBiomeName } from "features/island/biomes/biomes";

type CropAlternateArt = Record<LandBiomeName, string>;

const NO_EDGE: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.noEdge,
  "Spring Biome": SUNNYSIDE.land.noEdge,
  "Desert Biome": SUNNYSIDE.land.desertNoEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoNoEdge,
  "Swamp Biome": SUNNYSIDE.land.noEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.noEdge,
  "Crystal Biome": SUNNYSIDE.land.noEdge,
  "Galaxy Biome": SUNNYSIDE.land.noEdge,
  "Marble Age Biome": SUNNYSIDE.land.noEdge,
};

const TOP_RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.fullEdge,
  "Spring Biome": SUNNYSIDE.land.fullEdge,
  "Desert Biome": SUNNYSIDE.land.desertFullEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoFullEdge,
  "Swamp Biome": SUNNYSIDE.land.fullEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.fullEdge,
  "Crystal Biome": SUNNYSIDE.land.fullEdge,
  "Galaxy Biome": SUNNYSIDE.land.fullEdge,
  "Marble Age Biome": SUNNYSIDE.land.fullEdge,
};

const TOP_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.topAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.land.topAndLeftEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.topAndLeftEdge,
  "Crystal Biome": SUNNYSIDE.land.topAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.land.topAndLeftEdge,
  "Marble Age Biome": SUNNYSIDE.land.topAndLeftEdge,
};

const TOP_RIGHT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topAndRightEdge,
  "Spring Biome": SUNNYSIDE.land.topAndRightEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopAndRightEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopAndRightEdge,
  "Swamp Biome": SUNNYSIDE.land.topAndRightEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.topAndRightEdge,
  "Crystal Biome": SUNNYSIDE.land.topAndRightEdge,
  "Galaxy Biome": SUNNYSIDE.land.topAndRightEdge,
  "Marble Age Biome": SUNNYSIDE.land.topAndRightEdge,
};

const BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertBottomAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoBottomAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  "Crystal Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  "Marble Age Biome": SUNNYSIDE.land.bottomAndLeftEdge,
};

const RIGHT_BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.bottomAndRightEdge,
  "Spring Biome": SUNNYSIDE.land.bottomAndRightEdge,
  "Desert Biome": SUNNYSIDE.land.desertBottomAndRightEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoBottomAndRightEdge,
  "Swamp Biome": SUNNYSIDE.land.bottomAndRightEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.bottomAndRightEdge,
  "Crystal Biome": SUNNYSIDE.land.bottomAndRightEdge,
  "Galaxy Biome": SUNNYSIDE.land.bottomAndRightEdge,
  "Marble Age Biome": SUNNYSIDE.land.bottomAndRightEdge,
};

const TOP: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topEdge,
  "Spring Biome": SUNNYSIDE.land.topEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopEdge,
  "Swamp Biome": SUNNYSIDE.land.topEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.topEdge,
  "Crystal Biome": SUNNYSIDE.land.topEdge,
  "Galaxy Biome": SUNNYSIDE.land.topEdge,
  "Marble Age Biome": SUNNYSIDE.land.topEdge,
};

const RIGHT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.rightEdge,
  "Spring Biome": SUNNYSIDE.land.rightEdge,
  "Desert Biome": SUNNYSIDE.land.desertRightEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoRightEdge,
  "Swamp Biome": SUNNYSIDE.land.rightEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.rightEdge,
  "Crystal Biome": SUNNYSIDE.land.rightEdge,
  "Galaxy Biome": SUNNYSIDE.land.rightEdge,
  "Marble Age Biome": SUNNYSIDE.land.rightEdge,
};

const BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.bottomEdge,
  "Spring Biome": SUNNYSIDE.land.bottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoBottomEdge,
  "Swamp Biome": SUNNYSIDE.land.bottomEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.bottomEdge,
  "Crystal Biome": SUNNYSIDE.land.bottomEdge,
  "Galaxy Biome": SUNNYSIDE.land.bottomEdge,
  "Marble Age Biome": SUNNYSIDE.land.bottomEdge,
};

const LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.leftEdge,
  "Spring Biome": SUNNYSIDE.land.leftEdge,
  "Desert Biome": SUNNYSIDE.land.desertLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoLeftEdge,
  "Swamp Biome": SUNNYSIDE.land.leftEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.leftEdge,
  "Crystal Biome": SUNNYSIDE.land.leftEdge,
  "Galaxy Biome": SUNNYSIDE.land.leftEdge,
  "Marble Age Biome": SUNNYSIDE.land.leftEdge,
};

const TOP_BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topAndBottomEdge,
  "Spring Biome": SUNNYSIDE.land.topAndBottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopAndBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopAndBottomEdge,
  "Swamp Biome": SUNNYSIDE.land.topAndBottomEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.topAndBottomEdge,
  "Crystal Biome": SUNNYSIDE.land.topAndBottomEdge,
  "Galaxy Biome": SUNNYSIDE.land.topAndBottomEdge,
  "Marble Age Biome": SUNNYSIDE.land.topAndBottomEdge,
};

const RIGHT_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.rightAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.rightAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertRightAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoRightAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.land.rightAndLeftEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.rightAndLeftEdge,
  "Crystal Biome": SUNNYSIDE.land.rightAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.land.rightAndLeftEdge,
  "Marble Age Biome": SUNNYSIDE.land.rightAndLeftEdge,
};

const TOP_BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  "Spring Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopLeftAndBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopLeftAndBottomEdge,
  "Swamp Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  "Crystal Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  "Galaxy Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  "Marble Age Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
};

const TOP_RIGHT_BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  "Spring Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopRightAndBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopRightAndBottomEdge,
  "Swamp Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  "Crystal Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  "Galaxy Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  "Marble Age Biome": SUNNYSIDE.land.topRightAndBottomEdge,
};

const TOP_RIGHT_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopRightAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopRightAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  "Crystal Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  "Marble Age Biome": SUNNYSIDE.land.topRightAndLeftEdge,
};

const RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertRightBottomAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoRightBottomAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  // Ascension biomes (spooky onward) reuse the swamp art for now.
  "Spooky Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  "Crystal Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  "Marble Age Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
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

/**
 * The dirt sprite for a `"Dirt Path"` tile (a crop plot or a Dirt Path
 * decoration) given the surrounding grid — an edge is drawn on any side whose
 * neighbour isn't also dirt, so runs of plots/paths join into one shape.
 */
export function getDirtImage(
  grid: GameGrid,
  x: number,
  y: number,
  biome: LandBiomeName,
): string {
  // It is an edge, if there is NOT a piece next to it
  const edges: Edges = {
    top: grid[x]?.[y + 1] !== "Dirt Path",
    right: grid[x + 1]?.[y] !== "Dirt Path",
    bottom: grid[x]?.[y - 1] !== "Dirt Path",
    left: grid[x - 1]?.[y] !== "Dirt Path",
  };

  const edgeNames = getKeys(edges).filter((edge) => !!edges[edge]);
  return IMAGE_PATHS[edgeNames.join("_")]?.[biome] ?? NO_EDGE[biome];
}

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

      const image = getDirtImage(grid, x, y, biome);

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
