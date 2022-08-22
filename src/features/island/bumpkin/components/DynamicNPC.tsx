import React from "react";
import Spritesheet from "components/animation/SpriteAnimator";

import { PIXEL_SCALE } from "features/game/lib/constants";

import lightSheet from "assets/bumpkins/small/body/light_farmer_sheet.png";
import darkSheet from "assets/bumpkins/small/body/dark_farmer_sheet.png";
import basicSheet from "assets/bumpkins/small/hair/basic_sheet.png";
import explorerSheet from "assets/bumpkins/small/hair/explorer_sheet.png";
import farmerShirtSheet from "assets/bumpkins/small/shirts/farmer_shirt_sheet.png";
import lumberjackShirtSheet from "assets/bumpkins/small/shirts/lumberjack_shirt_sheet.png";
import farmerPantsSheet from "assets/bumpkins/small/pants/farmer_pants_sheet.png";

type LimitedBumpkinItem =
  | "Light Farmer Potion"
  | "Dark Farmer Potion"
  | "Basic Hair"
  | "Explorer Hair"
  | "Farmer Shirt"
  | "Lumberjack Shirt"
  | "Farmer Pants";

const PARTS: Record<LimitedBumpkinItem, string> = {
  "Light Farmer Potion": lightSheet,
  "Dark Farmer Potion": darkSheet,
  "Basic Hair": basicSheet,
  "Explorer Hair": explorerSheet,
  "Farmer Shirt": farmerShirtSheet,
  "Lumberjack Shirt": lumberjackShirtSheet,
  "Farmer Pants": farmerPantsSheet,
};

interface Props {
  body: LimitedBumpkinItem;
  hair: LimitedBumpkinItem;
  shirt: LimitedBumpkinItem;
  pants: LimitedBumpkinItem;
}

const FRAME_WIDTH = 180 / 9;

export const DynamicNPC: React.FC<Props> = ({ body, hair, shirt, pants }) => (
  <div className="relative">
    <Spritesheet
      className="z-0 w-full"
      style={{
        width: `${FRAME_WIDTH * PIXEL_SCALE}px`,
      }}
      image={PARTS[body]}
      widthFrame={FRAME_WIDTH}
      heightFrame={19}
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
      heightFrame={19}
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
      heightFrame={19}
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
      heightFrame={19}
      steps={9}
      fps={14}
      autoplay={true}
      loop={true}
      direction="forward"
    />
  </div>
);
