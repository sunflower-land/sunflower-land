import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import cancel from "assets/icons/cancel.png";

import { Context } from "features/game/GameProvider";
import {
  FERTILISERS,
  InventoryItemName,
  Reward,
} from "features/game/types/game";
import { CropName, CROPS } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  GRID_WIDTH_PX,
  PIXEL_SCALE,
  POPOVER_TIME_MS,
} from "features/game/lib/constants";
import { Soil } from "./Soil";
import { harvestAudio, plantAudio } from "lib/utils/sfx";
import Spritesheet from "components/animation/SpriteAnimator";
import { CropReward } from "./CropReward";
import { HARVEST_PROC_ANIMATION } from "../lib/plant";
import { Bar } from "components/ui/ProgressBar";

interface Props {
  selectedItem?: InventoryItemName;
  fieldIndex: number;
  className?: string;
  onboarding?: boolean;
}

const isCropReady = (now: number, plantedAt: number, harvestSeconds: number) =>
  now - plantedAt > harvestSeconds * 1000;

const REMOVE_CROP_TIMEOUT = 5000; // 5 seconds

export const Field: React.FC<Props> = ({
  selectedItem,
  className,
  fieldIndex,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popover, setPopover] = useState<JSX.Element | null>();
  const [procAnimation, setProcAnimation] = useState<JSX.Element | null>();
  const { gameService } = useContext(Context);
  const [touchCount, setTouchCount] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const [game] = useActor(gameService);
  const clickedAt = useRef<number>(0);
  const field = game.context.state.fields[fieldIndex];
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // If selected item changes, then stop removing crops
  useEffect(() => setIsRemoving(false), [selectedItem]);

  // If enough time has passed, then stop removing crops
  useEffect(() => {
    if (!isRemoving) return;
    const timer = setTimeout(() => setIsRemoving(false), REMOVE_CROP_TIMEOUT);
    return () => clearTimeout(timer);
  }, [isRemoving]);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const onCollectReward = (success: boolean) => {
    setReward(null);
    setTouchCount(0);
    if (success) {
      harvestCrop();
    }
  };

  const removeCrop = () => {
    if (!isRemoving) {
      setIsRemoving(true);
      return;
    }
    gameService.send("item.removed", {
      item: selectedItem,
      fieldIndex,
    });
    setIsRemoving(false);
  };

  const harvestCrop = () => {
    const newState = gameService.send("item.harvested", {
      index: fieldIndex,
    });

    if (!newState.matches("hoarding")) {
      harvestAudio.play();

      if (field.multiplier && field.multiplier >= 10) {
        setProcAnimation(
          <Spritesheet
            className="absolute pointer-events-none bottom-[4px] -left-[26px]"
            style={{
              width: `${HARVEST_PROC_ANIMATION.size * PIXEL_SCALE}px`,
              imageRendering: "pixelated",
            }}
            image={HARVEST_PROC_ANIMATION.sprites[field.name]}
            widthFrame={HARVEST_PROC_ANIMATION.size}
            heightFrame={HARVEST_PROC_ANIMATION.size}
            fps={HARVEST_PROC_ANIMATION.fps}
            steps={HARVEST_PROC_ANIMATION.steps}
            hiddenWhenPaused={true}
          />
        );
      }

      displayPopover(
        <div className="flex items-center justify-center text-xs text-white overflow-visible">
          <img src={ITEM_DETAILS[field.name].image} className="w-4 mr-1" />
          <span>{`+${field.multiplier || 1}`}</span>
        </div>
      );
    }
  };

  const handleMouseHover = () => {
    // check field if there is a crop
    if (field) {
      const crop = CROPS()[field.name];
      const now = Date.now();
      const isReady = isCropReady(now, field.plantedAt, crop.harvestSeconds);
      const isJustPlanted = now - field.plantedAt < 1000;

      // show details if field is NOT ready and NOT just planted
      if (!isReady && !isJustPlanted) {
        setShowCropDetails(true);
      }
    }

    return;
  };

  const handleMouseLeave = () => {
    setShowCropDetails(false);
  };

  const onClick = (analytics: boolean | undefined = undefined) => {
    // Small buffer to prevent accidental double clicks
    const now = Date.now();
    if (now - clickedAt.current < 100) {
      return;
    }

    clickedAt.current = now;

    // Already looking at a reward
    if (reward) {
      return;
    }

    if (
      field?.reward &&
      isCropReady(now, field.plantedAt, CROPS()[field.name].harvestSeconds)
    ) {
      if (touchCount < 1) {
        setTouchCount((count) => count + 1);
        return;
      }

      // They have touched enough!
      setReward(field.reward);

      return;
    }

    // Plant
    if (!field) {
      try {
        const newState = gameService.send("item.planted", {
          index: fieldIndex,
          item: selectedItem,
          analytics,
        });

        if (!newState.matches("hoarding")) {
          plantAudio.play();

          displayPopover(
            <div className="flex items-center justify-center text-xs text-white overflow-visible">
              <img
                src={ITEM_DETAILS[selectedItem as CropName].image}
                className="w-4 mr-1"
              />
              <span>-1</span>
            </div>
          );

          setProcAnimation(null);
        }
      } catch (e: any) {
        // TODO - catch more elaborate errors
        displayPopover(<img className="w-5" src={cancel} />);
      }

      return;
    }

    // Remove crop
    if (
      selectedItem === "Shovel" &&
      !isCropReady(now, field.plantedAt, CROPS()[field.name].harvestSeconds)
    ) {
      removeCrop();
      return;
    }

    if (selectedItem && selectedItem in FERTILISERS) {
      try {
        gameService.send("item.fertilised", {
          fieldIndex,
          fertiliser: selectedItem,
        });

        return;
        // TODO - sound effects
      } catch {
        displayPopover(<img className="w-5" src={cancel} />);
      }
    }

    try {
      harvestCrop();
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayPopover(<img className="w-5" src={cancel} />);
    }

    setTouchCount(0);
  };

  const playing = game.matches("playing") || game.matches("autosaving");

  return (
    <div
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseLeave}
      className={classNames("relative group", className)}
      style={{
        width: `${GRID_WIDTH_PX}px`,
        height: `${GRID_WIDTH_PX}px`,
      }}
    >
      <Soil
        plantedCrop={field}
        showCropDetails={showCropDetails}
        isRemoving={isRemoving}
      />

      {procAnimation}

      <div
        className={classNames(
          "transition-opacity pointer-events-none absolute bottom-5 flex",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
      >
        <Bar percentage={100 - touchCount * 50} type="health" />
      </div>

      {showPopover && (
        <div className="transition-opacity absolute -bottom-4 w-full z-40 pointer-events-none flex justify-center">
          {popover}
        </div>
      )}

      {playing && (
        <>
          <img
            src={selectBox}
            style={{
              opacity: 0.1,
            }}
            className="absolute block inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-40 cursor-pointer"
            onClick={() => onClick()}
          />
          <img
            src={selectBox}
            style={{
              opacity: 0.1,
              visibility: "hidden",
            }}
            className="absolute block inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-40 cursor-pointer"
            onClick={() => onClick(true)}
          />
        </>
      )}
      <CropReward
        reward={reward}
        onCollected={onCollectReward}
        fieldIndex={fieldIndex}
      />
    </div>
  );
};
