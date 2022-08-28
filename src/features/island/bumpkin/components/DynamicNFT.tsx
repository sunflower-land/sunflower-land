import React from "react";
import classNames from "classnames";
import { getKeys } from "features/game/types/craftables";
import { BumpkinItems, BumpkinParts } from "features/game/types/game";

import questionMark from "assets/icons/expression_confused.png";

import rosyWide from "assets/bumpkins/large/eyes/rosy_wide.png";
import rosySquint from "assets/bumpkins/large/eyes/rosy_squint.png";
import rosyButterfly from "assets/bumpkins/large/eyes/rosy_butterfly.png";
import beigeFarmerPotion from "assets/bumpkins/large/body/beige_farmer.png";
import lightBrownFarmerPotion from "assets/bumpkins/large/body/light_brown_farmer.png";
import darkBrownFarmerPotion from "assets/bumpkins/large/body/dark_brown_farmer.png";
import redFarmerShirt from "assets/bumpkins/large/shirts/red_farmer_shirt.png";
import yellowFarmerShirt from "assets/bumpkins/large/shirts/yellow_farmer_shirt.png";
import blueFarmerShirt from "assets/bumpkins/large/shirts/blue_farmer_shirt.png";
import basicHair from "assets/bumpkins/large/hair/basic.png";
import explorerHair from "assets/bumpkins/large/hair/explorer.png";
import rancherHair from "assets/bumpkins/large/hair/rancher.png";
import farmerPants from "assets/bumpkins/large/pants/farmer_pants.png";
import blackFarmerBoots from "assets/bumpkins/large/shoes/black_farmer_boots.png";
import smile from "assets/bumpkins/large/mouths/smile.png";
import farmerPitchfork from "assets/bumpkins/large/tools/farmer_pitchfork.png";
import dropShadow from "assets/bumpkins/large/body_dropshadow.png";

interface Props {
  bumpkinParts: BumpkinParts;
}

const ITEM_IMAGES: Record<BumpkinItems, string> = {
  "Beige Farmer Potion": beigeFarmerPotion,
  "Light Brown Farmer Potion": lightBrownFarmerPotion, // TODO
  "Dark Brown Farmer Potion": darkBrownFarmerPotion,
  "Goblin Potion": darkBrownFarmerPotion, // TODO: add item
  "Basic Hair": basicHair,
  "Explorer Hair": explorerHair,
  "Rancher Hair": rancherHair,
  "Red Farmer Shirt": redFarmerShirt,
  "Yellow Farmer Shirt": yellowFarmerShirt,
  "Blue Farmer Shirt": blueFarmerShirt,
  "Chef Apron": questionMark,
  "Farmer Overalls": farmerPants, // TODO: add item
  "Lumberjack Overalls": farmerPants, // TODO: add item
  "Farmer Pants": farmerPants,
  "Rosy Wide Eyes": rosyWide,
  "Rosy Squinted Eyes": rosySquint,
  "Rosy Butterfly Eyes": rosyButterfly,
  "Black Farmer Boots": blackFarmerBoots,
  "Wide Smile": smile,
  "Wide Smile With Teeth": smile, // TODO: add item
  "Sunflower Amulet": smile, // TODO: add item
  "Warrior Shield": smile, // TODO: add item
  "Farmer Pitchfork": farmerPitchfork,
  "Farmer Hat": smile, // TODO: add item
  "Chef Hat": questionMark,
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
