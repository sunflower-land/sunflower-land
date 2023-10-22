import React, { useContext, useRef, useState } from "react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";

import { ZoomContext } from "components/ZoomProvider";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";

type SpriteFrames = { startAt: number; endAt: number };

const FISHING_FRAMES: Record<FishingState, SpriteFrames> = {
  idle: {
    startAt: 1,
    endAt: 9,
  },
  casting: {
    startAt: 10,
    endAt: 24,
  },
  waiting: {
    startAt: 25,
    endAt: 33,
  },
  reeling: {
    startAt: 34,
    endAt: 46,
  },
  ready: {
    startAt: 34,
    endAt: 46,
  },
  caught: {
    startAt: 47,
    endAt: 56,
  },
};

type FishingState =
  | "idle"
  | "casting"
  | "ready"
  | "waiting"
  | "reeling"
  | "caught";

export const LifeguardNPC: React.FC = () => {
  const spriteRef = useRef<SpriteSheetInstance>();

  let initialState: FishingState = "idle";

  const { scale } = useContext(ZoomContext);
  const onIdleFinish = () => {
    spriteRef.current?.setStartAt(FISHING_FRAMES.casting.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.casting.endAt);
  };

  const onCastFinish = () => {
    spriteRef.current?.setStartAt(FISHING_FRAMES.waiting.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.waiting.endAt);
  };

  const onWaitFinish = () => {
    spriteRef.current?.setStartAt(FISHING_FRAMES.reeling.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.reeling.endAt);
  };

  const onCaughtFinish = () => {
    spriteRef.current?.setStartAt(FISHING_FRAMES.idle.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.idle.endAt);
  };

  return (
    <>
      <Spritesheet
        className={classNames("")}
        style={{
          width: `${PIXEL_SCALE * 58}px`,
          left: `${PIXEL_SCALE * 0}px`,
          top: `${PIXEL_SCALE * 0}px`,

          imageRendering: "pixelated",
        }}
        getInstance={(spritesheet) => {
          spriteRef.current = spritesheet;
        }}
        image={SUNNYSIDE.npcs.fishing_sheet}
        widthFrame={58}
        heightFrame={50}
        zoomScale={scale}
        fps={14}
        steps={56}
        startAt={FISHING_FRAMES[initialState].startAt}
        endAt={FISHING_FRAMES[initialState].endAt}
        direction={`forward`}
        autoplay
        loop
        onEnterFrame={[
          {
            frame: FISHING_FRAMES.idle.endAt - 1,
            callback: onIdleFinish,
          },
          {
            frame: FISHING_FRAMES.casting.endAt - 1,
            callback: onCastFinish,
          },
          {
            frame: FISHING_FRAMES.waiting.endAt - 1,
            callback: onWaitFinish,
          },
          {
            frame: FISHING_FRAMES.caught.endAt - 1,
            callback: onCaughtFinish,
          },
        ]}
      />
    </>
  );
};
