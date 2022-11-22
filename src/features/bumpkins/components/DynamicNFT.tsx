import React from "react";
import classNames from "classnames";
import { getKeys } from "features/game/types/craftables";

import dropShadow from "assets/bumpkins/shop/body_dropshadow.png";

import {
  BumpkinItem,
  BumpkinPart,
  Equipped as BumpkinParts,
  ITEM_IDS,
} from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";

interface Props {
  bumpkinParts: Partial<BumpkinParts>;
  showBackground?: boolean;
  showTool?: boolean;
  className?: string;
}

function getImageUrl(layerId: number) {
  if (CONFIG.NETWORK === "mainnet") {
    return `https://images.bumpkins.io/layers/${layerId}.png`;
  }

  return `https://testnet-images.bumpkins.io/layers/${layerId}.png`;
}

export const DynamicNFT: React.FC<Props> = ({
  bumpkinParts,
  showBackground,
  showTool = true,
  className,
}) => {
  if (!bumpkinParts) {
    return null;
  }

  const {
    background,
    body,
    hair,
    pants,
    shirt,
    shoes,
    hat,
    necklace,
    tool,
    coat,
    secondaryTool,
  } = bumpkinParts;

  // Need to render layers in specific order
  const orderedParts: Partial<BumpkinParts> = {
    background,
    body,
    hair,
    shirt,
    pants,
    coat,
    shoes,
    hat,
    necklace,
    tool,
    secondaryTool,
  };

  if (!showBackground) {
    delete orderedParts.background;
  }

  if (!showTool) {
    delete orderedParts.tool;
  }

  return (
    <div className={classNames("relative w-full", className ?? "")}>
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
            // TODO
            src={getImageUrl(ITEM_IDS[bumpkinParts[part] as BumpkinItem])}
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
