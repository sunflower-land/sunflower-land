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
import Decimal from "decimal.js-light";

const _animalState = (state: AnimalMachineState) =>
  // Casting here because we know the value is always a string rather than an object
  // This helps to be able to use the string as a key in the CHICKEN_STATES object
  state.value as AnimalMachineState["value"];

const _chicken = (id: string) => (state: MachineState) =>
  state.context.state.henHouse.animals[id];
const _inventory = (state: MachineState) => state.context.state.inventory;

export const Chicken: React.FC<{ id: string; disabled: boolean }> = ({
  id,
  disabled,
}) => {
  const { gameService, selectedItem } = useContext(Context);
  const { t } = useAppTranslation();
  const chicken = useSelector(gameService, _chicken(id));
  const inventory = useSelector(gameService, _inventory);

  const chickenService = useInterpret(animalMachine, {
    context: {
      animal: chicken,
    },
  }) as unknown as AnimalMachineInterpreter;

  const chickenState = useSelector(chickenService, _animalState);

  const [showQuickSelect, setShowQuickSelect] = useState(false);

  const favFood = getAnimalFavoriteFood("Chicken", chicken.experience);
  const sleeping = chickenState === "sleeping";
  const needsLove = chickenState === "needsLove";
  const inventoryCount = selectedItem
    ? inventory[selectedItem] ?? new Decimal(0)
    : new Decimal(0);

  const feedChicken = (item = selectedItem) => {
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

  const levelUpChicken = () => {
    const updatedState = gameService.send({
      type: "animal.leveledUp",
      animal: "Chicken",
      id: chicken.id,
    });

    const updatedChicken = updatedState.context.state.henHouse.animals[id];

    chickenService.send({
      type: "LEVEL_UP",
      animal: updatedChicken,
    });
  };

  const handleClick = () => {
    if (disabled) return;

    if (needsLove) return loveChicken();

    if (chickenState === "sleeping") return;

    if (chickenState === "leveledUp") return levelUpChicken();

    if (selectedItem && isAnimalFood(selectedItem)) {
      feedChicken(selectedItem);
      setShowQuickSelect(false);

      return;
    }

    setShowQuickSelect(true);
  };

  const animalImage = () => {
    if (chickenState === "leveledUp") {
      return SUNNYSIDE.animals.chickenReady;
    }

    if (chickenState === "sleeping") {
      return SUNNYSIDE.animals.chickenAsleep;
    }

    return SUNNYSIDE.animals.chickenIdle;
  };

  if (chickenState === "initial") return null;

  return (
    <>
      <div
        className="relative cursor-pointer w-full h-full flex items-center justify-center"
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
          height: `${GRID_WIDTH_PX * 2}px`,
          zIndex: 10,
        }}
        onClick={handleClick}
      >
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
            src={animalImage()}
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
              image={{
                src: ITEM_DETAILS[favFood].image,
                height: 16,
                width: 16,
              }}
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
        className="flex top-[-20px] left-[50%] z-40 absolute"
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
          emptyMessage={`No feed available`}
        />
      </Transition>
    </>
  );
};
