import React, { useContext } from "react";
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
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { ITEM_DETAILS } from "features/game/types/images";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";

const _animalState = (state: AnimalMachineState) =>
  // Casting here because we know the value is always a string rather than an object
  // This helps to be able to use the string as a key in the CHICKEN_STATES object
  state.value as AnimalMachineState["value"];

const _cow = (id: string) => (state: MachineState) =>
  state.context.state.barn.animals[id];

export const Cow: React.FC<{ id: string }> = ({ id }) => {
  const { gameService } = useContext(Context);

  const cow = useSelector(gameService, _cow(id));

  const cowService = useInterpret(animalMachine, {
    context: {
      animal: cow,
    },
    devTools: true,
  }) as unknown as AnimalMachineInterpreter;

  const cowState = useSelector(cowService, _animalState);

  const feedCow = () => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Cow",
      food: "Hay",
      id: cow.id,
    });

    const updatedCow = updatedState.context.state.barn.animals[id];

    cowService.send({
      type: "FEED",
      animal: updatedCow,
    });
  };

  if (cowState === "initial") return null;

  const favFood = getAnimalFavoriteFood("Cow", cow.experience);
  const sleeping = cowState === "sleeping";

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
        src={sleeping ? SUNNYSIDE.animals.cow : SUNNYSIDE.animals.cow}
        alt={`${capitalize(cowState)} Cow`}
        style={{
          width: `${PIXEL_SCALE * (sleeping ? 25 : 25)}px`,
        }}
        onClick={feedCow}
        className={classNames(
          "absolute ml-[1px] mt-[2px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        )}
      />
      {/* Emotion */}
      {cowState !== "idle" && (
        <img
          src={ANIMAL_EMOTION_ICONS[cowState]}
          alt={`${capitalize(cowState)} Cow`}
          style={{
            width: `${PIXEL_SCALE * (sleeping ? 9 : 7)}px`,
            top: sleeping ? 9 : 7,
            right: sleeping ? -2 : 1,
          }}
          className="absolute"
        />
      )}
      {/* Request */}
      {cowState === "idle" && (
        <RequestBubble
          top={PIXEL_SCALE * 0}
          left={PIXEL_SCALE * 24}
          image={{ src: ITEM_DETAILS[favFood].image, height: 16, width: 16 }}
        />
      )}
      {/* Level Progress */}
      <LevelProgress
        animal="Cow"
        experience={cow.experience}
        className="bottom-3 left-1/2 transform -translate-x-1/2 ml-1"
      />
    </div>
  );
};
