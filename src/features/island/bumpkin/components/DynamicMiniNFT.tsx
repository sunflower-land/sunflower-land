import React, { useContext, useEffect, useRef, useState } from "react";

import beigeBody from "assets/npc-layers/beige_body.png";
import lightBrownBody from "assets/npc-layers/light_brown_body.png";
import darkBrownBody from "assets/npc-layers/dark_brown_body.png";
import goblinBody from "assets/npc-layers/goblin_body.png";

import basicHair from "assets/npc-layers/basic_hair.png";
import afro from "assets/npc-layers/afro.png";
import rancher from "assets/npc-layers/rancher_hair.png";
import blacksmithHair from "assets/npc-layers/blacksmith_hair.png";
import longBrownHair from "assets/npc-layers/long_brown_hair.png";
import longWhiteHair from "assets/npc-layers/long_white_hair.png";
import longRedHair from "assets/npc-layers/long_red_hair.webp";
import buzzCut from "assets/npc-layers/buzz_cut_hair.png";
import parlourHair from "assets/npc-layers/parlour_hair.png";
import sunSpots from "assets/npc-layers/sun_spots.png";
import tealMohawk from "assets/npc-layers/teal_mohawk.png";
import blondie from "assets/npc-layers/blondie_hair.png";
import redShirt from "assets/npc-layers/red_farmer_shirt.png";
import blueShirt from "assets/npc-layers/blue_farmer_shirt.png";
import yellowShirt from "assets/npc-layers/yellow_shirt.png";
import sflShirt from "assets/npc-layers/sfl_shirt.png";
import warriorShirt from "assets/npc-layers/warrior_shirt.png";
import developerHoodie from "assets/npc-layers/developer_hoodie.png";
import dignityHoodie from "assets/npc-layers/dignity_hoodie.png";
import artMerch from "assets/npc-layers/art_merch.png";
import fancyTop from "assets/npc-layers/fancy_top.png";
import maidenTop from "assets/npc-layers/maiden_top.png";
import whiteShirt from "assets/npc-layers/white_shirt.png";
import fireShirt from "assets/npc-layers/fire_shirt.png";
import fireHair from "assets/npc-layers/fire_hair.png";
import lusciousHair from "assets/npc-layers/luscious_hair.png";

import farmerPants from "assets/npc-layers/farmer_pants.png";
import blueOveralls from "assets/npc-layers/blue_overalls.png";
import brownOveralls from "assets/npc-layers/brown_overalls.png";
import fancyPants from "assets/npc-layers/fancy_pants.png";
import warriorPants from "assets/npc-layers/warrior_pants.png";
import skirt from "assets/npc-layers/skirt.png";

import snowman from "assets/npc-layers/snowman-onesie.png";
import sharkOnesie from "assets/npc-layers/shark-onesie.png";
import reindeerSuit from "assets/npc-layers/reindeer_suit.png";
import reindeerAntlers from "assets/npc-layers/reindeer_antlers.png";

import shadow from "assets/npcs/shadow.png";

import Spritesheet from "components/animation/SpriteAnimator";

import {
  BumpkinBody,
  BumpkinPant,
  BumpkinShirt,
  BumpkinHair,
  BumpkinSuit,
  BumpkinHat,
  BumpkinOnesie,
} from "features/game/types/bumpkin";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ConsumableName } from "features/game/types/consumables";
import { FeedModal } from "./FeedModal";

type VisiblePart =
  | BumpkinBody
  | BumpkinHair
  | BumpkinShirt
  | BumpkinPant
  | BumpkinSuit
  | BumpkinHat
  | BumpkinOnesie;

const FRAME_WIDTH = 180 / 9;
const FRAME_HEIGHT = 19;
const STEP_MS = 70;
const STEPS = 9;

const PARTS: Partial<Record<VisiblePart, string>> = {
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
  "Red Long Hair": longRedHair,
  "Fire Hair": fireHair,
  "Luscious Hair": lusciousHair,

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
  "Fire Shirt": fireShirt,

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

  // Suits
  "Reindeer Suit": reindeerSuit,

  // Hats
  "Reindeer Antlers": reindeerAntlers,

  // Onesie
  "Snowman Onesie": snowman,
  "Shark Onesie": sharkOnesie,
};

export interface DynamicMiniNFTProps {
  body: BumpkinBody;
  hair: BumpkinHair;
  shirt: BumpkinShirt;
  pants: BumpkinPant;
  hat?: BumpkinHat;
  suit?: BumpkinSuit;
  onesie?: BumpkinOnesie;
}

