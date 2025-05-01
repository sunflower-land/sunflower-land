import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";

export const LoveChicken: React.FC<CollectibleProps> = () => {
  return (
    <img
      src={ITEM_DETAILS["Love Chicken"].image}
      style={{
        width: `${PIXEL_SCALE * 21}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute"
      alt="Love Chicken"
    />
  );
};
