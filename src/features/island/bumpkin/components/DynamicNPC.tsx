import React from "react";
import Spritesheet from "components/animation/SpriteAnimator";

import { PIXEL_SCALE } from "features/game/lib/constants";

import lightSheet from "assets/bumpkins/small/body/light_farmer_sheet.png";
import darkSheet from "assets/bumpkins/small/body/dark_farmer_sheet.png";
import basicSheet from "assets/bumpkins/small/hair/basic_sheet.png";
import explorerSheet from "assets/bumpkins/small/hair/explorer_sheet.png";
import rancherSheet from "assets/bumpkins/small/hair/rancher_sheet.png";
import farmerShirtSheet from "assets/bumpkins/small/shirts/farmer_shirt_sheet.png";
import lumberjackShirtSheet from "assets/bumpkins/small/shirts/lumberjack_shirt_sheet.png";
import farmerPantsSheet from "assets/bumpkins/small/pants/farmer_pants_sheet.png";
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
  "Beige Farmer Potion": lightSheet,
  "Brown Farmer Potion": darkSheet, // TODO
  "Dark Farmer Potion": darkSheet,
  "Basic Hair": basicSheet,
  "Explorer Hair": explorerSheet,
  "Rancher Hair": rancherSheet,
  "Farmer Shirt": farmerShirtSheet,
  "Lumberjack Shirt": lumberjackShirtSheet,
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
  </div>
);
