import React, { useContext, useRef, useState } from "react";
import Spritesheet from "react-responsive-spritesheet";

import shakeSheet from "assets/resources/tree/shake_sheet.png";
import choppedSheet from "assets/resources/tree/chopped_sheet.png";
import stump from "assets/resources/tree/stump.png";
import wood from "assets/resources/wood.png";
import axe from "assets/tools/axe.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";
import { CHOP_ERRORS } from "features/game/events/chop";

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
  const [collected, setCollected] = useState(false);

  const gif = useRef<Spritesheet>();

  const tree = game.context.state.trees[treeIndex];

  const chopped = tree.wood === 0;

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const shake = async () => {
    const isPlaying = gif.current?.getInfo("isPlaying");
    if (isPlaying) {
      return;
    }

    gif.current?.goToAndPlay(0);

    setTouchCount((count) => count + 1);

    // On third shake, chop
    if (touchCount > 0 && touchCount % 2 === 0) {
      chop();
    }
  };

  const chop = async () => {
    try {
      gameService.send("tree.chopped", {
        index: treeIndex,
        item: selectedItem,
      });

      displayPopover(
        <span className="text-xs text-white text-shadow">Testing only!</span>
      );
      await new Promise((res) => setTimeout(res, 1000));
      setCollected(true);
    } catch (e: any) {
      if (e.message === CHOP_ERRORS.MISSING_AXE) {
        displayPopover(
          <div className="flex">
            <img src={axe} className="w-4 h-4 mr-2" />
            <span className="text-xs text-white text-shadow">
              No axe selected
            </span>
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
              gif.current = spritesheet;
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

      {chopped && (
        <>
          <Spritesheet
            style={{
              width: `${GRID_WIDTH_PX * 4}px`,
              // Line it up with the click area
              transform: `translateX(-${GRID_WIDTH_PX * 2.5}px)`,
              opacity: collected ? 0 : 1,
              transition: "opacity 0.2s ease-in",
            }}
            image={choppedSheet}
            widthFrame={266}
            heightFrame={168}
            fps={24}
            steps={11}
            direction={`forward`}
            autoplay={true}
            loop={false}
          />
          <img
            src={stump}
            className="absolute"
            style={{
              width: `${GRID_WIDTH_PX}px`,
              bottom: "9px",
              left: "5px",
            }}
          />
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
    </div>
  );
};
