import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import { AnimalState } from "features/game/types/game";

const CHICKEN_STATES: Record<AnimalState, string> = {
  idle: SUNNYSIDE.animals.hungryChicken,
};

const _chicken = (id: string) => (state: MachineState) =>
  state.context.state.henHouse.animals[id];

export const Chicken: React.FC<{ id: string }> = ({ id }) => {
  const { gameService } = useContext(Context);

  const chicken = useSelector(gameService, _chicken(id));

  return (
    <div className="relative cursor-pointer">
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
        src={CHICKEN_STATES[chicken.state]}
        alt={`${capitalize(chicken.state)} Chicken`}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          top: `${PIXEL_SCALE * -5}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
        className="absolute"
      />
    </div>
  );
};
