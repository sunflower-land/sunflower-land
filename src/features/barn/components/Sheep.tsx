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
} from "features/game/lib/animalMachine";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  isAnimalFood,
} from "features/game/lib/animals";
import classNames from "classnames";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";
import { ANIMAL_EMOTION_ICONS } from "./Cow";
import { AnimalFoodName } from "features/game/types/game";
import { QuickSelect } from "features/greenhouse/QuickSelect";
import { Transition } from "@headlessui/react";
import { getKeys } from "features/game/types/craftables";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ProduceDrops } from "features/game/expansion/components/animals/ProduceDrops";
import { useSound } from "lib/utils/hooks/useSound";
import { WakesIn } from "features/game/expansion/components/animals/WakesIn";
import { InfoPopover } from "features/island/common/InfoPopover";
import Decimal from "decimal.js-light";

const _animalState = (state: AnimalMachineState) =>
  // Casting here because we know the value is always a string rather than an object
  // This helps to be able to use the string as a key in the CHICKEN_STATES object
  state.value as AnimalMachineState["value"];

const _sheep = (id: string) => (state: MachineState) =>
  state.context.state.barn.animals[id];
const _foodInInventory = (food: AnimalFoodName) => (state: MachineState) =>
  state.context.state.inventory[food] ?? new Decimal(0);

