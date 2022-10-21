import React, { useRef } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../../lib/constants";
import { burningSound } from "lib/utils/sfx";

import wickerManFire from "assets/nfts/wicker_man_fire.png";

export const WickerMan: React.FC = () => {
  const wickerManGif = useRef<SpriteSheetInstance>();
  const containerRef = useRef<HTMLDivElement>(null);

  const burn = () => {
    const isPlaying = wickerManGif.current?.getInfo("isPlaying");

    if (!isPlaying) {
      burningSound.play();
      wickerManGif.current?.goToAndPlay(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute cursor-pointer hover:img-highlight z-10"
      onClick={burn}
      style={{
        width: `${PIXEL_SCALE * 19}px`,
        height: `${PIXEL_SCALE * 25}px`,
        left: `${GRID_WIDTH_PX * 82}px`,
        top: `${GRID_WIDTH_PX * 21}px`,
      }}
      id={Section["Wicker Man"]}
    >
      <Spritesheet
        className="absolute group-hover:img-highlight pointer-events-none z-10"
        style={{
          imageRendering: "pixelated",
          left: `-73%`,
          bottom: `1px`,
          width: `${PIXEL_SCALE * 44}px`,
        }}
        getInstance={(spritesheet) => {
          wickerManGif.current = spritesheet;
        }}
        image={wickerManFire}
        widthFrame={48}
        heightFrame={58}
        fps={12}
        endAt={32}
        steps={32}
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
