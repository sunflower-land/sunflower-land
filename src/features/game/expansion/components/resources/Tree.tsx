import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import Decimal from "decimal.js-light";

import shakeSheet from "assets/resources/tree/shake_sheet.png";
import choppedSheet from "assets/resources/tree/chopped_sheet.png";
import stump from "assets/resources/tree/stump.png";
import wood from "assets/resources/wood.png";
import sfltoken from "assets/icons/token_2.png";
import axe from "assets/tools/axe.png";

import {
  GRID_WIDTH_PX,
  PIXEL_SCALE,
  POPOVER_TIME_MS,
  TREE_RECOVERY_TIME,
} from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import { getTimeLeft } from "lib/utils/time";
import { chopAudio, treeFallAudio } from "lib/utils/sfx";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { LandExpansionTree, Reward, Wood } from "features/game/types/game";
import {
  canChop,
  CHOP_ERRORS,
  getRequiredAxeAmount,
} from "features/game/events/landExpansion/chop";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import { ChestReward } from "features/game/expansion/components/resources/components/ChestReward";

const HITS = 3;
const tool = "Axe";

const SHAKE_SHEET_FRAME_WIDTH = 448 / 7;
const SHAKE_SHEET_FRAME_HEIGHT = 48;

const CHOPPED_SHEET_FRAME_WIDTH = 1040 / 13;
const CHOPPED_SHEET_FRAME_HEIGHT = 48;

interface Props {
  treeIndex: number;
  expansionIndex: number;
}

export const Tree: React.FC<Props> = ({ treeIndex, expansionIndex }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [game] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [errorLabel, setErrorLabel] = useState<"noAxe">();
  const [popover, setPopover] = useState<JSX.Element | null>();
  const [reward, setReward] = useState<Reward | null>(null);
  const [touchCount, setTouchCount] = useState(0);
  // When to hide the wood that pops out
  const [collecting, setCollecting] = useState(false);

  const treeRef = useRef<HTMLDivElement>(null);
  const shakeGif = useRef<SpriteSheetInstance>();
  const choppedGif = useRef<SpriteSheetInstance>();

  const [showStumpTimeLeft, setShowStumpTimeLeft] = useState(false);

  const { setToast } = useContext(ToastContext);
  const expansion = game.context.state.expansions[expansionIndex];
  const tree = expansion.trees?.[treeIndex] as LandExpansionTree;
  const woodObj = expansion.trees?.[treeIndex].wood as Wood;

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

  const chopped = !canChop(tree);

  useUiRefresher({ active: chopped });

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  // Show/Hide Time left on hover

  const handleMouseHoverStump = () => {
    setShowStumpTimeLeft(true);
  };

  const handleMouseLeaveStump = () => {
    setShowStumpTimeLeft(false);
  };

  const axesNeeded = getRequiredAxeAmount(
    game.context.state.inventory,
    game.context.state.collectibles
  );
  const axeAmount = game.context.state.inventory.Axe || new Decimal(0);

  // Has enough axes to chop the tree
  const hasAxes =
    (selectedItem === "Axe" || axesNeeded.eq(0)) && axeAmount.gte(axesNeeded);

  const shake = async () => {
    if (!hasAxes) {
      return;
    }

    const isPlaying = shakeGif.current?.getInfo("isPlaying");

    if (isPlaying) {
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
      if (woodObj.reward && canChop(tree)) {
        if (touchCount < 1) {
          // Add to touch count for reward pickup
          setTouchCount((count) => count + 1);
          return;
        }

        // They have touched enough!
        setReward(woodObj.reward);

        return;
      }
      chop();
      treeFallAudio.play();
      setTouchCount(0);
    }
  };

  const onCollectReward = (success: boolean) => {
    setReward(null);
    setTouchCount(0);
    if (success && tree) {
      //Toast for the ChestReward
      //@NOTE This Toast only supports SFL rewards 😭
      setToast({
        icon: sfltoken,
        content: `+${reward?.sfl?.toString()}`,
      });
      chop();
    }
  };

  const chop = async () => {
    setTouchCount(0);

    try {
      const newState = gameService.send("timber.chopped", {
        index: treeIndex,
        expansionIndex,
        item: selectedItem,
      });

      if (!newState.matches("hoarding")) {
        setCollecting(true);
        choppedGif.current?.goToAndPlay(0);

        displayPopover(
          <div className="flex">
            <img
              src={wood}
              className="mr-2"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            <span className="text-sm text-white text-shadow">{`+${tree.wood.amount}`}</span>
          </div>
        );

        setToast({
          icon: wood,
          content: `+${tree.wood.amount}`,
        });

        await new Promise((res) => setTimeout(res, 2000));
        setCollecting(false);
      }
    } catch (e: any) {
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
    }
  };

  const handleHover = () => {
    if (!hasAxes) {
      treeRef.current?.classList["add"]("cursor-not-allowed");
      setErrorLabel("noAxe");
    }
  };

  const handleMouseLeave = () => {
    treeRef.current?.classList["remove"]("cursor-not-allowed");
    setErrorLabel(undefined);
  };

  const timeLeft = getTimeLeft(tree.wood.choppedAt, TREE_RECOVERY_TIME);

  return (
    <div className="relative w-full h-full mt-3">
      {!chopped && (
        <>
          <div
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            ref={treeRef}
            className="group cursor-pointer w-full h-full"
            onClick={shake}
          >
            <Spritesheet
              className="relative group-hover:img-highlight pointer-events-none transform w-full h-full"
              style={{
                width: `${SHAKE_SHEET_FRAME_WIDTH * PIXEL_SCALE}px`,
                height: `${SHAKE_SHEET_FRAME_HEIGHT * PIXEL_SCALE}px`,
                imageRendering: "pixelated",
                position: "absolute",

                // Adjust the base of tree to be perfectly aligned to
                // on a grid point.
                bottom: `${8 * PIXEL_SCALE}px`,
                right: `-${4 * PIXEL_SCALE}px`,
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
              "transition-opacity absolute top-2 w-fit left-20 ml-2 z-50 pointer-events-none p-1",
              {
                "opacity-100": errorLabel === "noAxe",
                "opacity-0": errorLabel !== "noAxe",
              }
            )}
          >
            <div className="text-xxs text-white mx-1">
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
          position: "absolute",

          // Adjust the base of tree to be perfectly aligned to
          // on a grid point.
          bottom: `${8 * PIXEL_SCALE}px`,
          right: `-${4 * PIXEL_SCALE}px`,
        }}
        className="absolute bottom-0 pointer-events-none z-40"
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

      {chopped && (
        <div
          style={{
            position: "absolute",
            width: `${GRID_WIDTH_PX * 2}px`,
            height: `${GRID_WIDTH_PX * 2}px`,
            bottom: 0,
          }}
        >
          <img
            src={stump}
            className="relative opacity-50"
            style={{
              width: `${GRID_WIDTH_PX}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={handleMouseHoverStump}
            onMouseLeave={handleMouseLeaveStump}
          />
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * -15}px`,
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
          "transition-opacity pointer-events-none absolute bottom-5 left-6",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
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
              treeIndex,
              expansionIndex,
            })
          }
        />
      </div>
    </div>
  );
};
