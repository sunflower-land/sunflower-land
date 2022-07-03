import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import sparkSheet from "assets/resources/shrub/shrub-sheet.png";
import dropSheet from "assets/resources/tree/chopped_sheet.png";
import smallShrub from "assets/resources/green_bush.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import { getTimeLeft } from "lib/utils/time";

import { canChop } from "features/game/events/chopShrub";
import { miningAudio, miningFallAudio } from "lib/utils/sfx";
import { HealthBar } from "components/ui/HealthBar";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";

const POPOVER_TIME_MS = 1000;
const HITS = 2;

// 10 minutes
const SHRUB_RECOVERY_TIME = 10 * 60;

interface Props {
  shrubIndex: number;
}

export const Shrub: React.FC<Props> = ({ shrubIndex }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>();

  const [touchCount, setTouchCount] = useState(0);
  // When to hide the shrub that pops out
  const [collecting, setCollecting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sparkGif = useRef<SpriteSheetInstance>();
  const choppedGif = useRef<SpriteSheetInstance>();

  const [showShrubTimeLeft, setShowShrubTimeLeft] = useState(false);

  const shrub = game.context.state.shrubs[shrubIndex];
  // Users will need to refresh to chop the tree again
  const chopped = !canChop(shrub);
  const { setToast } = useContext(ToastContext);

  // Reset the shake count when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setTouchCount(0);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  // Show/Hide Time left on hover

  const handleMouseHoverShrub = () => {
    if (chopped) setShowShrubTimeLeft(true);
  };

  const handleMouseLeaveShrub = () => {
    setShowShrubTimeLeft(false);
  };

  const strike = () => {
    const isPlaying = sparkGif.current?.getInfo("isPlaying");

    if (!isPlaying) {
      miningAudio.play();

      sparkGif.current?.goToAndPlay(0);

      setTouchCount((count) => count + 1);

      // On second strike, chop
      if (touchCount > 0 && touchCount === HITS - 1) {
        chop();
        miningFallAudio.play();
        setTouchCount(0);
      }
    } else return;
  };

  const chop = async () => {
    setTouchCount(0);

    try {
      gameService.send("shrub.chopped", {
        index: shrubIndex,
      });
      setCollecting(true);
      choppedGif.current?.goToAndPlay(0);

      displayPopover(
        <div className="flex">
          <img src={smallShrub} className="w-5 h-5 mr-2" />
          <span className="text-sm text-white text-shadow">{`+${shrub.wood.amount}`}</span>
        </div>
      );

      setToast({
        icon: smallShrub,
        content: `+${shrub.wood.amount}`,
      });

      await new Promise((res) => setTimeout(res, 2000));
      setCollecting(false);
    } catch (e: any) {
      displayPopover(
        <span className="text-xs text-white text-shadow">{e.message}</span>
      );
    }
  };

  const timeLeft = getTimeLeft(shrub.wood.choppedAt, SHRUB_RECOVERY_TIME);

  return (
    <div
      className="h-full w-full z-10"
      style={{ border: "2px solid red" }}
      onMouseEnter={handleMouseHoverShrub}
      onMouseLeave={handleMouseLeaveShrub}
    >
      {!chopped && (
        <div
          ref={containerRef}
          className="group cursor-pointer w-full h-full"
          onClick={strike}
        >
          <Spritesheet
            className="group-hover:img-highlight pointer-events-none z-10"
            style={{
              width: `${GRID_WIDTH_PX * 1.5}px`,
              imageRendering: "pixelated",
            }}
            getInstance={(spritesheet) => {
              sparkGif.current = spritesheet;
            }}
            image={sparkSheet}
            widthFrame={48}
            heightFrame={32}
            fps={24}
            steps={6}
            direction={`forward`}
            autoplay={false}
            loop={true}
            onLoopComplete={(spritesheet) => {
              spritesheet.pause();
            }}
          />
        </div>
      )}

      <Spritesheet
        style={{
          width: `${GRID_WIDTH_PX}px`,
          // Line it up with the click area
          transform: `translateX(-${GRID_WIDTH_PX * 15}px)`,
          opacity: collecting ? 1 : 0,
          transition: "opacity 0.2s ease-in",
          imageRendering: "pixelated",
        }}
        className="pointer-events-none -z-10"
        getInstance={(spritesheet) => {
          choppedGif.current = spritesheet;
        }}
        image={dropSheet}
        widthFrame={266}
        heightFrame={168}
        fps={20}
        steps={11}
        direction={`forward`}
        autoplay={false}
        loop={true}
        onLoopComplete={(spritesheet) => {
          spritesheet.pause();
        }}
      />

      {/* Hide the empty Shrub behind  */}
      <img
        src={smallShrub}
        className="absolute top-0 pointer-events-none opacity-50"
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
        }}
      />

      <div
        className={classNames(
          "transition-opacity pointer-events-none absolute top-12 left-8",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
      >
        <HealthBar percentage={collecting ? 0 : 100 - (touchCount / 2) * 100} />
      </div>

      {chopped && (
        <div
          className="absolute"
          id="chopped-shrub"
          style={{
            bottom: "90px",
            left: "-30px",
          }}
        >
          <TimeLeftPanel
            text="Recovers in:"
            timeLeft={timeLeft}
            showTimeLeft={showShrubTimeLeft}
          />
        </div>
      )}

      <div
        className={classNames(
          "transition-opacity absolute top-24 w-40 left-20 z-20 pointer-events-none",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
      </div>
    </div>
  );
};
