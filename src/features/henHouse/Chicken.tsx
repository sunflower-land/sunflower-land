import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import { AnimalState } from "features/game/types/game";

const CHICKEN_STATES: Record<AnimalState, string> & { sleeping: string } = {
  idle: SUNNYSIDE.animals.hungryChicken,
  happy: SUNNYSIDE.animals.happyChicken,
  sad: SUNNYSIDE.animals.sadChicken,
  sleeping: SUNNYSIDE.animals.sleepingChicken,
};

const _chicken = (id: string) => (state: MachineState) =>
  state.context.state.henHouse.animals[id];

export const Chicken: React.FC<{ id: string }> = ({ id }) => {
  const { gameService } = useContext(Context);

  const chicken = useSelector(gameService, _chicken(id));

  const feedChicken = () => {
    gameService.send({
      type: "animal.fed",
      animal: "Chicken",
      food: "Kernel Blend",
      id: chicken.id,
    });
  };

  const getChickenStateImg = () => {
    if (chicken.asleepAt + 24 * 60 * 60 * 1000 > Date.now()) {
      return CHICKEN_STATES.sleeping;
    }

    return CHICKEN_STATES[chicken.state];
  };

  return (
    <div className="relative cursor-pointer" onClick={feedChicken}>
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
        src={getChickenStateImg()}
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
