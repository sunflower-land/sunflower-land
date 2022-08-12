import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import Decimal from "decimal.js-light";

import shakeSheet from "assets/resources/tree/shake_sheet.png";
import choppedSheet from "assets/resources/tree/chopped_sheet.png";
import stump from "assets/resources/tree/stump.png";
import wood from "assets/resources/wood.png";
import axe from "assets/tools/axe.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";
import {
  CHOP_ERRORS,
  getRequiredAxeAmount,
  TREE_RECOVERY_SECONDS,
} from "features/game/events/chop";

import { getTimeLeft } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { chopAudio, treeFallAudio } from "lib/utils/sfx";
import { HealthBar } from "components/ui/HealthBar";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { LandExpansionTree } from "features/game/types/game";
import { canChop } from "features/game/events/landExpansion/chop";
import { Overlay } from "react-bootstrap";

const POPOVER_TIME_MS = 1000;
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
  const [showLabel, setShowLabel] = useState(false);
  const [popover, setPopover] = useState<JSX.Element | null>();

  const [touchCount, setTouchCount] = useState(0);
  // When to hide the wood that pops out
  const [collecting, setCollecting] = useState(false);

  const treeRef = useRef<HTMLDivElement>(null);
  const shakeGif = useRef<SpriteSheetInstance>();
  const choppedGif = useRef<SpriteSheetInstance>();

  const [showStumpTimeLeft, setShowStumpTimeLeft] = useState(false);

  const { setToast } = useContext(ToastContext);
  const expansion = game.context.state.expansions[expansionIndex];
  console.log(expansion);
  console.log(treeIndex);
  const tree = expansion.trees?.[treeIndex] as LandExpansionTree;

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

  // Users will need to refresh to chop the tree again
  const chopped = !canChop(tree);

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

  const axesNeeded = getRequiredAxeAmount(game.context.state.inventory);
  const axeAmount = game.context.state.inventory.Axe || new Decimal(0);

  // Has enough axes to chop the tree
  const hasAxes =
    (selectedItem === "Axe" || axesNeeded.eq(0)) && axeAmount.gte(axesNeeded);

  const shake = async () => {
    shakeGif.current?.goToAndPlay(0);

    if (!hasAxes) {
      return;
    }

    const isPlaying = shakeGif.current?.getInfo("isPlaying");

    if (isPlaying) return;

    chopAudio.play();
    shakeGif.current?.goToAndPlay(0);

    setTouchCount((count) => count + 1);

    // On third shake, chop
    if (touchCount > 0 && touchCount === HITS - 1) {
      chop();
      treeFallAudio.play();
      setTouchCount(0);
    }
  };

  const chop = async () => {
    setTouchCount(0);

    try {
      gameService.send("timber.chopped", {
        index: treeIndex,
        expansionIndex,
        item: selectedItem,
      });
      setCollecting(true);
      choppedGif.current?.goToAndPlay(0);

      displayPopover(
        <div className="flex">
          <img src={wood} className="w-5 h-5 mr-2" />
          <span className="text-sm text-white text-shadow">{`+${tree.wood.amount}`}</span>
        </div>
      );

      setToast({
        icon: wood,
        content: `+${tree.wood.amount}`,
      });

      await new Promise((res) => setTimeout(res, 2000));
      setCollecting(false);
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
    if (hasAxes) return;

    treeRef.current?.classList["add"]("cursor-not-allowed");
    setShowLabel(true);
  };

  const handleMouseLeave = () => {
    if (hasAxes) return;

    treeRef.current?.classList["remove"]("cursor-not-allowed");
    setShowLabel(false);
  };

  const timeLeft = getTimeLeft(tree.wood.choppedAt, TREE_RECOVERY_SECONDS);

  return (
    <div className="relative z-10 w-full h-full">
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
          <Overlay target={treeRef.current} show={showLabel} placement="right">
            {(props) => (
              <div {...props} className="absolute -left-1/2 z-10 w-28">
                <Label className="p-2">Equip {tool.toLowerCase()}</Label>
              </div>
            )}
          </Overlay>
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
        className="absolute bottom-0 pointer-events-none"
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
          <TimeLeftPanel
            text="Recovers in:"
            timeLeft={timeLeft}
            showTimeLeft={showStumpTimeLeft}
          />
        </div>
      )}

      <div
        className={classNames(
          "transition-opacity pointer-events-none absolute top-4 left-2",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
      >
        <HealthBar percentage={collecting ? 0 : 100 - (touchCount / 3) * 100} />
      </div>

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
