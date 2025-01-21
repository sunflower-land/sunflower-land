import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { PATCH_FRUIT, PatchFruitName } from "features/game/types/fruits";
import { PATCH_FRUIT_LIFECYCLE } from "./fruits";

import { Context } from "features/game/GameProvider";

interface Props {
  patchFruitName: PatchFruitName;
}

export const ReplenishedTree: React.FC<Props> = ({ patchFruitName }) => {
  const lifecycle = PATCH_FRUIT_LIFECYCLE[patchFruitName];

  const { isBush } = PATCH_FRUIT[patchFruitName];
  let bottom, left, width;
  switch (patchFruitName) {
    case "Banana":
      bottom = 8;
      left = 1.2;
      width = 31;
      break;
    case "Lemon":
      bottom = 8;
      left = 7;
      width = 18;
      break;
    case "Tomato":
      bottom = 8;
      left = 7;
      width = 18;
      break;
    case "Celestine":
    case "Lunara":
    case "Duskberry":
      bottom = 8;
      left = 9;
      width = 15;
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
