import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
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
import { getAnimalFavoriteFood } from "features/game/lib/animals";
import classNames from "classnames";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { ITEM_DETAILS } from "features/game/types/images";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";

const _animalState = (state: AnimalMachineState) =>
  // Casting here because we know the value is always a string rather than an object
  // This helps to be able to use the string as a key in the CHICKEN_STATES object
  state.value as AnimalMachineState["value"];

const _sheep = (id: string) => (state: MachineState) =>
  state.context.state.barn.animals[id];

export const Sheep: React.FC<{ id: string }> = ({ id }) => {
  const { gameService } = useContext(Context);

  const sheep = useSelector(gameService, _sheep(id));

  const sheepService = useInterpret(animalMachine, {
    context: {
      animal: sheep,
    },
  }) as unknown as AnimalMachineInterpreter;

  const sheepState = useSelector(sheepService, _animalState);

  const feedSheep = () => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Sheep",
      food: "Kernel Blend",
      id: sheep.id,
    });

    const updatedSheep = updatedState.context.state.barn.animals[id];

    sheepService.send({
      type: "FEED",
      animal: updatedSheep,
    });
  };

  if (sheepState === "initial") return null;

  const favFood = getAnimalFavoriteFood("Sheep", sheep.experience);
  const sleeping = sheepState === "sleeping";

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        height: `${GRID_WIDTH_PX * 2}px`,
      }}
    >
      <img
        // NOTE: Update to cow sleeping when available
        src={sleeping ? SUNNYSIDE.animals.sheep : SUNNYSIDE.animals.sheep}
        alt={`${capitalize(sheepState)} Sheep`}
        style={{
          width: `${PIXEL_SCALE * (sleeping ? 25 : 25)}px`,
        }}
        onClick={feedSheep}
        className={classNames(
          "absolute ml-[1px] mt-[2px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        )}
      />
      {/* Emotion */}
      {sheepState !== "idle" && (
        <img
          src={ANIMAL_EMOTION_ICONS[sheepState]}
          alt={`${capitalize(sheepState)} Sheep`}
          style={{
            width: `${PIXEL_SCALE * (sleeping ? 9 : 7)}px`,
            top: sleeping ? 9 : 7,
            right: sleeping ? -2 : 1,
          }}
          className="absolute"
        />
      )}
      {/* Request */}
      {sheepState === "idle" && (
        <RequestBubble
          top={PIXEL_SCALE * 0}
          left={PIXEL_SCALE * 24}
          image={{ src: ITEM_DETAILS[favFood].image, height: 16, width: 16 }}
        />
      )}
      {/* Level Progress */}
      <LevelProgress
        animal="Sheep"
        experience={sheep.experience}
        className="bottom-3 left-1/2 transform -translate-x-1/2 ml-1"
      />
    </div>
  );
};
