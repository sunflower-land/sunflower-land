import React, { useContext, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import shakeSheet from "assets/resources/tree/shake_sheet.png";
import choppedSheet from "assets/resources/tree/chopped_sheet.png";
import stump from "assets/resources/tree/stump.png";
import wood from "assets/resources/wood.png";
import axe from "assets/tools/axe.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";
import {
  canChop,
  CHOP_ERRORS,
  TREE_RECOVERY_SECONDS,
} from "features/game/events/chop";
import { getTimeLeft } from "lib/utils/time";
import { ProgressBar } from "components/ui/ProgressBar";

const POPOVER_TIME_MS = 1000;

interface Props {
  treeIndex: number;
}
export const Tree: React.FC<Props> = ({ treeIndex }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [game] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>();

  const [touchCount, setTouchCount] = useState(0);
  // When to hide the wood that pops out
  const [collecting, setCollecting] = useState(false);

  const shakeGif = useRef<SpriteSheetInstance>();
  const choppedGif = useRef<SpriteSheetInstance>();

  const tree = game.context.state.trees[treeIndex];

  // Users will need to refresh to chop the tree again
  const chopped = !canChop(tree);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const shake = async () => {
    const isPlaying = shakeGif.current?.getInfo("isPlaying");
    if (isPlaying) {
      return;
    }

    shakeGif.current?.goToAndPlay(0);

    setTouchCount((count) => count + 1);

    // Randomise the shakes to break
    const shakesToBreak = ((tree.wood.toNumber() + treeIndex) % 3) + 2;
    console.log({ shakesToBreak });
    console.log({ touchCount });
    // On third shake, chop
    if (touchCount > 0 && touchCount === shakesToBreak) {
      chop();
      setTouchCount(0);
    }
  };

  const chop = async () => {
    try {
      gameService.send("tree.chopped", {
        index: treeIndex,
        item: selectedItem,
      });
      setCollecting(true);
      choppedGif.current?.goToAndPlay(0);

      displayPopover(
        <div className="flex">
          <img src={wood} className="w-5 h-5 mr-2" />
          <span className="text-sm text-white text-shadow">{`+${tree.wood}`}</span>
        </div>
      );

      await new Promise((res) => setTimeout(res, 2000));
      setCollecting(false);
    } catch (e: any) {
      if (e.message === CHOP_ERRORS.MISSING_AXE) {
        displayPopover(
          <div className="flex">
            <img src={axe} className="w-4 h-4 mr-2" />
            <span className="text-xs text-white text-shadow">No axe</span>
          </div>
        );
        return;
      }

      if (e.message === CHOP_ERRORS.NO_AXES) {
        displayPopover(
          <div className="flex">
            <img src={axe} className="w-4 h-4 mr-2" />
            <span className="text-xs text-white text-shadow">No axes left</span>
          </div>
        );
        return;
      }

      displayPopover(
        <span className="text-xs text-white text-shadow">{e.message}</span>
      );

      setTouchCount(0);
    }
  };

  const timeLeft = getTimeLeft(tree.choppedAt, TREE_RECOVERY_SECONDS);
  const percentage = 100 - (timeLeft / TREE_RECOVERY_SECONDS) * 100;
  console.log({ tree });

  return (
    <div className="relative" style={{ height: "106px" }}>
      {!chopped && (
        <div className="group cursor-pointer  w-full h-full" onClick={shake}>
          <Spritesheet
            className="group-hover:img-highlight pointer-events-none transform"
            style={{
              width: `${GRID_WIDTH_PX * 4}px`,
              // Line it up with the click area
              transform: `translateX(-${GRID_WIDTH_PX * 2.5}px)`,
            }}
            getInstance={(spritesheet) => {
              shakeGif.current = spritesheet;
            }}
            image={shakeSheet}
            widthFrame={266}
            heightFrame={168}
            fps={24}
            steps={11}
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
          width: `${GRID_WIDTH_PX * 4}px`,
          // Line it up with the click area
          transform: `translateX(-${GRID_WIDTH_PX * 2.5}px)`,
          opacity: collecting ? 1 : 0,
          transition: "opacity 0.2s ease-in",
        }}
        className="absolute bottom-0 pointer-events-none"
        getInstance={(spritesheet) => {
          choppedGif.current = spritesheet;
        }}
        image={choppedSheet}
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

      {chopped && (
        <>
          <img
            src={stump}
            className="absolute"
            style={{
              width: `${GRID_WIDTH_PX}px`,
              bottom: "9px",
              left: "5px",
            }}
          />
          <div className="absolute -bottom-4 left-1.5">
            <ProgressBar percentage={percentage} seconds={timeLeft} />
          </div>
        </>
      )}

      <div
        className={classNames(
          "transition-opacity absolute -bottom-5 w-40 -left-16 z-20 pointer-events-none",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
      </div>

      {/* Load in as early as possible so its fully downloaded when animation starts*/}
      {/* <Spritesheet
        image={choppedSheet}
        className="hidden"
        widthFrame={266}
        heightFrame={168}
        fps={20}
        steps={11}
        direction={`forward`}
        loop={false}
      /> */}
    </div>
  );
};
