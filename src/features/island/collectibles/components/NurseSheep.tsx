import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { ITEM_DETAILS } from "features/game/types/images";

export const NurseSheep: React.FC<CollectibleProps> = () => {
  return (
    <img
      src={ITEM_DETAILS["Nurse Sheep"].image}
      style={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      className="absolute"
      alt="Nurse Sheep"
    />
  );
};
