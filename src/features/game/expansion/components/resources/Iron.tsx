import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import sparkSheet from "assets/resources/iron/iron_rock_spark.png";
import dropSheet from "assets/resources/iron/iron_rock_drop.png";
import hitbox from "assets/resources/iron_small.png";
import iron from "assets/resources/iron_rock_ore.png";
import pickaxe from "assets/tools/stone_pickaxe.png";

import {
  GRID_WIDTH_PX,
  IRON_RECOVERY_TIME,
  PIXEL_SCALE,
  POPOVER_TIME_MS,
} from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import { getTimeLeft } from "lib/utils/time";
import { miningAudio, miningFallAudio } from "lib/utils/sfx";
import { LandExpansionRock } from "features/game/types/game";
import { MINE_ERRORS } from "features/game/events/landExpansion/ironMine";
import { canMine } from "../../lib/utils";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";

const HITS = 3;

interface Props {
  ironIndex: number;
  expansionIndex: number;
}

export const Iron: React.FC<Props> = ({ ironIndex, expansionIndex }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [game] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [errorLabel, setErrorLabel] = useState<"noPickaxe">();
  const [popover, setPopover] = useState<JSX.Element | null>();

  const [touchCount, setTouchCount] = useState(0);
  // When to hide the iron that pops out
  const [collecting, setCollecting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sparkGif = useRef<SpriteSheetInstance>();
  const minedGif = useRef<SpriteSheetInstance>();

  const [showRockTimeLeft, setShowRockTimeLeft] = useState(false);

  const { setToast } = useContext(ToastContext);
  const expansion = game.context.state.expansions[expansionIndex];
  const ironRock = expansion.iron?.[ironIndex] as LandExpansionRock;
  const tool = "Stone Pickaxe";

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

  // Users will need to refresh to strike the iron again
  const mined = !canMine(ironRock, IRON_RECOVERY_TIME);

  useUiRefresher({ active: mined });

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const hasPickaxes =
    selectedItem === tool && game.context.state.inventory[tool]?.gte(1);

  const strike = () => {
    if (mined) return;

    if (!hasPickaxes) return;

    const isPlaying = sparkGif.current?.getInfo("isPlaying");

    if (isPlaying) return;

    miningAudio.play();
    sparkGif.current?.goToAndPlay(0);

    setTouchCount((count) => count + 1);

    // On third strike, mine
    if (touchCount > 0 && touchCount === HITS - 1) {
      mine();
      miningFallAudio.play();
      setTouchCount(0);
    }
  };

  const mine = async () => {
    setTouchCount(0);

    try {
      const newState = gameService.send("ironRock.mined", {
        index: ironIndex,
        expansionIndex,
      });

      if (!newState.matches("hoarding")) {
        setCollecting(true);
        minedGif.current?.goToAndPlay(0);

        displayPopover(
          <div className="flex">
            <img
              src={iron}
              className="mr-2"
              style={{
                width: `${PIXEL_SCALE * 10}px`,
              }}
            />
            <span className="text-sm text-white text-shadow">{`+${ironRock.stone.amount}`}</span>
          </div>
        );

        setToast({
          icon: iron,
          content: `+${ironRock.stone.amount}`,
        });

        await new Promise((res) => setTimeout(res, 2000));
        setCollecting(false);
      }
    } catch (e: any) {
      if (e.message === MINE_ERRORS.NO_PICKAXES) {
        displayPopover(
          <div className="flex">
            <img src={pickaxe} className="w-4 h-4 mr-2" />
            <span className="text-xs text-white text-shadow">
              No pickaxes left
            </span>
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
    if (mined) setShowRockTimeLeft(true);

    if (!hasPickaxes) {
      containerRef.current?.classList["add"]("cursor-not-allowed");
      setErrorLabel("noPickaxe");
    }
  };

  const handleMouseLeave = () => {
    setShowRockTimeLeft(false);

    containerRef.current?.classList["remove"]("cursor-not-allowed");
    setErrorLabel(undefined);
  };

  const timeLeft = getTimeLeft(ironRock.stone.minedAt, IRON_RECOVERY_TIME);

  return (
    <div
      className="relative"
      style={{ height: "40px" }}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      {/* Unmined iron which is strikeable */}
      {!mined && (
        <div
          ref={containerRef}
          className="group cursor-pointer w-full h-full"
          onClick={strike}
        >
          <>
            <Spritesheet
              className="group-hover:img-highlight pointer-events-none"
              style={{
                position: "absolute",
                left: "-86.7px",
                top: "-50px",
                imageRendering: "pixelated",
                width: `${GRID_WIDTH_PX * 7}px`,
              }}
              getInstance={(spritesheet) => {
                sparkGif.current = spritesheet;
              }}
              image={sparkSheet}
              widthFrame={112}
              heightFrame={48}
              fps={24}
              steps={6}
              direction={`forward`}
              autoplay={false}
              loop={false}
              onLoopComplete={(spritesheet) => {
                spritesheet.pause();
              }}
            />
            <InnerPanel
              className={classNames(
                "transition-opacity absolute top-2 w-fit left-12 z-50 pointer-events-none",
                {
                  "opacity-100": errorLabel === "noPickaxe",
                  "opacity-0": errorLabel !== "noPickaxe",
                }
              )}
            >
              <div className="text-xxs text-white mx-1 p-1">
                <span>Equip {tool.toLowerCase()}</span>
              </div>
            </InnerPanel>
          </>
        </div>
      )}

      <Spritesheet
        style={{
          position: "absolute",
          left: `${PIXEL_SCALE * -33}px`,
          top: `${PIXEL_SCALE * -19}px`,
          opacity: collecting ? 1 : 0,
          transition: "opacity 0.2s ease-in",
          width: `${GRID_WIDTH_PX * 7}px`,
          imageRendering: "pixelated",
        }}
        className="pointer-events-none z-40"
        getInstance={(spritesheet) => {
          minedGif.current = spritesheet;
        }}
        image={dropSheet}
        widthFrame={112}
        heightFrame={48}
        fps={18}
        steps={10}
        direction={`forward`}
        autoplay={false}
        loop={false}
        onLoopComplete={(spritesheet) => {
          spritesheet.pause();
        }}
      />

      {/* Mined iron  */}
      {mined && (
        <>
          <img
            src={hitbox}
            className="pointer-events-none absolute opacity-50"
            style={{
              width: `${GRID_WIDTH_PX}px`,
            }}
          />
        </>
      )}
      {/* Health bar shown when striking */}
      <div
        className={classNames(
          "absolute top-10 left-0 transition-opacity pointer-events-none",
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
      {/* Recovery time panel */}
      {mined && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -20}px`,
          }}
        >
          <TimeLeftPanel
            text="Recovers in:"
            timeLeft={timeLeft}
            showTimeLeft={showRockTimeLeft}
          />
        </div>
      )}
      {/* Popover showing amount of iron collected */}
      <div
        className={classNames(
          "transition-opacity absolute top-8 w-40 left-12 z-40 pointer-events-none",
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
