import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { PlaceableFlowerName } from "features/game/types/flowers";

interface Props {
  name: PlaceableFlowerName;
}

export const PlaceableFlower: React.FC<Props> = ({ name }) => {
  return (
    <img
      src={ITEM_DETAILS[name].image}
      style={{
        width: `${PIXEL_SCALE * 10}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      className="absolute"
      alt={name}
    />
  );
};
