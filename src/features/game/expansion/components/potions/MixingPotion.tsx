import React, { useEffect, useRef, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import potionMasterSheet from "assets/npcs/potion_master_sheet.png";
import { SpringValue } from "react-spring";

export type DesiredAnimation = "static" | "mixing" | "success" | "boom";
type AnimationSettings = {
  autoplay: boolean;
  startAt: number;
  endAt: number;
  loop: boolean;
};

const SETTINGS: Record<DesiredAnimation, AnimationSettings> = {
  static: {
    autoplay: true,
    startAt: 0,
    endAt: 8,
    loop: true,
  },
  mixing: {
    autoplay: true,
    startAt: 9,
    endAt: 44,
    loop: false,
  },
  success: {
    autoplay: true,
    startAt: 82,
    endAt: 113,
    loop: false,
  },
  boom: {
    autoplay: true,
    startAt: 45,
    endAt: 81,
    loop: false,
  },
};

const getFPS = (frameNumber: number): number => {
  if (frameNumber < 9) return Math.round(1000 / 240);
  if (frameNumber < 19) return Math.round(1000 / 90);
  if (frameNumber < 45) return Math.round(1000 / 70);
  if (frameNumber < 55) return Math.round(1000 / 120);
  if (frameNumber < 56) return Math.round(1000 / 1000);
  if (frameNumber < 82) return Math.round(1000 / 90);
  if (frameNumber < 93) return Math.round(1000 / 120);
  if (frameNumber < 94) return Math.round(1000 / 100);
  if (frameNumber < 95) return Math.round(1000 / 120);
  if (frameNumber < 97) return Math.round(1000 / 1000);
  if (frameNumber < 108) return Math.round(1000 / 120);

  return Math.round(1000 / 90);
};

export const MixingPotion: React.FC<{
  desiredAnimation: DesiredAnimation;
}> = ({ desiredAnimation }) => {
  // Hack for spritesheet to display correctly
  const [loaded, setLoaded] = useState(false);

  const [paused, setPaused] = useState(true);

  const [currentAnimation, setCurrentAnimation] =
    React.useState<DesiredAnimation>(desiredAnimation);

  const potionMasterGif = useRef<SpriteSheetInstance>();

  const settings = SETTINGS[currentAnimation];

  const onPlay = () => {
    setPaused(false);
  };

  const onPause = () => {
    setPaused(true);
    setCurrentAnimation(desiredAnimation);
  };

  useEffect(() => {
    setLoaded(true);
    if (paused) setCurrentAnimation(desiredAnimation);
  }, [desiredAnimation]);

  return (
    <div
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 100}px`,
        height: `${PIXEL_SCALE * 100}px`,
        overflow: "hidden",
      }}
    >
      {loaded && (
        <Spritesheet
          key={currentAnimation}
          className="absolute"
          style={{
            imageRendering: "pixelated",
            width: `${PIXEL_SCALE * 100}px`,
            height: `${PIXEL_SCALE * 100}px`,
          }}
          getInstance={(spritesheet) => {
            potionMasterGif.current = spritesheet;
          }}
          image={potionMasterSheet}
          widthFrame={100}
          heightFrame={100}
          zoomScale={new SpringValue(1)}
          startAt={settings.startAt}
          endAt={settings.endAt}
          steps={settings.endAt - settings.startAt}
          fps={11}
          direction={`forward`}
          autoplay={settings.autoplay}
          loop={settings.loop}
          onEachFrame={(spritesheet) => {
            const frame = spritesheet.getInfo("frame");
            spritesheet.setFps(getFPS(frame));
          }}
          onPlay={onPlay}
          onPause={onPause}
        />
      )}
    </div>
  );
};
