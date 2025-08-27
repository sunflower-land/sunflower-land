import React from "react";
import { CollectibleProps } from "../Collectible";

import { ITEM_DETAILS } from "features/game/types/images";
import { PetName } from "features/game/types/pets";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getObjectEntries } from "features/game/expansion/lib/utils";

const PETS_STYLES: Record<
  PetName,
  {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number;
    height?: number;
  }
> = {
  Barkley: {
    width: 20,
    bottom: 22,
    left: -2,
  },
  Meowchi: {
    width: 20,
    bottom: 23,
    left: -1.5,
  },
  Twizzle: {
    width: 17,
    bottom: 19,
  },
  Burro: {
    width: 20,
    bottom: 23,
    left: -2,
  },
  Mudhorn: {
    width: 23,
    bottom: 26,
    left: -4.25,
  },
  Nibbles: {
    width: 16,
    bottom: 20,
  },
  Waddles: {
    width: 17,
    bottom: 20,
  },
  Ramsey: {
    width: 32,
    bottom: 36,
  },
};

const PET_PIXEL_STYLES = getObjectEntries(PETS_STYLES).reduce<
  Record<
    PetName,
    {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
      width?: number;
      height?: number;
    }
  >
>(
  (acc, [pet, styles]) => {
    acc[pet] = {
      left: styles.left ? PIXEL_SCALE * styles.left : undefined,
      right: styles.right ? PIXEL_SCALE * styles.right : undefined,
      top: styles.top ? PIXEL_SCALE * styles.top : undefined,
      bottom: styles.bottom ? PIXEL_SCALE * styles.bottom : undefined,
      width: styles.width ? PIXEL_SCALE * styles.width : undefined,
      height: styles.height ? PIXEL_SCALE * styles.height : undefined,
    };
    return acc;
  },
  { ...PETS_STYLES },
);

export const Pet: React.FC<CollectibleProps> = ({ name }) => {
  return (
    <div className="absolute" style={{ ...PET_PIXEL_STYLES[name as PetName] }}>
      <img
        src={ITEM_DETAILS[name].image}
        className="absolute w-full cursor-pointer hover:img-highlight"
        alt={name}
      />
    </div>
  );
};
