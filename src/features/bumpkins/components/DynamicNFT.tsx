import React from "react";
import classNames from "classnames";
import { getKeys } from "features/game/types/craftables";

import dropShadow from "assets/bumpkins/shop/body_dropshadow.webp";

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
  showDropShadow?: boolean;
  showTools?: boolean;
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
  showDropShadow = true,
  showTools = true,
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

  const backgroundPart: Partial<BumpkinParts> = {
    background,
  };

  // Need to render layers in specific order
  // Not including background because background is rendered before the shadow
  const orderedParts: Partial<BumpkinParts> = {
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

  if (!showTools) {
    delete orderedParts.tool;
    delete orderedParts.secondaryTool;
  }

  const getBumpkinPartImage = (part: BumpkinPart) => {
    return (
      <img
        key={part}
        // TODO
        src={getImageUrl(ITEM_IDS[bumpkinParts[part] as BumpkinItem])}
        className={classNames(`inset-0 w-full absolute`, {
          // The body sets the dimensions
          relative: part === "body",
        })}
      />
    );
  };

  return (
    <div className={classNames("relative w-full", className ?? "")}>
      {showBackground &&
        getKeys(backgroundPart).map((part: BumpkinPart) =>
          getBumpkinPartImage(part)
        )}

      {showDropShadow && (
        <img
          src={dropShadow}
          alt="drop-shadow"
          className="absolute w-full bottom-0 opacity-30"
        />
      )}

      {getKeys(orderedParts)
        .filter((part) => !!bumpkinParts[part])
        .map((part: BumpkinPart) => getBumpkinPartImage(part))}
    </div>
  );
};
