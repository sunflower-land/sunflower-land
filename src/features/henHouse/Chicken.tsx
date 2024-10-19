import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
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
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  isAnimalFood,
} from "features/game/lib/animals";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { Transition } from "@headlessui/react";
import { QuickSelect } from "features/greenhouse/QuickSelect";
import { getKeys } from "features/game/types/decorations";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { AnimalFoodName } from "features/game/types/game";
import { ProduceDrops } from "features/game/expansion/components/animals/ProduceDrops";
import { useSound } from "lib/utils/hooks/useSound";

export const CHICKEN_EMOTION_ICONS: Record<
  Exclude<TState["value"], "idle" | "needsLove" | "initial">,
  {
    icon: string;
    width: number;
    top: number;
    right: number;
  }
> = {
  ready: {
    icon: SUNNYSIDE.icons.expression_ready,
    width: PIXEL_SCALE * 8,
    top: PIXEL_SCALE * -3.3,
    right: PIXEL_SCALE * 3.7,
  },
  happy: {
    icon: SUNNYSIDE.icons.happy,
    width: PIXEL_SCALE * 7,
    top: PIXEL_SCALE * -1.3,
    right: PIXEL_SCALE * 3.7,
  },
  sad: {
    icon: SUNNYSIDE.icons.sad,
    width: PIXEL_SCALE * 7,
    top: PIXEL_SCALE * -1.3,
    right: PIXEL_SCALE * 3.7,
  },
  loved: {
    icon: SUNNYSIDE.icons.heart,
    width: PIXEL_SCALE * 10,
    top: PIXEL_SCALE * -3.3,
    right: PIXEL_SCALE * 3.7,
  },
  sleeping: {
    icon: SUNNYSIDE.icons.sleeping,
    width: PIXEL_SCALE * 9,
    top: PIXEL_SCALE * -3.5,
    right: PIXEL_SCALE * 2,
  },
};

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
  const [showDrops, setShowDrops] = useState(false);

  const favFood = getAnimalFavoriteFood("Chicken", chicken.experience);
  const sleeping = chickenState === "sleeping";
  const needsLove = chickenState === "needsLove";
  const ready = chickenState === "ready";
  const idle = chickenState === "idle";

  // Sounds
  const { play: playFeedAnimal } = useSound("feed_animal");
  const { play: playChickenCollect } = useSound("chicken_collect");
  const { play: playProduceDrop } = useSound("produce_drop");
  const { play: playLevelUp } = useSound("level_up");

  const feedChicken = (item = selectedItem) => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Chicken",
      food: item as AnimalFoodName,
      id: chicken.id,
    });

    const updatedChicken = updatedState.context.state.henHouse.animals[id];

    chickenService.send({
      type: "FEED",
      animal: updatedChicken,
    });

    playFeedAnimal();
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

  const claimProduce = async () => {
    const updatedState = gameService.send({
      type: "produce.claimed",
      animal: "Chicken",
      id: chicken.id,
    });

    const updatedChicken = updatedState.context.state.henHouse.animals[id];

    chickenService.send({
      type: "CLAIM_PRODUCE",
      animal: updatedChicken,
    });
  };

  const handleClick = async () => {
    if (disabled) return;

    if (needsLove) return loveChicken();

    if (sleeping) return;

    if (ready) {
      setShowDrops(true);
      playProduceDrop();
      await new Promise((resolve) => setTimeout(resolve, 500));
      playChickenCollect();

      await new Promise((resolve) => setTimeout(resolve, 900));

      playLevelUp();
      claimProduce();
      setShowDrops(false);

      return;
    }

    if (selectedItem && isAnimalFood(selectedItem)) {
      feedChicken(selectedItem);
      setShowQuickSelect(false);

      return;
    }

    setShowQuickSelect(true);
  };

  const animalImageInfo = () => {
    if (ready) {
      return {
        image: SUNNYSIDE.animals.chickenReady,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sleeping) {
      return {
        image: SUNNYSIDE.animals.chickenAsleep,
        width: PIXEL_SCALE * 13,
      };
    }

    return {
      image: SUNNYSIDE.animals.chickenIdle,
      width: PIXEL_SCALE * 11,
    };
  };

  if (chickenState === "initial") return null;

  const level = getAnimalLevel(chicken.experience, "Chicken");

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
          {showDrops && (
            <ProduceDrops
              currentLevel={level}
              animalType="Chicken"
              className="bottom-0 left-1/2 -translate-x-1/2"
            />
          )}

          <img
            src={SUNNYSIDE.animals.chickenShadow}
            className="bottom-0 absolute left-1/2 transform -translate-x-1/2"
            style={{
              width: `${PIXEL_SCALE * 13}px`,
            }}
          />
          <img
            src={animalImageInfo().image}
            alt={`${capitalize(chickenState)} Chicken`}
            style={{
              width: `${animalImageInfo().width}px`,
            }}
            className={classNames(
              "absolute ml-[1px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
              {
                "mt-[2px]": !sleeping && !ready,
                "mt-[3px]": sleeping || ready,
              },
            )}
          />
          {/* Emotion */}
          {!idle && !needsLove && (
            <img
              src={CHICKEN_EMOTION_ICONS[chickenState].icon}
              alt={`${capitalize(chickenState)} Chicken`}
              style={{
                width: `${CHICKEN_EMOTION_ICONS[chickenState].width}px`,
                top: CHICKEN_EMOTION_ICONS[chickenState].top,
                right: CHICKEN_EMOTION_ICONS[chickenState].right,
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
            animalState={chickenState}
            experience={chicken.experience}
            className="bottom-1 left-1/2 transform -translate-x-1/2 -ml-0.5"
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
          emptyMessage={t("animal.noFoodMessage")}
        />
      </Transition>
    </>
  );
};
