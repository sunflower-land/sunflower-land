import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import { AnimalState } from "features/game/types/game";

const SHEEP_STATES: Record<AnimalState, string> = {
  idle: SUNNYSIDE.animals.hungrySheep,
};

const _sheep = (id: string) => (state: MachineState) =>
  state.context.state.barn.animals[id];

export const Sheep: React.FC<{ id: string }> = ({ id }) => {
  const { gameService } = useContext(Context);

  const sheep = useSelector(gameService, _sheep(id));

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        height: `${GRID_WIDTH_PX * 2}px`,
      }}
    >
      <img
        src={SHEEP_STATES[sheep.state]}
        alt={`${capitalize(sheep.state)} Sheep`}
        style={{
          width: `${PIXEL_SCALE * 25}px`,
          top: `${PIXEL_SCALE * -5}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
      />
    </div>
  );
};
