import React, { useContext } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useInterpret, useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import {
  animalMachine,
  AnimalMachineInterpreter,
  TState as AnimalMachineState,
  TState,
} from "features/game/lib/animalMachine";
import { getAnimalFavoriteFood } from "features/game/lib/animals";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { ITEM_DETAILS } from "features/game/types/images";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";

export const ANIMAL_EMOTION_ICONS: Record<
  Exclude<TState["value"], "idle" | "needsLove" | "initial">,
  {
    icon: string;
    width: number;
    top: number;
    right: number;
  }
> = {
  ready: {
    icon: SUNNYSIDE.icons.expression_confused,
    width: PIXEL_SCALE * 9,
    top: PIXEL_SCALE * -8,
    right: PIXEL_SCALE * 0,
  },
  loved: {
    icon: SUNNYSIDE.icons.heart,
    width: PIXEL_SCALE * 7,
    top: PIXEL_SCALE * -4,
    right: PIXEL_SCALE * 8,
  },
  sleeping: {
    icon: SUNNYSIDE.icons.sleeping,
    width: PIXEL_SCALE * 9,
    top: PIXEL_SCALE * -8,
    right: PIXEL_SCALE * 0,
  },
  happy: {
    icon: SUNNYSIDE.icons.happy,
    width: PIXEL_SCALE * 7,
    top: PIXEL_SCALE * -4,
    right: PIXEL_SCALE * 8,
  },
  sad: {
    icon: SUNNYSIDE.icons.sad,
    width: PIXEL_SCALE * 7,
    top: PIXEL_SCALE * -4,
    right: PIXEL_SCALE * 8,
  },
};

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
  }) as unknown as AnimalMachineInterpreter;

  const cowState = useSelector(cowService, _animalState);

  const favFood = getAnimalFavoriteFood("Cow", cow.experience);
  const sleeping = cowState === "sleeping";
  const needsLove = cowState === "needsLove";
  const ready = cowState === "ready";
  const idle = cowState === "idle";

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

  const loveCow = () => {
    const updatedState = gameService.send({
      type: "animal.loved",
      animal: "Cow",
      id: cow.id,
      item: "Petting Hand",
    });

    const updatedCow = updatedState.context.state.barn.animals[id];

    cowService.send({
      type: "LOVE",
      animal: updatedCow,
    });
  };

  const animalImageInfo = () => {
    if (ready) {
      return {
        image: SUNNYSIDE.animals.cowReady,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sleeping) {
      return {
        image: SUNNYSIDE.animals.cowSleeping,
        width: PIXEL_SCALE * 13,
      };
    }

    return {
      image: SUNNYSIDE.animals.cowIdle,
      width: PIXEL_SCALE * 11,
    };
  };

  if (cowState === "initial") return null;

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
        src={animalImageInfo().image}
        alt={`${capitalize(cowState)} Cow`}
        style={{
          width: `${PIXEL_SCALE * animalImageInfo().width}px`,
        }}
        onClick={needsLove ? loveCow : feedCow}
        className={classNames(
          "absolute ml-[1px] mt-[2px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        )}
      />
      {/* Emotion */}
      {cowState !== "idle" && !needsLove && (
        <img
          src={ANIMAL_EMOTION_ICONS[cowState].icon}
          alt={`${capitalize(cowState)} Cow`}
          style={{
            width: `${ANIMAL_EMOTION_ICONS[cowState].width}px`,
            top: ANIMAL_EMOTION_ICONS[cowState].top,
            right: ANIMAL_EMOTION_ICONS[cowState].right,
          }}
          className="absolute"
        />
      )}
      {/* Request */}
      {cowState === "idle" && (
        <RequestBubble
          top={PIXEL_SCALE * 1}
          left={PIXEL_SCALE * 25}
          image={{ src: ITEM_DETAILS[favFood].image, height: 16, width: 16 }}
        />
      )}
      {needsLove && (
        <RequestBubble
          top={PIXEL_SCALE * 0}
          left={PIXEL_SCALE * 25}
          image={{
            src: ITEM_DETAILS[cow.item].image,
            height: 16,
            width: 16,
          }}
        />
      )}
      {/* Level Progress */}
      <LevelProgress
        animal="Cow"
        animalState={cow.state}
        experience={cow.experience}
        className="bottom-3 left-1/2 transform -translate-x-1/2 ml-1"
      />
    </div>
  );
};
