import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import sparkSheet from "assets/resources/stone/stone_spark.png";
import dropSheet from "assets/resources/stone/stone_drop.png";
import empty from "assets/resources/stone/stone_empty.png";
import stone from "assets/resources/stone.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import { getTimeLeft } from "lib/utils/time";
import { ProgressBar } from "components/ui/ProgressBar";
import { Label } from "components/ui/Label";
import { canMine, STONE_RECOVERY_TIME } from "features/game/events/stoneMine";
import miningMP3 from "../../../assets/sound-effects/mining.mp3";
import miningFallMP3 from "../../../assets/sound-effects/mining_fall.mp3";

const POPOVER_TIME_MS = 1000;

interface Props {
  rockIndex: number;
}

export const Stone: React.FC<Props> = ({ rockIndex }) => {
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

  const tool = "Pickaxe";
  const rock = game.context.state.stones[rockIndex];
  // Users will need to refresh to chop the tree again
  const mined = !canMine(rock);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const shake = () => {
    const miningAudio = new Audio(miningMP3);
    const miningFallAudio = new Audio(miningFallMP3);
    miningFallAudio.volume = 0.5;
    miningAudio.volume = 0.5;

    const isPlaying = sparkGif.current?.getInfo("isPlaying");

    if (selectedItem == tool && !isPlaying) {
      miningAudio.play();

      sparkGif.current?.goToAndPlay(0);

      setTouchCount((count) => count + 1);

      // Randomise the shakes to break
      const shakesToBreak = rock.amount.toNumber();

      // On third shake, chop
      if (touchCount > 0 && touchCount === shakesToBreak) {
        mine();
        miningFallAudio.play();
        setTouchCount(0);
      }
    } else return;
  };

  const mine = async () => {
    try {
      gameService.send("stone.mined", {
        index: rockIndex,
      });
      setCollecting(true);
      minedGif.current?.goToAndPlay(0);

      displayPopover(
        <div className="flex">
          <img src={stone} className="w-5 h-5 mr-2" />
          <span className="text-sm text-white text-shadow">{`+${rock.amount}`}</span>
        </div>
      );

      await new Promise((res) => setTimeout(res, 2000));
      setCollecting(false);
    } catch (e: any) {
      displayPopover(
        <span className="text-xs text-white text-shadow">{e.message}</span>
      );
    }
  };

  const handleHover = () => {
    if (selectedItem === tool && game.context.state.inventory[tool]?.gte(1))
      return;
    containerRef.current?.classList["add"]("cursor-not-allowed");
    setShowLabel((prev) => !prev);
  };

  const handleMouseLeave = () => {
    if (selectedItem === tool && game.context.state.inventory[tool]?.gte(1))
      return;
    containerRef.current?.classList["remove"]("cursor-not-allowed");
    setShowLabel((prev) => !prev);
  };

  const recoveryTime = STONE_RECOVERY_TIME;

  const timeLeft = getTimeLeft(rock.minedAt, recoveryTime);
  const percentage = 100 - (timeLeft / recoveryTime) * 100;

  return (
    <div className="relative z-10">
      {!mined && (
        <div
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
          ref={containerRef}
          className="group cursor-pointer  w-full h-full"
          onClick={shake}
        >
          <Spritesheet
            className="group-hover:img-highlight pointer-events-none transform z-10"
            style={{
              width: `${GRID_WIDTH_PX * 5}px`,
              imageRendering: "pixelated",
            }}
            getInstance={(spritesheet) => {
              sparkGif.current = spritesheet;
            }}
            image={sparkSheet}
            widthFrame={91}
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
        </div>
      )}
      <div
        className={`absolute top-10 transition pointer-events-none w-28 ${
          showLabel ? "opacity-100" : "opacity-0"
        }`}
      >
        <Label>Equip {tool.toLowerCase()}</Label>
      </div>

      <Spritesheet
        style={{
          width: `${GRID_WIDTH_PX * 5}px`,
          opacity: collecting ? 1 : 0,
          transition: "opacity 0.2s ease-in",
          imageRendering: "pixelated",
        }}
        className="pointer-events-none z-20"
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

      {/* Hide the empty rock behind  */}
      <img
        src={empty}
        className="absolute top-0 pointer-events-none -z-10"
        style={{
          width: `${GRID_WIDTH_PX * 5}px`,
        }}
      />

      {mined && (
        <>
          <div
            className="absolute"
            style={{
              top: "106px",
              left: "29px",
            }}
          >
            <ProgressBar percentage={percentage} seconds={timeLeft} />
          </div>
        </>
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
