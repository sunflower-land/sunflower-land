import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useInterpret, useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import {
  ANIMAL_EMOTION_ICONS,
  animalMachine,
  AnimalMachineInterpreter,
  TState as AnimalMachineState,
} from "features/game/lib/animalMachine";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
} from "features/game/lib/animals";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";

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

  if (chickenState === "initial") return null;

  const favFood = getAnimalFavoriteFood("Chicken", chicken.experience);
  const sleeping = chickenState === "sleeping";
  const level = getAnimalLevel(chicken.experience, "Chicken");

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
          sleeping
            ? SUNNYSIDE.animals.chickenAsleep
            : SUNNYSIDE.animals.chickenIdle
        }
        alt={`${capitalize(chickenState)} Chicken`}
        style={{
          width: `${PIXEL_SCALE * (sleeping ? 13 : 11)}px`,
        }}
        className={classNames(
          "absolute ml-[1px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          {
            "mt-[2px]": !sleeping,
            "mt-[4px]": sleeping,
          },
        )}
      />
      {/* Emotion */}
      {chickenState !== "idle" && (
        <img
          src={ANIMAL_EMOTION_ICONS[chickenState]}
          alt={`${capitalize(chickenState)} Chicken`}
          style={{
            width: `${PIXEL_SCALE * (sleeping ? 9 : 7)}px`,
            top: sleeping ? -8 : -7,
            right: sleeping ? -8 : -7,
          }}
          className="absolute"
        />
      )}
      {/* Request */}
      {chickenState === "idle" && (
        <RequestBubble
          top={PIXEL_SCALE * -5.5}
          left={PIXEL_SCALE * 9.5}
          image={{ src: ITEM_DETAILS[favFood].image, height: 16, width: 16 }}
        />
      )}
      <LevelProgress
        animal="Chicken"
        experience={chicken.experience}
        className="bottom-2 left-1"
      />
    </div>
  );
};
