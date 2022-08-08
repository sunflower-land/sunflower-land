import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import sparkSheet from "assets/resources/pebble/pebble_sheet.png";
import smallStone from "assets/resources/small_stone.png";
import dropSheet from "assets/resources/pebble/pebble_drop.png";

import { Context } from "features/game/GameProvider";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { useActor } from "@xstate/react";

import { getTimeLeft } from "lib/utils/time";

import {
  canMine,
  PEBBLE_RECOVERY_TIME,
} from "features/game/events/landExpansion/pebbleStrike";
import { miningAudio, miningFallAudio } from "lib/utils/sfx";
import classNames from "classnames";
import { HealthBar } from "components/ui/HealthBar";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { LandExpansionRock } from "features/game/types/game";

const POPOVER_TIME_MS = 1000;
const HITS = 2;

interface Props {
  pebbleIndex: number;
  expansionIndex: number;
}

export const Pebble: React.FC<Props> = ({ pebbleIndex, expansionIndex }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>();

  const [touchCount, setTouchCount] = useState(0);
  // When to hide the pebble that pops out
  const [collecting, setCollecting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sparkGif = useRef<SpriteSheetInstance>();
  const minedGif = useRef<SpriteSheetInstance>();

  const [showPebbleTimeLeft, setShowPebbleTimeLeft] = useState(false);
  const expansion = game.context.state.expansions[expansionIndex];
  const pebble = expansion.pebbles?.[pebbleIndex] as LandExpansionRock;

  // Users will need to refresh to chop the tree again
  const mined = !canMine(pebble);
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

  const handleMouseHoverPebble = () => {
    if (mined) setShowPebbleTimeLeft(true);
  };

  const handleMouseLeavePebble = () => {
    setShowPebbleTimeLeft(false);
  };

  const strike = () => {
    const isPlaying = sparkGif.current?.getInfo("isPlaying");

    if (!isPlaying) {
      miningAudio.play();
      sparkGif.current?.goToAndPlay(0);
      setTouchCount((count) => count + 1);

      // On second strike, mine
      if (touchCount > 0 && touchCount === HITS - 1) {
        mine();
        miningFallAudio.play();
        setTouchCount(0);
      }
    }
  };

  const mine = async () => {
    setTouchCount(0);

    try {
      gameService.send("pebble.struck", {
        index: pebbleIndex,
        expansionIndex,
      });
      setCollecting(true);
      minedGif.current?.goToAndPlay(0);

      displayPopover(
        <div className="flex">
          <img src={smallStone} className="w-5 h-5 mr-2" />
          <span className="text-sm text-white text-shadow">{`+${pebble.stone.amount}`}</span>
        </div>
      );

      setToast({
        icon: smallStone,
        content: `+${pebble.stone.amount}`,
      });

      await new Promise((res) => setTimeout(res, 2000));
      setCollecting(false);
    } catch (e: any) {
      displayPopover(
        <span className="text-xs text-white text-shadow">{e.message}</span>
      );
    }
  };

  const timeLeft = getTimeLeft(pebble.stone.minedAt, PEBBLE_RECOVERY_TIME);
  const playing = game.matches("playing") || game.matches("autosaving");

  return (
    <div
      className="relative z-10"
      style={{ height: "40px" }}
      onMouseEnter={playing ? handleMouseHoverPebble : undefined}
      onMouseLeave={playing ? handleMouseLeavePebble : undefined}
    >
      {/* Unmined pebble which is strikeable */}
      {!mined && (
        <div
          ref={containerRef}
          className={classNames("group w-full h-full", {
            "cursor-pointer": playing,
          })}
          onClick={playing ? strike : undefined}
        >
          <Spritesheet
            className={classNames("pointer-events-none z-10", {
              "group-hover:img-highlight": playing,
            })}
            style={{
              position: "absolute",
              left: "-44.7px",
              top: "-37px",
              imageRendering: "pixelated",
              width: `${GRID_WIDTH_PX * 3}px`,
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
            loop={false}
            onLoopComplete={(spritesheet) => {
              spritesheet.pause();
            }}
          />
        </div>
      )}

      <Spritesheet
        style={{
          position: "absolute",
          left: "-10.1px",
          top: "-47.2px",
          opacity: collecting ? 1 : 0,
          // opacity: 1,
          transition: "opacity 0.2s ease-in",
          width: `${GRID_WIDTH_PX * 5}px`,
          imageRendering: "pixelated",
        }}
        className="pointer-events-none z-20"
        getInstance={(spritesheet) => {
          minedGif.current = spritesheet;
        }}
        image={dropSheet}
        widthFrame={80}
        heightFrame={32}
        fps={18}
        steps={10}
        direction={`forward`}
        autoplay={false}
        loop={false}
        onLoopComplete={(spritesheet) => {
          spritesheet.pause();
        }}
      />

      {/* Mined Pebble  */}
      {mined && (
        <>
          <img
            src={smallStone}
            className="pointer-events-none -z-10 absolute opacity-50"
            style={{
              width: `${GRID_WIDTH_PX * 1.1}px`,
            }}
          />
        </>
      )}
      {/* Health bar shown when striking */}
      <div
        className={classNames(
          "absolute top-10 left-1 transition-opacity pointer-events-none",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
      >
        <HealthBar percentage={collecting ? 0 : 100 - (touchCount / 2) * 100} />
      </div>
      {/* Recovery time panel */}
      {mined && (
        <div
          className="absolute"
          style={{
            top: "30px",
            left: "-26px",
          }}
        >
          <TimeLeftPanel
            timeLeft={timeLeft}
            showTimeLeft={showPebbleTimeLeft}
          />
        </div>
      )}
      {/* Popover showing amount of stone collected */}
      <div
        className={classNames(
          "transition-opacity absolute top-8 w-40 left-12 z-20 pointer-events-none",
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
