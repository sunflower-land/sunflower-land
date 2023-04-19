import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import shakeSheet from "assets/resources/tree/shake_sheet.png";
import choppedSheet from "assets/resources/tree/chopped_sheet.png";
import stump from "assets/resources/tree/stump.png";

import {
  GRID_WIDTH_PX,
  PIXEL_SCALE,
  POPOVER_TIME_MS,
  TREE_RECOVERY_TIME,
} from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";

import { getTimeLeft } from "lib/utils/time";
import { chopAudio, treeFallAudio } from "lib/utils/sfx";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { Reward } from "features/game/types/game";
import {
  canChop,
  CHOP_ERRORS,
  getRequiredAxeAmount,
} from "features/game/events/landExpansion/chop";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import { ChestReward } from "features/island/common/chest-reward/ChestReward";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

const HITS = 3;
const tool = "Axe";

const SHAKE_SHEET_FRAME_WIDTH = 448 / 7;
const SHAKE_SHEET_FRAME_HEIGHT = 48;

const CHOPPED_SHEET_FRAME_WIDTH = 1040 / 13;
const CHOPPED_SHEET_FRAME_HEIGHT = 48;

const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectCollectibles = (state: MachineState) =>
  state.context.state.collectibles;

interface Props {
  id: string;
}

