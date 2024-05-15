import React, { useContext } from "react";

import emptyPot from "assets/greenhouse/greenhouse_pot.webp";
import grapePot from "assets/greenhouse/grape_pot.webp";
import olivePot from "assets/greenhouse/olive_pot.webp";
import ricePot from "assets/greenhouse/rice_pot.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { GreenHouseCropName } from "features/game/types/crops";
import { GreenHouseFruitName } from "features/game/types/fruits";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

const READY_PLANT: Record<GreenHouseCropName | GreenHouseFruitName, string> = {
  Grape: grapePot,
  Olive: olivePot,
  Rice: ricePot,
};

interface Props {
  id: number;
}

const selectPots = (state: MachineState) => state.context.state.greenhouse.pots;

export const GreenhousePot: React.FC<Props> = ({ id }) => {
  const { gameService, selectedItem } = useContext(Context);
  const pots = useSelector(gameService, selectPots);

  const pot = pots[id];

  const plant = () => {
    gameService.send("greenhouse.planted", {
      id,
      seed: selectedItem,
    });
  };

  const harvest = () => {
    gameService.send("greenhouse.harvested", {
      id,
    });
  };

  if (!pot?.plant) {
    return (
      <img
        src={emptyPot}
        className="cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 28}px`,
        }}
        onClick={plant}
      />
    );
  }

  return (
    <img
      src={READY_PLANT[pot.plant.name]}
      className="cursor-pointer hover:img-highlight"
      style={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
      onClick={harvest}
    />
  );
};
