import React, { useContext, useEffect, useRef, useState } from "react";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";

import maturing from "assets/cropMachine/stage4_collector_mature_plants_sheet.webp";
import { calculateFPS } from "../lib/calculateFps";
import { ZoomContext } from "components/ZoomProvider";

interface Props {
  paused: boolean;
}

export const Maturing = ({ paused }: Props) => {
  const { scale } = useContext(ZoomContext);
  const spritesheetRef = useRef<SpriteSheetInstance | null>(null);
  const [fps] = useState<number[]>(
    calculateFPS(
      [
        320, 80, 160, 160, 80, 800, 80, 160, 160, 80, 800, 80, 160, 160, 80,
        480,
      ],
      3.84
    )
  );

  useEffect(() => {
    if (!paused && spritesheetRef.current?.getInfo("isPaused")) {
      spritesheetRef.current?.play();
      return;
    }

    if (paused && spritesheetRef.current?.getInfo("isPlaying")) {
      spritesheetRef.current?.pause();
      return;
    }
  }, [paused]);

  return (
    <Spritesheet
      getInstance={(spritesheet) => {
        spritesheetRef.current = spritesheet;
      }}
      className="absolute w-full h-full"
      style={{
        width: `${PIXEL_SCALE * 80}px`,
        height: `${PIXEL_SCALE * 70}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        imageRendering: "pixelated",
      }}
      image={maturing}
      widthFrame={80}
      heightFrame={70}
      zoomScale={scale}
      fps={fps[0]}
      steps={16}
      direction="forward"
      autoplay={true}
      loop={true}
      onEachFrame={(spritesheet) => {
        const frame = spritesheet.getInfo("frame");

        spritesheet.setFps(fps[frame - 1]);
      }}
    />
  );
};
