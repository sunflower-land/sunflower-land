import React, { useContext, useEffect, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import sparkSheet from "assets/resources/stone/stone_rock_spark.png";
import dropSheet from "assets/resources/stone/stone_rock_drop.png";
import hitbox from "assets/resources/small_stone.png";
import stone from "assets/resources/stone.png";
import pickaxe from "assets/tools/wood_pickaxe.png";

import {
  GRID_WIDTH_PX,
  STONE_MINE_STAMINA_COST,
} from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import { getTimeLeft } from "lib/utils/time";
import { miningAudio, miningFallAudio } from "lib/utils/sfx";
import { HealthBar } from "components/ui/HealthBar";
import { LandExpansionRock } from "features/game/types/game";
import { STONE_RECOVERY_TIME } from "features/game/events/landExpansion/stoneMine";
import { MINE_ERRORS } from "features/game/events/stoneMine";
import { calculateBumpkinStamina } from "features/game/events/landExpansion/replenishStamina";
import { TimeLeftOverlay } from "components/ui/TimeLeftOverlay";
import { Overlay } from "react-bootstrap";
import { Label } from "components/ui/Label";
import { canMine } from "../../lib/utils";

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
  const [errorLabel, setErrorLabel] = useState<"noStamina" | "noPickaxe">();
  const [popover, setPopover] = useState<JSX.Element | null>();

  const [touchCount, setTouchCount] = useState(0);
  // When to hide the stone that pops out
  const [collecting, setCollecting] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkGif = useRef<SpriteSheetInstance>();
  const minedGif = useRef<SpriteSheetInstance>();

  const [showRockTimeLeft, setShowRockTimeLeft] = useState(false);

  const { setToast } = useContext(ToastContext);
  const expansion = game.context.state.expansions[expansionIndex];
  const rock = expansion.stones?.[rockIndex] as LandExpansionRock;
  const tool = "Pickaxe";

  const stamina = game.context.state.bumpkin
    ? calculateBumpkinStamina({
        nextReplenishedAt: Date.now(),
        bumpkin: game.context.state.bumpkin,
      })
    : 0;

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
  const mined = !canMine(rock, STONE_RECOVERY_TIME);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const hasPickaxes =
    selectedItem === tool && game.context.state.inventory[tool]?.gte(1);
  const hasStamina = stamina >= STONE_MINE_STAMINA_COST;

  const strike = () => {
    if (mined) {
      return;
    }

    if (!hasPickaxes || !hasStamina) return;

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
      gameService.send("stoneRock.mined", {
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

    if (!hasPickaxes) {
      containerRef.current?.classList["add"]("cursor-not-allowed");
      setErrorLabel("noPickaxe");
    } else if (!hasStamina) {
      containerRef.current?.classList["add"]("cursor-not-allowed");
      setErrorLabel("noStamina");
    }
  };

  const handleMouseLeave = () => {
    setShowRockTimeLeft(false);

    containerRef.current?.classList["remove"]("cursor-not-allowed");
    setErrorLabel(undefined);
  };

  const timeLeft = getTimeLeft(rock.stone.minedAt, STONE_RECOVERY_TIME);

  return (
    <div
      ref={overlayRef}
      className="relative z-10"
      style={{ height: "40px" }}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
    >
      {/* Unmined stone which is strikeable */}
      {!mined && (
        <div
          ref={containerRef}
          className="group cursor-pointer w-full h-full"
          onClick={strike}
        >
          <>
            <Spritesheet
              className="group-hover:img-highlight pointer-events-none z-10"
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
            <Overlay
              target={containerRef.current}
              show={errorLabel !== undefined}
              placement="right"
            >
              {(props) => (
                <div {...props} className="absolute -left-1/2 z-10 w-28">
                  {errorLabel === "noPickaxe" && (
                    <Label className="p-2">Equip {tool.toLowerCase()}</Label>
                  )}
                  {errorLabel === "noStamina" && (
                    <Label className="p-2">No Stamina</Label>
                  )}
                </div>
              )}
            </Overlay>
          </>
        </div>
      )}

      <Spritesheet
        style={{
          position: "absolute",
          left: "-86.5px",
          top: "-50px",
          opacity: collecting ? 1 : 0,
          transition: "opacity 0.2s ease-in",
          width: `${GRID_WIDTH_PX * 7}px`,
          imageRendering: "pixelated",
        }}
        className="pointer-events-none z-20"
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

      {/* Mined stone  */}
      {mined && (
        <>
          <img
            src={hitbox}
            className="pointer-events-none -z-10 absolute opacity-50"
            style={{
              width: `${GRID_WIDTH_PX}px`,
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
        <HealthBar percentage={collecting ? 0 : 100 - (touchCount / 3) * 100} />
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
          {overlayRef.current && (
            <TimeLeftOverlay
              target={overlayRef.current}
              timeLeft={timeLeft}
              showTimeLeft={showRockTimeLeft}
            />
          )}
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
