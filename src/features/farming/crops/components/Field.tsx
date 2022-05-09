import React, { useContext, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import cancel from "assets/icons/cancel.png";

import { Context } from "features/game/GameProvider";
import { InventoryItemName, Reward } from "features/game/types/game";

import { CropName, CROPS } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Soil } from "./Soil";
import { harvestAudio, plantAudio } from "lib/utils/sfx";
import { HealthBar } from "components/ui/HealthBar";
import { CropReward } from "./CropReward";

const POPOVER_TIME_MS = 1000;

interface Props {
  selectedItem?: InventoryItemName;
  fieldIndex: number;
  className?: string;
  onboarding?: boolean;
}

const isCropReady = (now: number, plantedAt: number, harvestSeconds: number) =>
  now - plantedAt > harvestSeconds * 1000;

export const Field: React.FC<Props> = ({
  selectedItem,
  className,
  fieldIndex,
}) => {
  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>();
  const { gameService } = useContext(Context);
  const [touchCount, setTouchCount] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const [game] = useActor(gameService);
  const clickedAt = useRef<number>(0);
  const field = game.context.state.fields[fieldIndex];
  const [showCropDetails, setShowCropDetails] = useState(false);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const onCollectReward = () => {
    setReward(null);
    setTouchCount(0);

    gameService.send("item.harvested", {
      index: fieldIndex,
    });
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

  const onClick = () => {
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
        gameService.send("item.planted", {
          index: fieldIndex,
          item: selectedItem,
        });

        plantAudio.play();

        displayPopover(
          <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
            <img
              src={ITEM_DETAILS[selectedItem as CropName].image}
              className="w-4 mr-1"
            />
            <span>-1</span>
          </div>
        );
      } catch (e: any) {
        // TODO - catch more elaborate errors
        displayPopover(<img className="w-5" src={cancel} />);
      }

      return;
    }

    try {
      gameService.send("item.harvested", {
        index: fieldIndex,
      });

      harvestAudio.play();

      displayPopover(
        <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
          <img src={ITEM_DETAILS[field.name].image} className="w-4 mr-1" />
          <span>{`+${field.multiplier || 1}`}</span>
        </div>
      );
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
        className="absolute bottom-0"
        field={field}
        showCropDetails={showCropDetails}
      />

      <div
        className={classNames(
          "transition-opacity pointer-events-none absolute -bottom-2 left-1",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
      >
        <HealthBar percentage={100 - touchCount * 50} />
      </div>

      <div
        className={classNames(
          "transition-opacity absolute -bottom-2 w-full z-20 pointer-events-none flex justify-center",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
      </div>
      {playing && (
        <img
          src={selectBox}
          style={{
            opacity: 0.1,
          }}
          className="absolute inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-20 cursor-pointer"
          onClick={onClick}
        />
      )}
      <CropReward
        reward={reward}
        onCollected={onCollectReward}
        fieldIndex={fieldIndex}
      />
    </div>
  );
};