export const Sheep: React.FC<{ id: string; disabled: boolean }> = ({
  id,
  disabled,
}) => {
  const { gameService, selectedItem } = useContext(Context);

  const sheep = useSelector(gameService, _sheep(id));

  const sheepService = useInterpret(animalMachine, {
    context: {
      animal: sheep,
    },
  }) as unknown as AnimalMachineInterpreter;

  const sheepState = useSelector(sheepService, _animalState);
  const foodInInventory = useSelector(
    gameService,
    _foodInInventory(selectedItem as AnimalFoodName),
  );

  const [showDrops, setShowDrops] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [showWakesIn, setShowWakesIn] = useState(false);
  const [showNotEnoughFood, setShowNotEnoughFood] = useState(false);

  // Sounds
  const { play: playFeedAnimal } = useSound("feed_animal", true);
  const { play: playSheepCollect } = useSound("sheep_collect", true);
  const { play: playProduceDrop } = useSound("produce_drop");
  const { play: playLevelUp } = useSound("level_up");

  const { t } = useAppTranslation();

  const favFood = getAnimalFavoriteFood("Sheep", sheep.experience);
  const sleeping = sheepState === "sleeping";
  const needsLove = sheepState === "needsLove";
  const ready = sheepState === "ready";
  const sick = sheepState === "sick";
  const idle = sheepState === "idle";

  const feedSheep = (item = selectedItem) => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Sheep",
      item: item as AnimalFoodName,
      id: sheep.id,
    });

    const updatedSheep = updatedState.context.state.barn.animals[id];

    sheepService.send({
      type: "FEED",
      animal: updatedSheep,
    });

    playFeedAnimal();
  };

  const loveSheep = () => {
    const updatedState = gameService.send({
      type: "animal.loved",
      animal: "Sheep",
      id: sheep.id,
      item: "Petting Hand",
    });

    const updatedSheep = updatedState.context.state.barn.animals[id];

    sheepService.send({
      type: "LOVE",
      animal: updatedSheep,
    });
  };

  const claimProduce = () => {
    const updatedState = gameService.send({
      type: "produce.claimed",
      animal: "Sheep",
      id: sheep.id,
    });

    const updatedSheep = updatedState.context.state.barn.animals[id];

    sheepService.send({
      type: "CLAIM_PRODUCE",
      animal: updatedSheep,
    });
  };

  const handleClick = async () => {
    if (disabled) return;

    if (needsLove) return loveSheep();

    if (sleeping) {
      setShowWakesIn((prev) => !prev);
      return;
    }

    if (ready) {
      // If we are already animating, don't trigger again
      if (showDrops) return;

      setShowDrops(true);
      playProduceDrop();
      await new Promise((resolve) => setTimeout(resolve, 900));
      playSheepCollect();
      await new Promise((resolve) => setTimeout(resolve, 500));
      playLevelUp();
      claimProduce();
      setShowDrops(false);

      return;
    }

    if (selectedItem && isAnimalFood(selectedItem)) {
      // Minimum amount of food to feed the sheep
      if (foodInInventory.lt(3)) {
        setShowNotEnoughFood(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowNotEnoughFood(false);
        return;
      }

      feedSheep(selectedItem);
      setShowQuickSelect(false);

      return;
    }

    setShowQuickSelect(true);
  };

  const animalImageInfo = () => {
    if (ready) {
      return {
        image: SUNNYSIDE.animals.sheepReady,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sleeping) {
      return {
        image: SUNNYSIDE.animals.sheepSleeping,
        width: PIXEL_SCALE * 13,
      };
    }

    return {
      image: SUNNYSIDE.animals.sheepIdle,
      width: PIXEL_SCALE * 11,
    };
  };

  if (sheepState === "initial") return null;

  const level = getAnimalLevel(sheep.experience, "Sheep");

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        height: `${GRID_WIDTH_PX * 2}px`,
      }}
      onMouseLeave={() => showWakesIn && setShowWakesIn(false)}
      onTouchEnd={() => showWakesIn && setShowWakesIn(false)}
    >
      <div className="relative w-full h-full">
        {showDrops && (
          <ProduceDrops
            currentLevel={level}
            animalType="Sheep"
            className="bottom-0 left-5 top-4"
          />
        )}
        <img
          // NOTE: Update to cow sleeping when available
          src={animalImageInfo().image}
          alt={`${capitalize(sheepState)} Sheep`}
          style={{
            width: `${PIXEL_SCALE * animalImageInfo().width}px`,
          }}
          onClick={handleClick}
          className={classNames(
            "absolute ml-[1px] mt-[2px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          )}
        />
        {/* Emotion */}
        {!idle && !needsLove && !sick && (
          <img
            src={ANIMAL_EMOTION_ICONS[sheepState].icon}
            alt={`${capitalize(sheepState)} Sheep`}
            style={{
              width: `${ANIMAL_EMOTION_ICONS[sheepState].width}px`,
              top: ANIMAL_EMOTION_ICONS[sheepState].top,
              right: ANIMAL_EMOTION_ICONS[sheepState].right,
            }}
            className="absolute"
          />
        )}
        {/* Request */}
        {idle && (
          <RequestBubble
            top={PIXEL_SCALE * 2}
            left={PIXEL_SCALE * 23}
            request={favFood}
            quantity={3}
          />
        )}
        {sick && (
          <RequestBubble
            top={PIXEL_SCALE * 3}
            left={PIXEL_SCALE * 23}
            request={favFood}
            quantity={3}
          />
        )}
        {needsLove && (
          <RequestBubble
            top={PIXEL_SCALE * 2}
            left={PIXEL_SCALE * 23}
            request={sheep.item}
          />
        )}
        {/* Level Progress */}
        <LevelProgress
          animal="Sheep"
          animalState={sheepState}
          experience={sheep.experience}
          className="bottom-3 left-1/2 transform -translate-x-1/2"
          // Don't block level up UI with wakes in panel if accidentally clicked
          onLevelUp={() => setShowWakesIn(false)}
        />
        {sleeping && showWakesIn && (
          <WakesIn asleepAt={sheep.asleepAt} className="-top-10" />
        )}
        {/* Not enough food */}
        {showNotEnoughFood && (
          <InfoPopover showPopover className="-top-5">
            <p className="text-xxs text-center">
              {t(
                foodInInventory.lt(1)
                  ? "animal.noFoodMessage"
                  : "animal.notEnoughFood",
              )}
            </p>
          </InfoPopover>
        )}
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
            feedSheep(food);
            setShowQuickSelect(false);
          }}
          emptyMessage={t("animal.noFoodMessage")}
        />
      </Transition>
    </div>
  );
};
