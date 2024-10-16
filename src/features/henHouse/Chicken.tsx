import React, { useContext, useState } from "react";
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
import { getAnimalFavoriteFood, isAnimalFood } from "features/game/lib/animals";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { Transition } from "@headlessui/react";
import { QuickSelect } from "features/greenhouse/QuickSelect";
import { getKeys } from "features/game/types/decorations";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _animalState = (state: AnimalMachineState) =>
  // Casting here because we know the value is always a string rather than an object
  // This helps to be able to use the string as a key in the CHICKEN_STATES object
  state.value as AnimalMachineState["value"];

const _chicken = (id: string) => (state: MachineState) =>
  state.context.state.henHouse.animals[id];

export const Chicken: React.FC<{ id: string; disabled: boolean }> = ({
  id,
  disabled,
}) => {
  const { gameService, selectedItem } = useContext(Context);
  const { t } = useAppTranslation();
  const chicken = useSelector(gameService, _chicken(id));

  const chickenService = useInterpret(animalMachine, {
    context: {
      animal: chicken,
    },
  }) as unknown as AnimalMachineInterpreter;

  const chickenState = useSelector(chickenService, _animalState);

  const [showQuickSelect, setShowQuickSelect] = useState(false);

  const feedChicken = (item = selectedItem) => {
    if (disabled) return;

    if (item && isAnimalFood(item)) {
      const updatedState = gameService.send({
        type: "animal.fed",
        animal: "Chicken",
        food: item,
        id: chicken.id,
      });

      const updatedChicken = updatedState.context.state.henHouse.animals[id];

      chickenService.send({
        type: "FEED",
        animal: updatedChicken,
      });
    }
  };

  const loveChicken = () => {
    if (disabled) return;

    const updatedState = gameService.send({
      type: "animal.loved",
      animal: "Chicken",
      id: chicken.id,
      item: "Petting Hand",
    });

    const updatedChicken = updatedState.context.state.henHouse.animals[id];

    chickenService.send({
      type: "LOVE",
      animal: updatedChicken,
    });
  };

  const handleClick = () => {
    if (needsLove) {
      loveChicken();
      return;
    }

    if (chickenState === "sleeping") return;

    if (selectedItem && isAnimalFood(selectedItem)) {
      feedChicken(selectedItem);
      setShowQuickSelect(false);
    } else {
      setShowQuickSelect(true);
    }
  };

  if (chickenState === "initial") return null;

  const favFood = getAnimalFavoriteFood("Chicken", chicken.experience);
  const sleeping = chickenState === "sleeping";
  const needsLove = chickenState === "needsLove";

  return (
    <div
      className={classNames(
        "relative cursor-pointer w-full h-full flex items-center justify-center",
        {
          "cursor-not-allowed": !needsLove && sleeping,
        },
      )}
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        height: `${GRID_WIDTH_PX * 2}px`,
      }}
      onClick={handleClick}
    >
      {/* Quick Select */}
      <Transition
        appear={true}
        show={showQuickSelect}
        enter="transition-opacity  duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex top-[-35px] left-[50%] absolute z-40 shadow-md"
      >
        <QuickSelect
          options={getKeys(ANIMAL_FOODS).map((food) => ({
            name: food,
            icon: food,
            showSecondaryImage: false,
          }))}
          onClose={() => setShowQuickSelect(false)}
          onSelected={(food) => {
            feedChicken(food);
            setShowQuickSelect(false);
          }}
          type={t("quickSelect.greenhouseSeeds")}
        />
      </Transition>
      <div
        className="relative w-full h-full"
        style={{
          height: `${PIXEL_SCALE * 19}px`,
        }}
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
              "mt-[3px]": sleeping,
            },
          )}
        />
        {/* Emotion */}
        {chickenState !== "idle" && !needsLove && (
          <img
            src={ANIMAL_EMOTION_ICONS[chickenState]}
            alt={`${capitalize(chickenState)} Chicken`}
            style={{
              width: `${PIXEL_SCALE * (sleeping ? 9 : 7)}px`,
              top: sleeping ? -8 : -4,
              right: sleeping ? 0 : 8,
            }}
            className="absolute"
          />
        )}
        {/* Request */}
        {chickenState === "idle" && (
          <RequestBubble
            top={PIXEL_SCALE * -5.5}
            left={PIXEL_SCALE * 18}
            image={{ src: ITEM_DETAILS[favFood].image, height: 16, width: 16 }}
          />
        )}
        {needsLove && (
          <RequestBubble
            top={PIXEL_SCALE * -5.5}
            left={PIXEL_SCALE * 9.5}
            image={{
              src: ITEM_DETAILS[chicken.item].image,
              height: 16,
              width: 16,
            }}
          />
        )}
        {/* Level Progress */}
        <LevelProgress
          animal="Chicken"
          experience={chicken.experience}
          className="bottom-1 left-1/2 transform -translate-x-1/2"
        />
      </div>
    </div>
  );
};
