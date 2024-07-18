import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { FRUIT, FruitName } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";

import { Context } from "features/game/GameProvider";

interface Props {
  fruitName: FruitName;
}

export const ReplenishedTree: React.FC<Props> = ({ fruitName }) => {
  const lifecycle = FRUIT_LIFECYCLE[fruitName];

  const { isBush } = FRUIT()[fruitName];
  let bottom, left, width;
  switch (fruitName) {
    case "Banana":
      bottom = 8;
      left = 1.2;
      width = 31;
      break;
    case "Lemon":
      bottom = 11;
      left = 10.5;
      width = 10;
      break;
    case "Tomato":
      bottom = 8;
      left = 8.5;
      width = 14;
      break;
    default:
      bottom = 5;
      left = isBush ? 4 : 3;
      width = isBush ? 24 : 26;
  }

  const { gameService } = useContext(Context);

  return (
    <div className="absolute w-full h-full cursor-pointer hover:img-highlight">
      <img
        src={lifecycle.ready}
        className={"absolute pointer-events-none"}
        style={{
          bottom: `${PIXEL_SCALE * bottom}px`,
          left: `${PIXEL_SCALE * left}px`,
          width: `${PIXEL_SCALE * width}px`,
        }}
      />
    </div>
  );
};
