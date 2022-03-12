import React, { useContext, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";

import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";

import { CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Soil } from "./Soil";
import { useTour } from "@reactour/tour";
import { TourStep } from "features/game/lib/Tour";
import plant from "../../../assets/sound-effects/plant.mp3";
import harvest from "../../../assets/sound-effects/harvest.mp3";

const POPOVER_TIME_MS = 1000;

interface Props {
  selectedItem?: InventoryItemName;
  fieldIndex: number;
  className?: string;
  onboarding?: boolean;
}

export const Field: React.FC<Props> = ({
  selectedItem,
  className,
  fieldIndex,
  onboarding,
}) => {
  const {
    isOpen: tourIsOpen,
    setCurrentStep: setCurrentTourStep,
    currentStep: currentTourStep,
  } = useTour();
  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>(null);
  const { gameService, shortcutItem } = useContext(Context);
  const [game] = useActor(gameService);
  const clickedAt = useRef<number>(0);
  const field = game.context.state.fields[fieldIndex];

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const onClick = () => {
    // Small buffer to prevent accidental double clicks
    const now = Date.now();
    if (now - clickedAt.current < 100) {
      return;
    }

    if (onboarding && tourIsOpen) {
      currentTourStep === TourStep.harvest
        ? setCurrentTourStep(TourStep.openInventory)
        : setCurrentTourStep(TourStep.save);
    }

    clickedAt.current = now;
    const harvestAudio = new Audio(plant);
    const plantingAudio = new Audio(harvest);
    harvestAudio.volume = 0.2;
    plantingAudio.volume = 0.2;

    // Plant
    if (!field) {
      try {
        gameService.send("item.planted", {
          index: fieldIndex,
          item: selectedItem,
        });

        harvestAudio.play();

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
        displayPopover(
          <span className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
            {e.message}
          </span>
        );
      }

      return;
    }

    try {
      gameService.send("item.harvested", {
        index: fieldIndex,
      });

      plantingAudio.play();

      displayPopover(
        <div className="flex items-center justify-center text-xs text-white text-shadow overflow-visible">
          <img src={ITEM_DETAILS[field.name].image} className="w-4 mr-1" />
          <span>+1</span>
        </div>
      );
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayPopover(
        <span className="text-xs text-white text-shadow">{e.message}</span>
      );
    }
  };

  const playingOrTouring = game.matches("playing") || game.matches("touring");
  return (
    <div
      className={classNames("relative group", className)}
      style={{
        width: `${GRID_WIDTH_PX}px`,
        height: `${GRID_WIDTH_PX}px`,
      }}
    >
      <Soil className="absolute bottom-0" field={field} />

      <div
        className={classNames(
          "transition-opacity absolute -bottom-2 w-40 -left-16 z-20 pointer-events-none",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
      </div>
      {playingOrTouring && (
        <img
          src={selectBox}
          style={{
            opacity: 0.1,
          }}
          className="absolute inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-20 cursor-pointer"
          onClick={onClick}
        />
      )}
    </div>
  );
};
