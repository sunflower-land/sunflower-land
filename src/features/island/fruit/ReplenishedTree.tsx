import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { FRUIT, FruitName } from "features/game/types/fruits";
import { FRUIT_LIFECYCLE } from "./fruits";

interface Props {
  fruitName: FruitName;
}

export const ReplenishedTree: React.FC<Props> = ({ fruitName }) => {
  const lifecycle = FRUIT_LIFECYCLE[fruitName];

  const { isBush } = FRUIT()[fruitName];

  return (
    <div className="absolute w-full h-full cursor-pointer hover:img-highlight">
      <img
        src={lifecycle.ready}
        className="absolute pointer-events-none"
        style={{
          bottom: `${PIXEL_SCALE * 5}px`,
          left: `${PIXEL_SCALE * (isBush ? 4 : 3)}px`,
          width: `${PIXEL_SCALE * (isBush ? 24 : 26)}px`,
        }}
      />
    </div>
  );
};
