import React, { useContext, useEffect, useRef, useState } from "react";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";

import harvesting from "assets/cropMachine/stage5_collector_cut_plants_sheet.webp";
import { calculateFPS } from "../lib/calculateFps";
import { ZoomContext } from "components/ZoomProvider";

interface Props {
  paused: boolean;
}

export const Harvesting = ({ paused }: Props) => {
  const { scale } = useContext(ZoomContext);
  const spritesheetRef = useRef<SpriteSheetInstance | null>(null);
  const [fps] = useState<number[]>(
    calculateFPS(
      [1004, 80, 80, 80, 1004, 80, 80, 80, 1004, 80, 80, 80, 960],
      4.8,
    ),
  );

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
      image={harvesting}
      widthFrame={80}
      heightFrame={70}
      zoomScale={scale}
      fps={fps[0]}
      steps={13}
      direction="forward"
      autoplay={!paused}
      loop={false}
      onEachFrame={(spritesheet) => {
        const frame = spritesheet.getInfo("frame");

        spritesheet.setFps(fps[frame - 1]);
      }}
    />
  );
};
