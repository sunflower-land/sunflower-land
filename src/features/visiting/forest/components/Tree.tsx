import React from "react";

import Spritesheet from "components/animation/SpriteAnimator";

import shakeSheet from "assets/resources/tree/shake_sheet.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Tree: React.FC = () => {
  return (
    <div className="relative" style={{ height: "106px" }}>
      <div className="group w-full h-full">
        <Spritesheet
          className="pointer-events-none transform"
          style={{
            width: `${GRID_WIDTH_PX * 4}px`,
            // Line it up with the click area
            transform: `translate(-${GRID_WIDTH_PX * 2}px,-${
              GRID_WIDTH_PX * 0.5
            }px)`,
            imageRendering: "pixelated",
          }}
          image={shakeSheet}
          widthFrame={448 / 7}
          heightFrame={48}
          fps={24}
          steps={7}
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
};
