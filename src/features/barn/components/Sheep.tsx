import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import { AnimalState } from "features/game/types/game";

const COW_STATES: Record<AnimalState, string> = {
  idle: SUNNYSIDE.animals.hungryCow,
};

const _cow = (id: string) => (state: MachineState) =>
  state.context.state.henHouse.animals[id];

export const Sheep: React.FC<{ id: string }> = ({ id }) => {
  const { gameService } = useContext(Context);

  const cow = useSelector(gameService, _cow(id));

  return (
    <div id={`CHICKEN ${id}`} className="relative">
      <img
        src={SUNNYSIDE.animals.chickenShadow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          top: `${PIXEL_SCALE * 10}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
      />
      <img
        src={COW_STATES[cow.state]}
        alt={`${capitalize(cow.state)} Cow`}
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
