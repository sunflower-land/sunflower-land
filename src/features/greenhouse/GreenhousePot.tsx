import React, { useContext, useRef, useState } from "react";
import { Transition } from "@headlessui/react";

import emptyPot from "assets/greenhouse/greenhouse_pot.webp";
import grapePot from "assets/greenhouse/grape_pot.webp";
import olivePot from "assets/greenhouse/olive_pot.webp";
import ricePot from "assets/greenhouse/rice_pot.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import { GreenHouseFruitName } from "features/game/types/fruits";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { LiveProgressBar } from "components/ui/ProgressBar";
import { GREENHOUSE_SECONDS } from "features/game/events/landExpansion/harvestGreenHouse";
import { ITEM_DETAILS } from "features/game/types/images";
import { GreenhousePlant } from "features/game/types/game";
import { SEED_TO_PLANT } from "features/game/events/landExpansion/plantGreenhouse";
import { QuickSelect } from "./QuickSelect";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";

const READY_PLANT: Record<GreenHouseCropName | GreenHouseFruitName, string> = {
  Grape: grapePot,
  Olive: olivePot,
  Rice: ricePot,
};

interface Props {
  id: number;
}

const selectPots = (state: MachineState) => state.context.state.greenhouse.pots;
const selectInventory = (state: MachineState) => state.context.state.inventory;

export const GreenhousePot: React.FC<Props> = ({ id }) => {
  const { gameService, selectedItem, showTimers } = useContext(Context);

  const [_, setRender] = useState<number>(0);
  const [showHarvested, setShowHarvested] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [pulsating, setPulsating] = useState(false);
  const harvested = useRef<GreenhousePlant>();

  const pots = useSelector(gameService, selectPots);
  const inventory = useSelector(gameService, selectInventory);

  const pot = pots[id];

  const plant = () => {
    if (
      !selectedItem ||
      !SEED_TO_PLANT[selectedItem as GreenHouseCropSeedName] ||
      !inventory[selectedItem]?.gte(1)
    ) {
      setShowQuickSelect(true);
      return;
    }

    gameService.send("greenhouse.planted", {
      id,
      seed: selectedItem,
    });
  };

  const harvest = async () => {
    harvested.current = pot.plant;

    gameService.send("greenhouse.harvested", {
      id,
    });

    setShowHarvested(true);

    await new Promise((res) => setTimeout(res, 2000));

    setShowHarvested(false);
  };

  if (!pot?.plant) {
    return (
      <div
        style={{
          width: `${PIXEL_SCALE * 28}px`,
        }}
      >
        {/* Harvest Animation */}
        <Transition
          appear={true}
          id="oil-reserve-collected-amount"
          show={showHarvested}
          enter="transition-opacity transition-transform duration-200"
          enterFrom="opacity-0 translate-y-6"
          enterTo="opacity-100 -translate-y-2"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex -top-2 left-[40%] absolute w-full z-40 pointer-events-none"
        >
          <img
            src={ITEM_DETAILS[harvested.current?.name ?? "Rice"].image}
            className="mr-2 img-highlight-heavy"
            style={{
              width: `${PIXEL_SCALE * 7}px`,
            }}
          />
          <span className="text-sm">{`+${harvested.current?.amount}`}</span>
        </Transition>

        {/* Quick Select */}
        <Transition
          appear={true}
          show={showQuickSelect}
          enter="transition-opacity transition-transform duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex top-[-200%] absolute z-40 shadow-md"
        >
          <QuickSelect
            icon={SUNNYSIDE.icons.seeds}
            options={getKeys(SEED_TO_PLANT)}
            onClose={() => setShowQuickSelect(false)}
            onSelected={() => setPulsating(true)}
          />
        </Transition>
        <img
          src={emptyPot}
          className={classNames("cursor-pointer hover:img-highlight", {
            "animate-pulsate": showQuickSelect && pulsating,
          })}
          style={{
            width: `${PIXEL_SCALE * 28}px`,
          }}
          onClick={plant}
        />
      </div>
    );
  }

  const harvestSeconds = GREENHOUSE_SECONDS[pot.plant.name];
  const plantedAt = pot.plant.plantedAt;
  const readyAt = plantedAt ? plantedAt + harvestSeconds * 1000 : 0;

  const startAt = plantedAt ?? 0;

  return (
    <div
      style={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
    >
      <img
        src={READY_PLANT[pot.plant.name]}
        className="cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 28}px`,
        }}
        onClick={harvest}
      />
      {showTimers && Date.now() < readyAt && (
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 2.5}px`,
            left: `${PIXEL_SCALE * 6.5}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <LiveProgressBar
            key={`${startAt}-${readyAt}`}
            startAt={startAt}
            endAt={readyAt}
            formatLength="short"
            onComplete={() => setRender((r) => r + 1)}
          />
        </div>
      )}
    </div>
  );
};
