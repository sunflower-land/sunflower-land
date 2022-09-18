import React, { useRef } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import seal_sprite from "../assets/seal_sprite.png";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

export const Seal: React.FC = () => {
  const sealGif = useRef<SpriteSheetInstance>();
  const containerRef = useRef<HTMLDivElement>(null);

  const swim = () => {
    console.log("swim");
    const isPlaying = sealGif.current?.getInfo("isPlaying");

    if (!isPlaying) {
      sealGif.current?.goToAndPlay(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer hover:img-highlight z-10"
      onClick={swim}
      style={{
        width: `${PIXEL_SCALE * 32}px`,
        height: `${PIXEL_SCALE * 32}px`,
        left: `${GRID_WIDTH_PX * 29}px`,
        top: `${GRID_WIDTH_PX * 35}px`,
      }}
    >
      <Spritesheet
        className="relative group-hover:img-highlight pointer-events-none z-10"
        style={{
          imageRendering: "pixelated",
          width: `${PIXEL_SCALE * 32}px`,
        }}
        getInstance={(spritesheet) => {
          sealGif.current = spritesheet;
        }}
        image={seal_sprite}
        widthFrame={32}
        heightFrame={32}
        fps={8}
        endAt={20}
        steps={20}
        direction={`forward`}
        autoplay={false}
        loop={true}
        onLoopComplete={(spritesheet) => {
          spritesheet.pause();
        }}
      />
    </div>
  );
};
