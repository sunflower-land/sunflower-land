import React, { useContext, useRef } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import reel from "assets/ui/reel.png";

import { ZoomContext } from "components/ZoomProvider";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { FishingService, FishingState } from "./fishingMachines";

type SpriteFrames = { startAt: number; endAt: number };

const FISHING_FRAMES: Record<FishingState["value"], SpriteFrames> = {
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
interface Props {
  fishingService: FishingService;
  onClick: () => void;
}
export const FishermanNPC: React.FC<Props> = ({ onClick, fishingService }) => {
  const spriteRef = useRef<SpriteSheetInstance>();
  const { scale } = useContext(ZoomContext);

  const [fishingState] = useActor(fishingService);

  const state = fishingState.value as FishingState["value"];

  console.log({ state: fishingState.value });
  const onIdleFinish = () => {
    console.log("Check");
    if (fishingState.matches("casting")) {
      spriteRef.current?.setStartAt(FISHING_FRAMES.casting.startAt);
      spriteRef.current?.setEndAt(FISHING_FRAMES.casting.endAt);
    }
  };

  const onCastFinish = () => {
    fishingService.send("WAIT");
    spriteRef.current?.setStartAt(FISHING_FRAMES.waiting.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.waiting.endAt);

    // TESTING
    setTimeout(() => fishingService.send("BIT"), 1000);
  };

  const onWaitFinish = () => {
    if (fishingState.matches("ready")) {
      console.log("SET THE REEEEEEL");
      spriteRef.current?.setStartAt(FISHING_FRAMES.reeling.startAt);
      spriteRef.current?.setEndAt(FISHING_FRAMES.reeling.endAt);
    }
  };

  const onReelFinish = () => {
    console.log("On reel finish");
  };

  const onCaughtFinish = () => {
    console.log("Show modal!");
    fishingService.send("CAUGHT");
    spriteRef.current?.setStartAt(FISHING_FRAMES.idle.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.idle.endAt);
  };

  const reelIn = () => {
    fishingService.send("REEL");

    spriteRef.current?.setStartAt(FISHING_FRAMES.caught.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.caught.endAt);
  };

  return (
    <>
      {fishingState.matches("ready") && (
        <>
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              left: `${PIXEL_SCALE * 7}px`,
              top: `${PIXEL_SCALE * -15}px`,

              imageRendering: "pixelated",
            }}
            className="absolute"
          />
          <img
            src={reel}
            onClick={reelIn}
            style={{
              width: `${PIXEL_SCALE * 39}px`,
              left: `${PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 36}px`,

              imageRendering: "pixelated",
            }}
            className="absolute z-10 cursor-pointer"
          />
        </>
      )}
      <Spritesheet
        className={classNames("absolute  z-50", {
          "hover:img-highlight cursor-pointer": fishingState.matches("idle"),
        })}
        style={{
          width: `${PIXEL_SCALE * 58}px`,
          left: `${PIXEL_SCALE * -10}px`,
          top: `${PIXEL_SCALE * -14}px`,

          imageRendering: "pixelated",
        }}
        onClick={onClick}
        getInstance={(spritesheet) => {
          spriteRef.current = spritesheet;
        }}
        image={SUNNYSIDE.npcs.fishing_sheet}
        widthFrame={58}
        heightFrame={50}
        zoomScale={scale}
        fps={14}
        steps={56}
        startAt={FISHING_FRAMES[state].startAt}
        endAt={FISHING_FRAMES[state].endAt}
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
            frame: FISHING_FRAMES.reeling.endAt - 1,
            callback: onReelFinish,
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
