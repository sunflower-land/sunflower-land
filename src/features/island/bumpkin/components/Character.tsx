import {
  BumpkinBody,
  BumpkinItems,
  BumpkinPants,
  BumpkinShirt,
  BumpkinHair,
  ConsumableName,
} from "features/game/types";
import React, { useContext, useState } from "react";

// Bodies
import lightFarmer from "assets/bumpkins/small/body/beige_farmer.gif";
import lightBrownFarmer from "assets/bumpkins/small/body/light_brown_farmer.gif";
import darkBrownFarmer from "assets/bumpkins/small/body/dark_brown_farmer.gif";
import goblin from "assets/bumpkins/small/body/goblin.gif";

// Hair
import basic from "assets/bumpkins/small/hair/basic.gif";
import explorer from "assets/bumpkins/small/hair/explorer.gif";

// Shirts
import redFarmerShirt from "assets/bumpkins/small/shirts/red_farmer_shirt.gif";
import yellowFarmerShirt from "assets/bumpkins/small/shirts/yellow_farmer_shirt.gif";
import blueFarmerShirt from "assets/bumpkins/small/shirts/blue_farmer_shirt.gif";

// Miscellaneous
import shadow from "assets/npcs/shadow.png";

// Pants
import farmerOveralls from "assets/bumpkins/small/pants/farmer_overalls.gif";
import lumberjackOveralls from "assets/bumpkins/small/pants/lumberjack_overalls.gif";
import farmerPants from "assets/bumpkins/small/pants/lumberjack_overalls.gif"; // TODO
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { CONSUMABLES } from "features/game/data";
import { InventoryItemName } from "features/game/types/game";
import { FeedModal } from "./FeedModal";

const HITS = 2;

const PARTS: Partial<Record<BumpkinItems, string>> = {
  // Bodies
  "Beige Farmer Potion": lightFarmer,
  "Dark Brown Farmer Potion": darkBrownFarmer,
  "Light Brown Farmer Potion": lightBrownFarmer,
  "Goblin Potion": goblin,

  // Hair
  "Basic Hair": basic,
  "Explorer Hair": explorer,

  // Shirts
  "Red Farmer Shirt": redFarmerShirt,
  "Yellow Farmer Shirt": yellowFarmerShirt,
  "Blue Farmer Shirt": blueFarmerShirt,

  // Pants
  "Farmer Overalls": farmerOveralls,
  "Lumberjack Overalls": lumberjackOveralls,
  "Farmer Pants": farmerPants,
};

const isConsumeable = (item: InventoryItemName): item is ConsumableName =>
  item in CONSUMABLES;

interface Props {
  body: BumpkinBody;
  hair?: BumpkinHair;
  shirt?: BumpkinShirt;
  pants?: BumpkinPants;
}

export const Character: React.FC<Props> = ({ body, hair, shirt, pants }) => {
  const { gameService } = useContext(Context);

  const [open, setOpen] = useState(false);

  const eat = (food: ConsumableName) => {
    gameService.send("bumpkin.feed", { food });
  };

  return (
    <>
      <div
        className="w-full cursor-pointer hover:img-highlight"
        onClick={() => setOpen(true)}
      >
        <img
          src={PARTS[body]}
          className="z-0"
          style={{ width: `${20 * PIXEL_SCALE}px` }}
        />
        {hair && (
          <img src={PARTS[hair]} className="absolute w-full inset-0 z-10" />
        )}
        {shirt && (
          <img src={PARTS[shirt]} className="absolute w-full inset-0 z-20" />
        )}
        {pants && (
          <img src={PARTS[pants]} className="absolute w-full inset-0 z-30" />
        )}
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
          }}
          className="absolute w-full -bottom-1.5 -z-10 left-1.5"
        />
      </div>
      <FeedModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onFeed={(food) => eat(food)}
      />
    </>
  );
};
