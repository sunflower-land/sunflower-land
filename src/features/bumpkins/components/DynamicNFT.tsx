import React from "react";
import classNames from "classnames";
import { getKeys } from "features/game/types/craftables";

import farmBackground from "src/assets/bumpkins/shop/background/farm_background.png";
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
  console.log({ bumpkinParts });
  return (
    <div className="relative w-full">
      <img
        src={dropShadow}
        alt="drop-shadow"
        className="absolute bottom-0 z-0 opacity-30"
      />
      {showBackground && (
        <img src={farmBackground} alt="background" className="z-0 w-full" />
      )}
      {getKeys(bumpkinParts).map((part: BumpkinPart, index) => (
        <img
          key={part}
          src={BUMPKIN_ITEMS[bumpkinParts[part] as BumpkinItems].layerImage}
          className={classNames(`inset-0 z-${index * 10} w-full absolute`, {})}
        />
      ))}
    </div>
  );
};
