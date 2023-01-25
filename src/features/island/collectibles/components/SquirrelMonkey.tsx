import React from "react";

import sheet from "assets/sfts/squirrel_monkey_sheet.png";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Spritesheet from "components/animation/SpriteAnimator";

export const SquirrelMonkey: React.FC = () => {
  return (
    <>
      <Spritesheet
        className="absolute z-20"
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${0}px`,
          imageRendering: "pixelated",
        }}
        image={sheet}
        widthFrame={26}
        heightFrame={32}
        fps={12}
        steps={9}
        direction={`forward`}
        autoplay={true}
        loop={true}
      />
      <img
        src={shadow}
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          bottom: `${PIXEL_SCALE * 5}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Basic Bear"
      />
    </>
  );
};
