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

export const DynamicNFT: React.FC<Props> = ({
  bumpkinParts,
  showBackground,
}) => {
  if (!bumpkinParts) {
    return null;
  }

  const { background, body, hair, pants, shirt, shoes, hat, necklace, tool } =
    bumpkinParts;

  // Need to render layers in specific order
  const orderedParts: Partial<BumpkinParts> = {
    background,
    body,
    hair,
    pants,
    shirt,
    shoes,
    hat,
    necklace,
    tool,
  };

  if (!showBackground) {
    delete orderedParts.background;
  }

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
            style={{
              zIndex: index * 10,
            }}
            className={classNames(`inset-0 w-full absolute`, {
              // The body sets the dimensions
              relative: part === "body",
            })}
          />
        ))}
    </div>
  );
};
