import React from "react";

import Spritesheet from "components/animation/SpriteAnimator";

import sparkSheet from "assets/resources/iron/iron_spark.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Iron: React.FC = () => (
  <div className="relative z-10">
    <div className="w-full h-full">
      <Spritesheet
        className="transform z-10"
        style={{
          width: `${GRID_WIDTH_PX * 5}px`,
          imageRendering: "pixelated",
        }}
        image={sparkSheet}
        widthFrame={91}
        heightFrame={66}
        fps={24}
        steps={5}
        direction={`forward`}
        autoplay={false}
        loop={true}
        onLoopComplete={(spritesheet) => {
          spritesheet.pause();
        }}
      />
    </div>
  </div>
);
