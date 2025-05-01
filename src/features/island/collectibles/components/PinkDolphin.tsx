import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";

export const PinkDolphin: React.FC<CollectibleProps> = () => {
  return (
    <img
      src={ITEM_DETAILS["Pink Dolphin"].image}
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        bottom: `${PIXEL_SCALE * 1.5}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute"
      alt="Pink Dolphin"
    />
  );
};
