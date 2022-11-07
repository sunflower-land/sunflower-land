import React, { useContext, useState } from "react";

import beigeBody from "../assets/beige_body.png";
import lightBrownBody from "../assets/light_brown_body.png";
import darkBrownBody from "../assets/dark_brown_body.png";
import goblinBody from "../assets/goblin_body.png";

import basicHair from "../assets/basic_hair.png";
import afro from "../assets/afro.png";
import rancher from "../assets/rancher_hair.png";
import blacksmithHair from "../assets/blacksmith_hair.png";
import longBrownHair from "../assets/long_brown_hair.png";
import longWhiteHair from "../assets/long_white_hair.png";
import buzzCut from "../assets/buzz_cut_hair.png";
import parlourHair from "../assets/parlour_hair.png";
import sunSpots from "../assets/sun_spots.png";
import tealMohawk from "../assets/teal_mohawk.png";
import blondie from "../assets/blondie_hair.png";
import redShirt from "../assets/red_farmer_shirt.png";
import blueShirt from "../assets/blue_farmer_shirt.png";
import yellowShirt from "../assets/yellow_shirt.png";
import sflShirt from "../assets/sfl_shirt.png";
import warriorShirt from "../assets/warrior_shirt.png";
import developerHoodie from "../assets/developer_hoodie.png";
import dignityHoodie from "../assets/dignity_hoodie.png";
import artMerch from "../assets/art_merch.png";
import fancyTop from "../assets/fancy_top.png";
import maidenTop from "../assets/maiden_top.png";
import whiteShirt from "../assets/white_shirt.png";

import farmerPants from "../assets/farmer_pants.png";
import blueOveralls from "../assets/blue_overalls.png";
import brownOveralls from "../assets/brown_overalls.png";
import fancyPants from "../assets/fancy_pants.png";
import warriorPants from "../assets/warrior_pants.png";
import skirt from "../assets/skirt.png";

import shadow from "assets/npcs/shadow.png";

import Spritesheet from "components/animation/SpriteAnimator";
import patch from "assets/land/bumpkin_patch.png";
import mailbox from "assets/decorations/mailbox.png";

import {
  BumpkinBody,
  BumpkinPant,
  BumpkinShirt,
  BumpkinHair,
} from "features/game/types/bumpkin";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ConsumableName } from "features/game/types/consumables";
import { FeedModal } from "./FeedModal";

type VisiblePart = BumpkinBody | BumpkinHair | BumpkinShirt | BumpkinPant;

export const BUMPKIN_POSITION = {
  x: 2,
  y: -1,
};
const FRAME_WIDTH = 180 / 9;
const FRAME_HEIGHT = 19;

const PARTS: Record<VisiblePart, string> = {
  // Bodies
  "Beige Farmer Potion": beigeBody,
  "Dark Brown Farmer Potion": darkBrownBody,
  "Light Brown Farmer Potion": lightBrownBody,
  "Goblin Potion": goblinBody,

  // Hair
  "Basic Hair": basicHair,
  "Explorer Hair": afro,
  "Rancher Hair": rancher,
  "Blacksmith Hair": blacksmithHair,
  "Brown Long Hair": longBrownHair,
  "Buzz Cut": buzzCut,
  "Parlour Hair": parlourHair,
  "Sun Spots": sunSpots,
  "Teal Mohawk": tealMohawk,
  "White Long Hair": longWhiteHair,
  Blondie: blondie,

  // Shirts
  "Red Farmer Shirt": redShirt,
  "Yellow Farmer Shirt": yellowShirt,
  "Blue Farmer Shirt": blueShirt,
  "Bumpkin Art Competition Merch": artMerch,
  "Developer Hoodie": developerHoodie,
  "Fancy Top": fancyTop,
  "Maiden Top": maidenTop,
  "Project Dignity Hoodie": dignityHoodie,
  "SFL T-Shirt": sflShirt,
  "Warrior Shirt": warriorShirt,

  // Pants
  "Farmer Overalls": blueOveralls,
  "Lumberjack Overalls": brownOveralls,
  "Farmer Pants": farmerPants,
  "Blue Suspenders": blueOveralls,
  "Brown Suspenders": brownOveralls,
  "Fancy Pants": fancyPants,
  "Maiden Skirt": skirt,
  "Peasant Skirt": skirt,
  "Warrior Pants": warriorPants,
};

interface Props {
  body: BumpkinBody;
  hair: BumpkinHair;
  shirt: BumpkinShirt;
  pants: BumpkinPant;
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
    imageRendering: "pixelated" as const,
  };

  return (
    <>
      <img
        src={patch}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          top: 0,
          left: 0,
        }}
      />
      <img
        src={mailbox}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 8}px`,
          top: `${PIXEL_SCALE * -1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      />
      <div
        className="relative cursor-pointer hover:img-highlight"
        onClick={() => setOpen(true)}
        style={{
          top: `${PIXEL_SCALE * 8}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            top: `${PIXEL_SCALE * 11}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute"
        />
        <Spritesheet
          className="absolute w-full inset-0 z-20"
          style={bodyPartStyle}
          image={PARTS[body] ?? beigeBody}
          widthFrame={FRAME_WIDTH}
          heightFrame={FRAME_HEIGHT}
          steps={9}
          fps={14}
          autoplay={true}
          loop={true}
          direction="forward"
        />
        <Spritesheet
          className="absolute w-full inset-0 z-20"
          style={bodyPartStyle}
          image={PARTS[hair] ?? sunSpots}
          widthFrame={FRAME_WIDTH}
          heightFrame={FRAME_HEIGHT}
          steps={9}
          fps={14}
          autoplay={true}
          loop={true}
          direction="forward"
        />
        <Spritesheet
          className="absolute w-full inset-0 z-20"
          style={bodyPartStyle}
          image={PARTS[shirt] ?? whiteShirt}
          widthFrame={FRAME_WIDTH}
          heightFrame={FRAME_HEIGHT}
          steps={9}
          fps={14}
          autoplay={true}
          loop={true}
          direction="forward"
        />
        <Spritesheet
          className="absolute w-full inset-0 z-20"
          style={bodyPartStyle}
          image={PARTS[pants] ?? farmerPants}
          widthFrame={FRAME_WIDTH}
          heightFrame={FRAME_HEIGHT}
          steps={9}
          fps={14}
          autoplay={true}
          loop={true}
          direction="forward"
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
