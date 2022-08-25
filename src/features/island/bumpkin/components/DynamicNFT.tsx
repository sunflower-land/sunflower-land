import React from "react";
import classNames from "classnames";
import { getKeys } from "features/game/types/craftables";
import { BumpkinItems, BumpkinParts } from "features/game/types/game";

import rosyWide from "assets/bumpkins/large/eyes/rosy_wide.png";
import rosySquint from "assets/bumpkins/large/eyes/rosy_squint.png";
import lightFarmerPotion from "assets/bumpkins/large/body/light_farmer.png";
import darkFarmerPotion from "assets/bumpkins/large/body/dark_farmer.png";
import farmerShirt from "assets/bumpkins/large/shirts/farmer_shirt.png";
import lumberjackShirt from "assets/bumpkins/large/shirts/lumberjack_shirt.png";
import basicHair from "assets/bumpkins/large/hair/basic.png";
import explorerHair from "assets/bumpkins/large/hair/explorer.png";
import rancherHair from "assets/bumpkins/large/hair/rancher.png";
import farmerPants from "assets/bumpkins/large/pants/farmer_pants.png";
import blackShoes from "assets/bumpkins/large/shoes/black_shoes.png";
import smile from "assets/bumpkins/large/mouths/smile.png";
import dropShadow from "assets/bumpkins/large/body_dropshadow.png";

interface Props {
  bumpkinParts: BumpkinParts;
}

const ITEM_IMAGES: Record<BumpkinItems, string> = {
  "Beige Farmer Potion": lightFarmerPotion,
  "Brown Farmer Potion": darkFarmerPotion, // TODO
  "Dark Farmer Potion": darkFarmerPotion,
  "Goblin Potion": darkFarmerPotion, // TODO: add item
  "Basic Hair": basicHair,
  "Explorer Hair": explorerHair,
  "Rancher Hair": rancherHair,
  "Farmer Shirt": farmerShirt,
  "Lumberjack Shirt": lumberjackShirt,
  "Farmer Overalls": farmerPants, // TODO: add item
  "Lumberjack Overalls": farmerPants, // TODO: add item
  "Farmer Pants": farmerPants,
  "Rosy Wide Eyes": rosyWide,
  "Rosy Squinted Eyes": rosySquint,
  "Black Shoes": blackShoes,
  Smile: smile,
  "Smile With Teeth": smile, // TODO: add item
};

export const DynamicNFT: React.FC<Props> = ({ bumpkinParts }) => {
  return (
    <div className="relative w-full">
      <img
        src={dropShadow}
        alt="drop-shadow"
        className="absolute bottom-0 z-0 opacity-30"
      />
      {getKeys(bumpkinParts).map((part, index) => (
        <img
          key={part}
          src={ITEM_IMAGES[bumpkinParts[part]]}
          className={classNames(`inset-0 z-${index * 10} w-full`, {
            absolute: part !== "body",
          })}
        />
      ))}
    </div>
  );
};
