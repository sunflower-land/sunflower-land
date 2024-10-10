import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useInterpret, useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import {
  animalMachine,
  AnimalMachineInterpreter,
  TState as AnimalMachineState,
} from "features/game/lib/animalMachine";

const ANIMAL_EMOTION_ICONS: Record<AnimalMachineState["value"], string> = {
  happy: SUNNYSIDE.icons.happy,
  sad: SUNNYSIDE.icons.sad,
  idle: SUNNYSIDE.icons.expression_stress,
  sleeping: SUNNYSIDE.icons.sleeping,
};

const _animalState = (state: AnimalMachineState) =>
  // Casting here because we know the value is always a string rather than an object
  // This helps to be able to use the string as a key in the CHICKEN_STATES object
  state.value as AnimalMachineState["value"];

const _chicken = (id: string) => (state: MachineState) =>
  state.context.state.henHouse.animals[id];

export const Chicken: React.FC<{ id: string }> = ({ id }) => {
  const { gameService } = useContext(Context);

  const chicken = useSelector(gameService, _chicken(id));

  const chickenService = useInterpret(animalMachine, {
    context: {
      animal: chicken,
    },
  }) as unknown as AnimalMachineInterpreter;

  const chickenState = useSelector(chickenService, _animalState);

  const feedChicken = () => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Chicken",
      food: "Kernel Blend",
      id: chicken.id,
    });

    const updatedChicken = updatedState.context.state.henHouse.animals[id];

    chickenService.send({
      type: "FEED",
      animal: updatedChicken,
    });
  };

  return (
    <div
      className="relative cursor-pointer w-full h-full"
      style={{
        height: `${PIXEL_SCALE * 19}px`,
      }}
      onClick={feedChicken}
    >
      <img
        src={SUNNYSIDE.animals.chickenShadow}
        className="bottom-0 absolute left-1/2 transform -translate-x-1/2"
        style={{
          width: `${PIXEL_SCALE * 13}px`,
        }}
      />
      <img
        src={
          chickenState === "sleeping"
            ? SUNNYSIDE.animals.chickenAsleep
            : SUNNYSIDE.animals.chickenIdle
        }
        alt={`${capitalize(chickenState)} Chicken`}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
        }}
        className="absolute ml-[1px] mt-[2px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <img
        src={ANIMAL_EMOTION_ICONS[chickenState]}
        alt={`${capitalize(chickenState)} Chicken`}
        style={{
          width: `${PIXEL_SCALE * (chickenState === "sleeping" ? 9 : 7)}px`,
          top: -7,
          right: -7,
        }}
        className="absolute"
      />
    </div>
  );
};
