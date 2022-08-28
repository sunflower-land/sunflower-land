import React from "react";
import Spritesheet from "components/animation/SpriteAnimator";

import { PIXEL_SCALE } from "features/game/lib/constants";

import beigeBodySheet from "assets/bumpkins/small/body/beige_farmer_sheet.png";
import lightBrownBodySheet from "assets/bumpkins/small/body/light_brown_farmer_sheet.png";
import darkBrownBodySheet from "assets/bumpkins/small/body/dark_brown_farmer_sheet.png";
import basicSheet from "assets/bumpkins/small/hair/basic_sheet.png";
import explorerSheet from "assets/bumpkins/small/hair/explorer_sheet.png";
import rancherSheet from "assets/bumpkins/small/hair/rancher_sheet.png";
import redShirtSheet from "assets/bumpkins/small/shirts/red_farmer_shirt_sheet.png";
import yellowShirtSheet from "assets/bumpkins/small/shirts/yellow_farmer_shirt_sheet.png";
import blueShirtSheet from "assets/bumpkins/small/shirts/blue_farmer_shirt_sheet.png";
import farmerPantsSheet from "assets/bumpkins/small/pants/farmer_pants_sheet.png";
import shadow from "assets/npcs/shadow.png";
import {
  LimitedBody,
  LimitedHair,
  LimitedShirt,
  LimitedPants,
} from "../BumpkinBuilder";

type LimitedBumpkinItem =
  | LimitedBody
  | LimitedHair
  | LimitedShirt
  | LimitedPants;

const PARTS: Record<LimitedBumpkinItem, string> = {
  "Beige Farmer Potion": beigeBodySheet,
  "Light Brown Farmer Potion": lightBrownBodySheet,
  "Dark Brown Farmer Potion": darkBrownBodySheet,
  "Basic Hair": basicSheet,
  "Explorer Hair": explorerSheet,
  "Rancher Hair": rancherSheet,
  "Red Farmer Shirt": redShirtSheet,
  "Yellow Farmer Shirt": yellowShirtSheet,
  "Blue Farmer Shirt": blueShirtSheet,
  "Farmer Pants": farmerPantsSheet,
};

interface Props {
  body: LimitedBody;
  hair: LimitedHair;
  shirt: LimitedShirt;
  pants: LimitedPants;
}

const FRAME_WIDTH = 180 / 9;
const FRAME_HEIGHT = 19;

export const DynamicNPC: React.FC<Props> = ({ body, hair, shirt, pants }) => (
  <div className="relative">
    <Spritesheet
      className="z-0 w-full"
      style={{
        width: `${FRAME_WIDTH * PIXEL_SCALE}px`,
      }}
      image={PARTS[body]}
      widthFrame={FRAME_WIDTH}
      heightFrame={FRAME_HEIGHT}
      steps={9}
      fps={14}
      autoplay={true}
      loop={true}
      direction="forward"
    />
    <Spritesheet
      className="absolute w-full inset-0 z-10"
      image={PARTS[hair]}
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
      image={PARTS[shirt]}
      widthFrame={FRAME_WIDTH}
      heightFrame={FRAME_HEIGHT}
      steps={9}
      fps={14}
      autoplay={true}
      loop={true}
      direction="forward"
    />
    <Spritesheet
      className="absolute w-full inset-0 z-30"
      image={PARTS[pants]}
      widthFrame={FRAME_WIDTH}
      heightFrame={FRAME_HEIGHT}
      steps={9}
      fps={14}
      autoplay={true}
      loop={true}
      direction="forward"
    />
    <img
      src={shadow}
      style={{
        width: `${PIXEL_SCALE * 15}px`,
      }}
      className="absolute w-full -bottom-1.5 left-1.5 z-29"
    />
  </div>
);
