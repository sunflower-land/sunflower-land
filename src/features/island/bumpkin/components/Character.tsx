import {
  BumpkinBodies,
  BumpkinItems,
  BumpkinPants,
  BumpkinShirts,
  BumpkinWigs,
} from "features/game/types/game";
import React from "react";

// Bodies
import farmer from "assets/bumpkins/bodies/farmer_1.gif";
import farmerTwo from "assets/bumpkins/bodies/farmer_2.gif";
import goblin from "assets/bumpkins/bodies/goblin.gif";

// Wig
import basic from "assets/bumpkins/hair/basic.gif";
import rancher from "assets/bumpkins/hair/rancher.gif";
import explorer from "assets/bumpkins/hair/explorer.gif";

// Shirts
import farmerShirt from "assets/bumpkins/shirts/farmer_shirt.gif";

// Pants
import farmerOveralls from "assets/bumpkins/pants/farmer_overalls.gif";
import lumberjackOveralls from "assets/bumpkins/pants/lumberjack_overalls.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

const PARTS: Record<BumpkinItems, string> = {
  // Bodies
  "Farmer Potion": farmer,
  "Farmer Potion 2": farmerTwo,
  "Goblin Potion": goblin,

  // Wigs
  "Basic Wig": basic,
  "Explorer Wig": explorer,
  "Rancher Wig": rancher,

  // Shirts
  "Farmer Shirt": farmerShirt,
  "Lumberjack Shirt": farmerShirt, //TODO

  // Pants
  "Farmer Overalls": farmerOveralls,
  "Lumberjack Overalls": lumberjackOveralls,
  "Farmer Pants": farmerOveralls, // TODO
};

interface Props {
  body: BumpkinBodies;
  wig?: BumpkinWigs;
  shirt?: BumpkinShirts;
  pants?: BumpkinPants;

  onClick: () => void;
}

export const Character: React.FC<Props> = ({
  body,
  wig,
  shirt,
  pants,
  onClick,
}) => {
  return (
    <div
      className="w-full cursor-pointer hover:img-highlight"
      onClick={onClick}
    >
      <img
        src={PARTS[body]}
        className="z-0"
        style={{ width: `${20 * PIXEL_SCALE}px` }}
      />
      {wig && <img src={PARTS[wig]} className="absolute w-full inset-0 z-10" />}
      {shirt && (
        <img src={PARTS[shirt]} className="absolute w-full inset-0 z-20" />
      )}
      {pants && (
        <img src={PARTS[pants]} className="absolute w-full inset-0 z-30" />
      )}
    </div>
  );
};
