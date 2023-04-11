import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import React, { useContext } from "react";

/**
 * Naming is based on which sides have borders
 * Same as padding/margin order. Top, right, down, left
 * 0_1_1_0 = No top border, right border, bottom border and no bottom border
 */
import fullEdge from "assets/decorations/fence/1_1_1_1.png";
import noEdge from "assets/decorations/fence/0_0_0_0.png";
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

import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getGameGrid } from "features/game/expansion/placeable/lib/makeGrid";
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
}
export const Fence: React.FC<Props> = ({ coordinates }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const grid = getGameGrid(state);

  console.log({ coordinates });
  const edges: Edges = {
    top: grid[coordinates.x]?.[coordinates.y + 1] === "Fence",
    right: grid[coordinates.x + 1]?.[coordinates.y] === "Fence",
    bottom: grid[coordinates.x]?.[coordinates.y - 1] === "Fence",
    left: grid[coordinates.x - 1]?.[coordinates.y] === "Fence",
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
      key={`${coordinates.x}_${coordinates.y}`}
      style={{
        height: `${GRID_WIDTH_PX}px`,
        width: `${GRID_WIDTH_PX}px`,
      }}
    />
  );
};
