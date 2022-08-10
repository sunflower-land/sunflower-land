import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import sparkSheet from "assets/resources/stone/stone_spark.png";
import dropSheet from "assets/resources/stone/stone_drop.png";
import hitbox from "assets/resources/stone/stone_hitbox.png";
import stone from "assets/resources/stone.png";
import pickaxe from "assets/tools/wood_pickaxe.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import { getTimeLeft } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { miningAudio, miningFallAudio } from "lib/utils/sfx";
import { HealthBar } from "components/ui/HealthBar";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { LandExpansionRock } from "features/game/types/game";
import {
  canMine,
  STONE_RECOVERY_TIME,
} from "features/game/events/landExpansion/stoneMine";
import { MINE_ERRORS } from "features/game/events/stoneMine";

const POPOVER_TIME_MS = 1000;
const HITS = 3;

interface Props {
  rockIndex: number;
  expansionIndex: number;
}

export const Stone: React.FC<Props> = ({ rockIndex, expansionIndex }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [game] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [showLabel, setShowLabel] = useState(false);
  const [popover, setPopover] = useState<JSX.Element | null>();

  const [touchCount, setTouchCount] = useState(0);
  // When to hide the wood that pops out
  const [collecting, setCollecting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sparkGif = useRef<SpriteSheetInstance>();
  const minedGif = useRef<SpriteSheetInstance>();

  const [showRockTimeLeft, setShowRockTimeLeft] = useState(false);

  const { setToast } = useContext(ToastContext);
  const expansion = game.context.state.expansions[expansionIndex];
  const rock = expansion.stones?.[rockIndex] as LandExpansionRock;
  const tool = "Pickaxe";

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

  // Users will need to refresh to strike the rock again
  const mined = !canMine(rock);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const hasPickaxes =
    selectedItem === tool && game.context.state.inventory[tool]?.gte(1);

  const strike = () => {
    if (mined) {
      return;
    }

    sparkGif.current?.goToAndPlay(0);

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
      gameService.send("rock.mined", {
        index: rockIndex,
        expansionIndex,
      });
      setCollecting(true);
      minedGif.current?.goToAndPlay(0);

      displayPopover(
        <div className="flex">
          <img src={stone} className="w-5 h-5 mr-2" />
          <span className="text-sm text-white text-shadow">{`+${rock.stone.amount}`}</span>
        </div>
      );

      setToast({
        icon: stone,
        content: `+${rock.stone.amount}`,
      });

      await new Promise((res) => setTimeout(res, 2000));
      setCollecting(false);
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

    if (hasPickaxes) return;

    containerRef.current?.classList["add"]("cursor-not-allowed");
    setShowLabel(true);
  };

  const handleMouseLeave = () => {
    setShowRockTimeLeft(false);

    if (hasPickaxes) return;

    containerRef.current?.classList["remove"]("cursor-not-allowed");
    setShowLabel(false);
  };

  const timeLeft = getTimeLeft(rock.stone.minedAt, STONE_RECOVERY_TIME);

  return (
    <div className="relative z-10 group" ref={containerRef}>
      <img
        src={hitbox}
        style={{
          width: `${22 * PIXEL_SCALE}px`,
          opacity: 0.3,
        }}
        className="z-10  cursor-pointer"
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
        onClick={strike}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          // The GIFs are larger than the rock due to the animations, so place correctly
          transform: `translateY(${-GRID_WIDTH_PX * 2.947}px) translateX(${
            -GRID_WIDTH_PX * 0.6888
          }px)`,
        }}
      >
        {!mined && (
          <>
            <Spritesheet
              className="group-hover:img-highlight pointer-events-none "
              style={{
                width: `${PIXEL_SCALE * 91}px`,
                imageRendering: "pixelated",
              }}
              getInstance={(spritesheet) => {
                sparkGif.current = spritesheet;
              }}
              image={sparkSheet}
              widthFrame={455 / 5}
              heightFrame={66}
              fps={24}
              steps={5}
              direction={`forward`}
              autoplay={false}
              loop={true}
              onLoopComplete={(spritesheet) => {
                spritesheet.pause();
              }}
            />
            <div
              className={`absolute top-10 transition pointer-events-none w-28 z-20 ${
                showLabel ? "opacity-100" : "opacity-0"
              }`}
            >
              <Label className="p-2">Equip {tool.toLowerCase()}</Label>
            </div>
          </>
        )}

        <Spritesheet
          style={{
            width: `${PIXEL_SCALE * 91}px`,

            // Line it up with the click area
            opacity: collecting ? 1 : 0,
            transition: "opacity 0.2s ease-in",
            imageRendering: "pixelated",
          }}
          getInstance={(spritesheet) => {
            minedGif.current = spritesheet;
          }}
          image={dropSheet}
          widthFrame={91}
          heightFrame={66}
          fps={18}
          steps={7}
          direction={`forward`}
          autoplay={false}
          loop={true}
          onLoopComplete={(spritesheet) => {
            spritesheet.pause();
          }}
        />

        <TimeLeftPanel
          text="Recovers in:"
          timeLeft={timeLeft}
          showTimeLeft={showRockTimeLeft}
        />

        <div
          className={classNames(
            "transition-opacity pointer-events-none absolute top-32 left-9",
            {
              "opacity-100": touchCount > 0,
              "opacity-0": touchCount === 0,
            }
          )}
        >
          <HealthBar
            percentage={collecting ? 0 : 100 - (touchCount / 3) * 100}
          />
        </div>

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
    </div>
  );
};
