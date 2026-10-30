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
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.noEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.noEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.noEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.noEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.noEdge,
};

const TOP_RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.fullEdge,
  "Spring Biome": SUNNYSIDE.land.fullEdge,
  "Desert Biome": SUNNYSIDE.land.desertFullEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoFullEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.fullEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.fullEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.fullEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.fullEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.fullEdge,
};

const TOP_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.topAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.topAndLeftEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.topAndLeftEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.topAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.topAndLeftEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.topAndLeftEdge,
};

const TOP_RIGHT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topAndRightEdge,
  "Spring Biome": SUNNYSIDE.land.topAndRightEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopAndRightEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopAndRightEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.topAndRightEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.topAndRightEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.topAndRightEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.topAndRightEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.topAndRightEdge,
};

const BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.bottomAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertBottomAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoBottomAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.bottomAndLeftEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.bottomAndLeftEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.bottomAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.bottomAndLeftEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.bottomAndLeftEdge,
};

const RIGHT_BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.bottomAndRightEdge,
  "Spring Biome": SUNNYSIDE.land.bottomAndRightEdge,
  "Desert Biome": SUNNYSIDE.land.desertBottomAndRightEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoBottomAndRightEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.bottomAndRightEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.bottomAndRightEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.bottomAndRightEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.bottomAndRightEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.bottomAndRightEdge,
};

const TOP: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topEdge,
  "Spring Biome": SUNNYSIDE.land.topEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.topEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.topEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.topEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.topEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.topEdge,
};

const RIGHT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.rightEdge,
  "Spring Biome": SUNNYSIDE.land.rightEdge,
  "Desert Biome": SUNNYSIDE.land.desertRightEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoRightEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.rightEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.rightEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.rightEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.rightEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.rightEdge,
};

const BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.bottomEdge,
  "Spring Biome": SUNNYSIDE.land.bottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoBottomEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.bottomEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.bottomEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.bottomEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.bottomEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.bottomEdge,
};

const LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.leftEdge,
  "Spring Biome": SUNNYSIDE.land.leftEdge,
  "Desert Biome": SUNNYSIDE.land.desertLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoLeftEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.leftEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.leftEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.leftEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.leftEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.leftEdge,
};

const TOP_BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topAndBottomEdge,
  "Spring Biome": SUNNYSIDE.land.topAndBottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopAndBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopAndBottomEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.topAndBottomEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.topAndBottomEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.topAndBottomEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.topAndBottomEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.topAndBottomEdge,
};

const RIGHT_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.rightAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.rightAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertRightAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoRightAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.rightAndLeftEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.rightAndLeftEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.rightAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.rightAndLeftEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.rightAndLeftEdge,
};

const TOP_BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  "Spring Biome": SUNNYSIDE.land.topLeftAndBottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopLeftAndBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopLeftAndBottomEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.topLeftAndBottomEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.topLeftAndBottomEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.topLeftAndBottomEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.topLeftAndBottomEdge,
  "Marble Age Biome":
    SUNNYSIDE.ascensionGround.marble.land.topLeftAndBottomEdge,
};

const TOP_RIGHT_BOTTOM: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  "Spring Biome": SUNNYSIDE.land.topRightAndBottomEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopRightAndBottomEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopRightAndBottomEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.topRightAndBottomEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.topRightAndBottomEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.topRightAndBottomEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.topRightAndBottomEdge,
  "Marble Age Biome":
    SUNNYSIDE.ascensionGround.marble.land.topRightAndBottomEdge,
};

const TOP_RIGHT_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.topRightAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertTopRightAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoTopRightAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.topRightAndLeftEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.topRightAndLeftEdge,
  "Crystal Biome": SUNNYSIDE.ascensionGround.crystal.land.topRightAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.topRightAndLeftEdge,
  "Marble Age Biome": SUNNYSIDE.ascensionGround.marble.land.topRightAndLeftEdge,
};

const RIGHT_BOTTOM_LEFT: CropAlternateArt = {
  "Basic Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  "Spring Biome": SUNNYSIDE.land.rightBottomAndLeftEdge,
  "Desert Biome": SUNNYSIDE.land.desertRightBottomAndLeftEdge,
  "Volcano Biome": SUNNYSIDE.land.volcanoRightBottomAndLeftEdge,
  "Swamp Biome": SUNNYSIDE.ascensionGround.swamp.land.rightBottomAndLeftEdge,
  "Spooky Biome": SUNNYSIDE.ascensionGround.spooky.land.rightBottomAndLeftEdge,
  "Crystal Biome":
    SUNNYSIDE.ascensionGround.crystal.land.rightBottomAndLeftEdge,
  "Galaxy Biome": SUNNYSIDE.ascensionGround.galaxy.land.rightBottomAndLeftEdge,
  "Marble Age Biome":
    SUNNYSIDE.ascensionGround.marble.land.rightBottomAndLeftEdge,
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