export const DynamicMiniNFT: React.FC<DynamicMiniNFTProps> = ({
  body,
  hair,
  shirt,
  pants,
  hat,
  suit,
  onesie,
}) => {
  const { gameService } = useContext(Context);

  const [open, setOpen] = useState(false);

  const [frame, setFrame] = useState<number>(0);
  const bodyRef = useRef<Spritesheet>(null);
  const hairRef = useRef<Spritesheet>(null);
  const shirtRef = useRef<Spritesheet>(null);
  const pantsRef = useRef<Spritesheet>(null);
  const suitRef = useRef<Spritesheet>(null);
  const hatRef = useRef<Spritesheet>(null);
  const onesieRef = useRef<Spritesheet>(null);

  const eat = (food: ConsumableName) => {
    gameService.send("bumpkin.feed", { food });
  };

  const bodyPartStyle = {
    width: `${PIXEL_SCALE * 20}px`,
    top: `${PIXEL_SCALE * 5}px`,
    left: `${PIXEL_SCALE * -2}px`,
    imageRendering: "pixelated" as const,
  };

  const [timer, setTimer] = React.useState<number>(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTimer(Date.now()), STEP_MS);
    return () => window.clearInterval(interval);
  }, []);

  // make sure all body parts are synchronized
  useEffect(() => {
    setFrame((frame + 1) % STEPS);
    bodyRef.current?.goToAndPause(frame);
    hairRef.current?.goToAndPause(frame);
    shirtRef.current?.goToAndPause(frame);
    pantsRef.current?.goToAndPause(frame);

    if (suitRef.current) {
      suitRef.current?.goToAndPause(frame);
    }
    if (hatRef.current) {
      hatRef.current?.goToAndPause(frame);
    }
    if (onesieRef.current) {
      onesieRef.current?.goToAndPause(frame);
    }
  }, [timer]);

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        onClick={() => setOpen(true)}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 32}px`,
        }}
      >
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            top: `${PIXEL_SCALE * 20}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute pointer-events-none"
        />
        <Spritesheet
          ref={bodyRef}
          className="absolute w-full inset-0 pointer-events-none"
          style={bodyPartStyle}
          image={PARTS[body] ?? beigeBody}
          widthFrame={FRAME_WIDTH}
          heightFrame={FRAME_HEIGHT}
          steps={STEPS}
          fps={0}
        />

        <Spritesheet
          ref={shirtRef}
          className="absolute w-full inset-0 pointer-events-none"
          style={bodyPartStyle}
          image={PARTS[shirt] ?? whiteShirt}
          widthFrame={FRAME_WIDTH}
          heightFrame={FRAME_HEIGHT}
          steps={STEPS}
          fps={0}
        />
        <Spritesheet
          ref={pantsRef}
          className="absolute w-full inset-0 pointer-events-none"
          style={bodyPartStyle}
          image={PARTS[pants] ?? farmerPants}
          widthFrame={FRAME_WIDTH}
          heightFrame={FRAME_HEIGHT}
          steps={STEPS}
          fps={0}
        />

        {PARTS[suit as BumpkinSuit] && (
          <Spritesheet
            ref={suitRef}
            className="absolute w-full inset-0 pointer-events-none"
            style={bodyPartStyle}
            image={PARTS[suit as BumpkinSuit] as string}
            widthFrame={FRAME_WIDTH}
            heightFrame={FRAME_HEIGHT}
            steps={STEPS}
            fps={0}
          />
        )}

        {PARTS[onesie as BumpkinOnesie] && (
          <Spritesheet
            ref={onesieRef}
            className="absolute w-full inset-0 pointer-events-none"
            style={bodyPartStyle}
            image={PARTS[onesie as BumpkinOnesie] as string}
            widthFrame={FRAME_WIDTH}
            heightFrame={FRAME_HEIGHT}
            steps={STEPS}
            fps={0}
          />
        )}

        {!onesie && (
          <Spritesheet
            ref={hairRef}
            className="absolute w-full inset-0 pointer-events-none"
            style={bodyPartStyle}
            image={PARTS[hair] ?? sunSpots}
            widthFrame={FRAME_WIDTH}
            heightFrame={FRAME_HEIGHT}
            steps={STEPS}
            fps={0}
          />
        )}

        {PARTS[hat as BumpkinHat] && !onesie && (
          <Spritesheet
            ref={hatRef}
            className="absolute w-full inset-0 pointer-events-none"
            style={bodyPartStyle}
            image={PARTS[hat as BumpkinHat] as string}
            widthFrame={FRAME_WIDTH}
            heightFrame={FRAME_HEIGHT}
            steps={STEPS}
            fps={0}
          />
        )}
      </div>
      <FeedModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onFeed={(food) => eat(food)}
      />
    </>
  );
};
