import React from "react";

// Path numbers are based on edges. Top, Right, Bottom, left
// 1_0_1_0 means a path with edges on top and bottom
import path1111 from "assets/decorations/dirtPath/1_1_1_1.png";
import path0110 from "assets/decorations/dirtPath/0_1_1_0.png";
import path1010 from "assets/decorations/dirtPath/1_0_1_0.png";
import path1011 from "assets/decorations/dirtPath/1_0_1_1.png";
import path1110 from "assets/decorations/dirtPath/1_1_1_0.png";
import path1101 from "assets/decorations/dirtPath/1_1_0_1.png";

import { GameState } from "features/game/types/game";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

interface Props {
  decorations: GameState["decorations"];
  coords: Coordinates;
}

// { x : { y: true } }
// { 2: { 1: true, 2: true } }
type CoordinatesObject = Record<number, Record<number, boolean>>;

export const DirtPath: React.FC<Props> = ({ decorations, coords }) => {
  // TODO move this higher
  const decorationObj =
    decorations["Dirt Path"]?.reduce(
      (acc, path) => ({
        ...acc,
        [path.coordinates.x]: {
          ...(acc[path.coordinates.x] || {}),
          [path.coordinates.y]: true,
        },
      }),
      {} as CoordinatesObject
    ) ?? {};

  let image = path1111;

  if (
    decorationObj[coords.x]?.[coords.y + 1] &&
    decorationObj[coords.x - 1]?.[coords.y]
  ) {
    image = path0110;
  } else if (decorationObj[coords.x]?.[coords.y - 1]) {
    image = path1101;
  } else if (
    decorationObj[coords.x - 1]?.[coords.y] &&
    decorationObj[coords.x + 1]?.[coords.y]
  ) {
    image = path1010;
  } else if (decorationObj[coords.x - 1]?.[coords.y]) {
    image = path1110;
  } else if (decorationObj[coords.x + 1]?.[coords.y]) {
    image = path1011;
  }
  return <img className="w-full" src={image} alt="Dirt path" />;
};