export const Tree: React.FC<Props> = ({ id }) => {
  const { gameService, selectedItem } = useContext(Context);

  const [showPopover, setShowPopover] = useState(true);
  const [errorLabel, setErrorLabel] = useState<"noAxe">();
  const [popover, setPopover] = useState<JSX.Element | null>();
  const [reward, setReward] = useState<Reward>();
  const [touchCount, setTouchCount] = useState(0);
  // When to hide the wood that pops out
  const [collecting, setCollecting] = useState(false);

  const treeRef = useRef<HTMLDivElement>(null);
  const shakeGif = useRef<SpriteSheetInstance>();
  const choppedGif = useRef<SpriteSheetInstance>();

  const [showStumpTimeLeft, setShowStumpTimeLeft] = useState(false);

  const resource = useSelector(
    gameService,
    (state) => state.context.state.trees[id]
  );
  const inventory = useSelector(gameService, selectInventory);
  const collectibles = useSelector(gameService, selectCollectibles);

  const chopped = !canChop(resource);

  useUiRefresher({ active: chopped });

  // Reset the shake count when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (treeRef.current && !treeRef.current.contains(event.target)) {
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

  const axesNeeded = getRequiredAxeAmount(inventory, collectibles);

  // Has enough axes to chop the tree
  const hasAxes =
    (selectedItem === "Axe" || axesNeeded.eq(0)) &&
    inventory[tool]?.gte(axesNeeded);

  const shake = async () => {
    if (chopped) {
      return;
    }

    if (!hasAxes) {
      return;
    }

    const spriteFrame = shakeGif.current?.getInfo("frame");

    if (spriteFrame && spriteFrame < 6) {
      return;
    }

    chopAudio.play();
    shakeGif.current?.goToAndPlay(0);

    setTouchCount((count) => count + 1);

    // On third shake, chop
    if (touchCount > 0 && touchCount === HITS - 1) {
      // already looking at a reward
      if (reward) {
        return;
      }

      // increase touch count if there is a reward
      if (resource.wood.reward && canChop(resource)) {
        if (touchCount < 1) {
          // Add to touch count for reward pickup
          setTouchCount((count) => count + 1);
          return;
        }

        // They have touched enough!
        setReward(resource.wood.reward);

        return;
      }
      chop();
      setTouchCount(0);
    }
  };

  const onCollectReward = (success: boolean) => {
    setReward(undefined);
    setTouchCount(0);
    if (success) {
      chop();
    }
  };

  const chop = async () => {
    console.log("CHOP");
    setTouchCount(0);

    try {
      const newState = gameService.send("timber.chopped", {
        index: id,
        item: selectedItem,
      });

      if (!newState.matches("hoarding")) {
        setCollecting(true);
        treeFallAudio.play();
        choppedGif.current?.goToAndPlay(0);

        displayPopover(
          <div className="flex">
            <img
              src={SUNNYSIDE.resource.wood}
              className="mr-2"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            <span className="text-sm">{`+${resource.wood.amount}`}</span>
          </div>
        );

        await new Promise((res) => setTimeout(res, 2000));
        setCollecting(false);
      }
    } catch (e: any) {
      if (e.message === CHOP_ERRORS.NO_AXES) {
        displayPopover(
          <div className="flex">
            <img src={SUNNYSIDE.tools.axe} className="w-4 h-4 mr-2" />
            <span className="text-xs">No axes left</span>
          </div>
        );
        return;
      }

      displayPopover(<span className="text-xs">{e.message}</span>);
    }
  };

  const handleHover = () => {
    if (chopped) setShowStumpTimeLeft(true);

    if (!hasAxes) {
      treeRef.current?.classList["add"]("cursor-not-allowed");
      setErrorLabel("noAxe");
    }
  };

  const handleMouseLeave = () => {
    setShowStumpTimeLeft(false);

    treeRef.current?.classList["remove"]("cursor-not-allowed");
    setErrorLabel(undefined);
  };

  const timeLeft = getTimeLeft(resource.wood.choppedAt, TREE_RECOVERY_TIME);

  return (
    <div
      className="relative w-full h-full cursor-pointer"
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      {/* Unchopped tree which is choppable */}
      {!chopped && (
        <>
          <div
            ref={treeRef}
            className="group cursor-pointer w-full h-full"
            onClick={shake}
          >
            <Spritesheet
              className="group-hover:img-highlight pointer-events-none"
              style={{
                position: "absolute",
                width: `${SHAKE_SHEET_FRAME_WIDTH * PIXEL_SCALE}px`,
                height: `${SHAKE_SHEET_FRAME_HEIGHT * PIXEL_SCALE}px`,
                imageRendering: "pixelated",

                // Adjust the base of tree to be perfectly aligned to
                // on a grid point.
                bottom: `${PIXEL_SCALE * 2}px`,
                right: `${PIXEL_SCALE * -4}px`,
              }}
              getInstance={(spritesheet) => {
                shakeGif.current = spritesheet;
              }}
              image={shakeSheet}
              widthFrame={SHAKE_SHEET_FRAME_WIDTH}
              heightFrame={SHAKE_SHEET_FRAME_HEIGHT}
              fps={24}
              steps={7}
              direction={`forward`}
              autoplay={false}
              loop={true}
              onLoopComplete={(spritesheet) => {
                spritesheet.pause();
              }}
            />
          </div>
          <InnerPanel
            className={classNames(
              "transition-opacity absolute top-2 w-fit left-20 ml-2 z-50 pointer-events-none",
              {
                "opacity-100": errorLabel === "noAxe",
                "opacity-0": errorLabel !== "noAxe",
              }
            )}
          >
            <div className="text-xxs mx-1 p-1">
              <span>Equip {tool.toLowerCase()}</span>
            </div>
          </InnerPanel>
        </>
      )}

      <Spritesheet
        style={{
          opacity: collecting ? 1 : 0,
          transition: "opacity 0.2s ease-in",

          width: `${CHOPPED_SHEET_FRAME_WIDTH * PIXEL_SCALE}px`,
          height: `${CHOPPED_SHEET_FRAME_HEIGHT * PIXEL_SCALE}px`,
          imageRendering: "pixelated",

          // Adjust the base of tree to be perfectly aligned to
          // on a grid point.
          bottom: `${PIXEL_SCALE * 4}px`,
          right: `${PIXEL_SCALE * -6}px`,
        }}
        className="absolute pointer-events-none z-40"
        getInstance={(spritesheet) => {
          choppedGif.current = spritesheet;
        }}
        image={choppedSheet}
        widthFrame={CHOPPED_SHEET_FRAME_WIDTH}
        heightFrame={CHOPPED_SHEET_FRAME_HEIGHT}
        fps={20}
        steps={11}
        direction={`forward`}
        autoplay={false}
        loop={true}
        onLoopComplete={(spritesheet) => {
          spritesheet.pause();
        }}
      />

      {/* Chopped tree */}
      {chopped && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: `${GRID_WIDTH_PX * 2}px`,
            height: `${GRID_WIDTH_PX * 2}px`,
            bottom: 0,
          }}
        >
          <img
            src={stump}
            className="absolute opacity-50"
            style={{
              width: `${GRID_WIDTH_PX}px`,
              bottom: `${PIXEL_SCALE * 5}px`,
              left: `${PIXEL_SCALE * 8}px`,
            }}
          />
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * -10}px`,
            }}
          >
            <TimeLeftPanel
              text="Recovers in:"
              timeLeft={timeLeft}
              showTimeLeft={showStumpTimeLeft}
            />
          </div>
        </div>
      )}

      <div
        className={classNames(
          "absolute left-1/2 transition-opacity pointer-events-none",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
        style={{
          marginLeft: `${PIXEL_SCALE * -8}px`,
          bottom: `${PIXEL_SCALE * -5}px`,
        }}
      >
        <Bar
          percentage={collecting ? 0 : 100 - (touchCount / 3) * 100}
          type="health"
        />
      </div>

      <div
        className={classNames(
          "transition-opacity absolute -bottom-5 w-40 -left-16 z-40 pointer-events-none",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
        {/* Tree ChestReward */}
        <ChestReward
          reward={reward}
          onCollected={onCollectReward}
          onOpen={() =>
            gameService.send("treeReward.collected", {
              treeIndex: id,
            })
          }
        />
      </div>
    </div>
  );
};
