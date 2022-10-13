import React from "react";
import classNames from "classnames";
import { getKeys } from "features/game/types/craftables";

import dropShadow from "assets/bumpkins/shop/body_dropshadow.png";

import {
  BumpkinItems,
  BumpkinPart,
  BumpkinParts,
} from "features/game/types/bumpkin";
import { BUMPKIN_ITEMS } from "features/bumpkins/types/BumpkinDetails";

interface Props {
  bumpkinParts: BumpkinParts;
  showBackground?: boolean;
}

export const DynamicNFT: React.FC<Props> = ({ bumpkinParts }) => {
  if (!bumpkinParts) {
    return null;
  }

  const { body, eyes, hair, mouth, pants, shirt, shoes, hat, necklace, tool } =
    bumpkinParts;

  // Need to render layers in specific order
  const orderedParts = {
    body,
    eyes,
    hair,
    mouth,
    pants,
    shirt,
    shoes,
    hat,
    necklace,
    tool,
  };

  return (
    <div className="relative w-full">
      <img
        src={dropShadow}
        alt="drop-shadow"
        className="absolute bottom-0 z-0 opacity-30"
      />
      {getKeys(orderedParts)
        .filter((part) => !!bumpkinParts[part])
        .map((part: BumpkinPart, index) => (
          <img
            key={part}
            src={BUMPKIN_ITEMS[bumpkinParts[part] as BumpkinItems].layerImage}
            className={classNames(`inset-0 z-${index * 10} w-full absolute`, {
              // The body sets the dimensions
              relative: part === "body",
            })}
          />
        ))}
    </div>
  );
};
