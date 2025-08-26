import React from "react";
import { CollectibleProps } from "../Collectible";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const Pet: React.FC<CollectibleProps> = ({ name }) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${PIXEL_SCALE * -1}px`,
        top: `${PIXEL_SCALE * -5}px`,
        width: `${PIXEL_SCALE * 20}px`,
      }}
    >
      <img
        src={ITEM_DETAILS[name].image}
        className="absolute w-full cursor-pointer hover:img-highlight"
        alt={name}
      />
    </div>
  );
};
