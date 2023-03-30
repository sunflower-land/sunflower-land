import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import React, { memo } from "react";

/**
 * Naming is based on which sides have borders
 * Same as padding/margin order. Top, right, down, left
 * 0_1_1_0 = No top border, right border, bottom border and no bottom border
 */
import fullEdge from "assets/land/dirt/1_1_1_1.png";
import noEdge from "assets/land/dirt/0_0_0_0.png";
import topAndBottomEdge from "assets/land/dirt/1_0_1_0.png";
import topLeftAndBottomEdge from "assets/land/dirt/1_0_1_1.png";
import topRightAndBottomEdge from "assets/land/dirt/1_1_1_0.png";
import topRightAndLeftEdge from "assets/land/dirt/1_1_0_1.png";
import rightBottomAndLeftEdge from "assets/land/dirt/0_1_1_1.png";
import rightAndLeftEdge from "assets/land/dirt/0_1_0_1.png";

import rightEdge from "assets/land/dirt/0_1_0_0.png";
import bottomEdge from "assets/land/dirt/0_0_1_0.png";
import topEdge from "assets/land/dirt/1_0_0_0.png";
import leftEdge from "assets/land/dirt/0_0_0_1.png";

import topAndLeftEdge from "assets/land/dirt/1_0_0_1.png";
import bottomAndLeftEdge from "assets/land/dirt/0_0_1_1.png";
import topAndRightEdge from "assets/land/dirt/1_1_0_0.png";
import bottomAndRightEdge from "assets/land/dirt/0_1_1_0.png";
import { GameState } from "features/game/types/game";

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

/**
 * X + Y Coordinates
 * { 1: { 2: true} , 2: { 2: true, 3: true }}
 */
export type Positions = Record<number, Record<number, boolean>>;

interface Props {
  plots: GameState["crops"];
}

const Renderer: React.FC<Props> = ({ plots }) => {
  const dirtPositions: Positions = {};
  getKeys(plots || {}).forEach((plotId) => {
    const plot = plots[plotId];

    // TODO - offset with expansion
    if (!dirtPositions[plot.x]) {
      dirtPositions[plot.x] = {};
    }

    dirtPositions[plot.x][plot.y] = true;
  });
  const xPositions = getKeys(dirtPositions).map(Number);

  const dirt = xPositions.flatMap((x) => {
    const yPositions = getKeys(dirtPositions[x]).map(Number);

    return yPositions.map((y) => {
      // It is an edge, if there is NOT a piece next to it
      const edges: Edges = {
        top: !dirtPositions[x][y + 1],
        right: !dirtPositions[x + 1]?.[y],
        bottom: !dirtPositions[x][y - 1],
        left: !dirtPositions[x - 1]?.[y],
      };

      let image = noEdge;
      const edgeNames = getKeys(edges).filter((edge) => !!edges[edge]);
      const name = edgeNames.join("_");
      const path = IMAGE_PATHS[name];
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
