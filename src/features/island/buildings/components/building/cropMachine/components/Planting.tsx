import React, { useContext, useEffect, useRef, useState } from "react";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import { calculateFPS } from "../lib/calculateFps";
import { ZoomContext } from "components/ZoomProvider";

interface Props {
  paused: boolean;
}

export const Planting = ({ paused }: Props) => {
  const { scale } = useContext(ZoomContext);
  const spritesheetRef = useRef<SpriteSheetInstance>();
  const [fps] = useState<number[]>(calculateFPS(new Array(16).fill(80), 1.28));

  useEffect(() => {
    if (paused) {
      spritesheetRef.current?.pause();
    } else {
      spritesheetRef.current?.play();
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
      image={SUNNYSIDE.building.plantingCropMachine}
      widthFrame={80}
      heightFrame={70}
      zoomScale={scale}
      fps={fps[0]}
      steps={16}
      direction="forward"
      autoplay={!paused}
      loop={true}
    />
  );
};
