import {
  BumpkinBody,
  BumpkinItem,
  BumpkinPant,
  BumpkinShirt,
  BumpkinHair,
} from "features/game/types/bumpkin";
import React, { useContext, useState } from "react";

// Bodies
import lightFarmer from "assets/bumpkins/small/body/beige_farmer.gif";
import lightBrownFarmer from "assets/bumpkins/small/body/light_brown_farmer.gif";
import darkBrownFarmer from "assets/bumpkins/small/body/dark_brown_farmer.gif";
import goblin from "assets/bumpkins/small/body/goblin.gif";

// Hair
import basic from "assets/bumpkins/small/hair/basic.gif";
import explorer from "assets/bumpkins/small/hair/explorer.gif";
import rancher from "assets/bumpkins/small/hair/rancher.gif";

// Shirts
import redFarmerShirt from "assets/bumpkins/small/shirts/red_farmer_shirt.gif";
import yellowFarmerShirt from "assets/bumpkins/small/shirts/yellow_farmer_shirt.gif";
import blueFarmerShirt from "assets/bumpkins/small/shirts/blue_farmer_shirt.gif";

// Pants
import farmerOveralls from "assets/bumpkins/small/pants/farmer_overalls.gif";
import lumberjackOveralls from "assets/bumpkins/small/pants/lumberjack_overalls.gif";
import farmerPants from "assets/bumpkins/small/pants/farmer_pants.gif";

// Miscellaneous
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ConsumableName } from "features/game/types/consumables";
import { FeedModal } from "./FeedModal";

const PARTS: Partial<Record<BumpkinItem, string>> = {
  // Bodies
  "Beige Farmer Potion": lightFarmer,
  "Dark Brown Farmer Potion": darkBrownFarmer,
  "Light Brown Farmer Potion": lightBrownFarmer,
  "Goblin Potion": goblin,

  // Hair
  "Basic Hair": basic,
  "Explorer Hair": explorer,
  "Rancher Hair": rancher,

  // Shirts
  "Red Farmer Shirt": redFarmerShirt,
  "Yellow Farmer Shirt": yellowFarmerShirt,
  "Blue Farmer Shirt": blueFarmerShirt,

  // Pants
  "Farmer Overalls": farmerOveralls,
  "Lumberjack Overalls": lumberjackOveralls,
  "Farmer Pants": farmerPants,
};

interface Props {
  body: BumpkinBody;
  hair?: BumpkinHair;
  shirt?: BumpkinShirt;
  pants?: BumpkinPant;
}

export const Character: React.FC<Props> = ({ body, hair, shirt, pants }) => {
  const { gameService } = useContext(Context);

  const [open, setOpen] = useState(false);

  const eat = (food: ConsumableName) => {
    gameService.send("bumpkin.feed", { food });
  };

  const bodyPartStyle = {
    transformOrigin: "left top",
    scale: "calc(20/16)",
    width: `${PIXEL_SCALE * 16}px`,
    top: `${PIXEL_SCALE * -4}px`,
    left: `${PIXEL_SCALE * -2}px`,
  };

  return (
    <>
      <div
        className="w-full h-full relative cursor-pointer hover:img-highlight"
        onClick={() => setOpen(true)}
      >
        <div className="relative pointer-events-none">
          <img
            src={shadow}
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              top: `${PIXEL_SCALE * 11}px`,
              left: `${PIXEL_SCALE * 1}px`,
            }}
            className="absolute"
          />
          <img src={PARTS[body]} style={bodyPartStyle} className="absolute" />
          {hair && (
            <img src={PARTS[hair]} style={bodyPartStyle} className="absolute" />
          )}
          {shirt && (
            <img
              src={PARTS[shirt]}
              style={bodyPartStyle}
              className="absolute"
            />
          )}
          {pants && (
            <img
              src={PARTS[pants]}
              style={bodyPartStyle}
              className="absolute"
            />
          )}
        </div>
      </div>
      <FeedModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onFeed={(food) => eat(food)}
      />
    </>
  );
};
