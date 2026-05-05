import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { PlaceableFlowerName } from "features/game/types/flowers";

interface Props {
  name: PlaceableFlowerName;
}

function getFlowerPixelWidth(name: PlaceableFlowerName): number {
  if (name.includes("Carnation")) return 7;
  if (name.includes("Pansy")) return 9;
  if (name.includes("Cosmos")) return 10;
  if (name.includes("Lavender") || name.includes("Clover")) return 11;
  if (name.includes("Balloon Flower") || name.includes("Daffodil")) return 13;
  if (name.includes("Lotus") || name.includes("Edelweiss")) return 18;
  if (name.includes("Gladiolus")) return 19;
  return 10;
}

export const PlaceableFlower: React.FC<Props> = ({ name }) => {
  const pixelWidth = getFlowerPixelWidth(name);
  // Center within the 16-unit grid square
  const leftOffset = (16 - pixelWidth) / 2;

  return (
    <img
      src={ITEM_DETAILS[name].image}
      style={{
        width: `${PIXEL_SCALE * pixelWidth}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * leftOffset}px`,
      }}
      className="absolute"
      alt={name}
    />
  );
};
