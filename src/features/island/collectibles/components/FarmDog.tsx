import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const FarmDog: React.FC = () => {
  return (
    <img
      src={ITEM_DETAILS["Farm Dog"].image}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px `,
      }}
      alt="Farm Dog"
    />
  );
};
