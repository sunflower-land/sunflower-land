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
import { getAnimalFavoriteFood } from "features/game/lib/animals";
import { ITEM_DETAILS } from "features/game/types/images";
import { CSS } from "react-spring";
import classNames from "classnames";

type RequestBubbleProps = {
  top: CSS.Properties["top"];
  left: CSS.Properties["left"];
  image: {
    src: string;
    height: number;
    width: number;
  };
};

const RequestBubble: React.FC<RequestBubbleProps> = ({ image, top, left }) => {
  return (
    <div
      className="absolute flex justify-center items-center"
      style={{
        top,
        left,

        borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
        borderStyle: "solid",
        borderTopWidth: `${PIXEL_SCALE * 2}px`,
        borderRightWidth: `${PIXEL_SCALE * 2}px`,
        borderBottomWidth: `${PIXEL_SCALE * 4}px`,
        borderLeftWidth: `${PIXEL_SCALE * 5}px`,

        borderImageSlice: "2 2 4 5 fill",
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
        minWidth: "30px",
        minHeight: "30px",
      }}
    >
      <div
        className="absolute"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          marginLeft: "-3px",
          height: `${image.height}px`,
          width: `${image.width}px`,
        }}
      >
        <img src={image.src} className="w-full h-full" />
      </div>
    </div>
  );
};

const ANIMAL_EMOTION_ICONS: Record<
  Exclude<AnimalMachineState["value"], "idle" | "initial">,
  string
> = {
  happy: SUNNYSIDE.icons.happy,
  sad: SUNNYSIDE.icons.sad,
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

  if (chickenState === "initial") return null;

  const favFood = getAnimalFavoriteFood("Chicken", chicken.experience);
  const sleeping = chickenState === "sleeping";

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
          top={`${PIXEL_SCALE * -5.5}px`}
          left={`${PIXEL_SCALE * 9.5}px`}
          image={{ src: ITEM_DETAILS[favFood].image, height: 16, width: 16 }}
        />
      )}
    </div>
  );
};
