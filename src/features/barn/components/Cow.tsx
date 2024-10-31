import React, { useContext, useEffect, useState } from "react";
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
  getBoostedFoodQuantity,
  isAnimalFood,
} from "features/game/lib/animals";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";
import { ProduceDrops } from "features/game/expansion/components/animals/ProduceDrops";
import {
  AnimalFoodName,
  AnimalMedicineName,
  InventoryItemName,
  LoveAnimalItem,
} from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { QuickSelect } from "features/greenhouse/QuickSelect";
import { Transition } from "@headlessui/react";
import {
  ANIMAL_FOOD_EXPERIENCE,
  ANIMAL_FOODS,
} from "features/game/types/animals";
import { useTranslation } from "react-i18next";
import { useSound } from "lib/utils/hooks/useSound";
import { WakesIn } from "features/game/expansion/components/animals/WakesIn";
import Decimal from "decimal.js-light";
import { InfoPopover } from "features/island/common/InfoPopover";
import { REQUIRED_FOOD_QTY } from "features/game/events/landExpansion/feedAnimal";
import { formatNumber } from "lib/utils/formatNumber";

export const ANIMAL_EMOTION_ICONS: Record<
  Exclude<TState["value"], "idle" | "needsLove" | "initial" | "sick">,
  {
    icon: string;
    width: number;
    top: number;
    right: number;
  }
> = {
  ready: {
    icon: SUNNYSIDE.icons.expression_ready,
    width: PIXEL_SCALE * 9,
    top: PIXEL_SCALE * 2,
    right: PIXEL_SCALE * -1,
  },
  loved: {
    icon: SUNNYSIDE.icons.heart,
    width: PIXEL_SCALE * 10,
    top: PIXEL_SCALE * 2.6,
    right: PIXEL_SCALE * 0.3,
  },
  sleeping: {
    icon: SUNNYSIDE.icons.sleeping,
    width: PIXEL_SCALE * 9,
    top: PIXEL_SCALE * 4.5,
    right: PIXEL_SCALE * 1.1,
  },
  happy: {
    icon: SUNNYSIDE.icons.happy,
    width: PIXEL_SCALE * 7,
    top: PIXEL_SCALE * 4.5,
    right: PIXEL_SCALE * 1.1,
  },
  sad: {
    icon: SUNNYSIDE.icons.sad,
    width: PIXEL_SCALE * 7,
    top: PIXEL_SCALE * 4.5,
    right: PIXEL_SCALE * 1.1,
  },
};

const _animalState = (state: AnimalMachineState) =>
  // Casting here because we know the value is always a string rather than an object
  // This helps to be able to use the string as a key in the CHICKEN_STATES object
  state.value as AnimalMachineState["value"];

const _cow = (id: string) => (state: MachineState) =>
  state.context.state.barn.animals[id];
const _inventory = (state: MachineState) => state.context.state.inventory;
const _inventoryCount = (item: InventoryItemName) => (state: MachineState) =>
  state.context.state.inventory[item] ?? new Decimal(0);
const _game = (state: MachineState) => state.context.state;

export const Cow: React.FC<{ id: string; disabled: boolean }> = ({
  id,
  disabled,
}) => {
  const { gameService, selectedItem } = useContext(Context);

  const cow = useSelector(gameService, _cow(id));
  const inventoryCount = useSelector(
    gameService,
    _inventoryCount(selectedItem as AnimalFoodName),
  );
  const game = useSelector(gameService, _game);
  const cowService = useInterpret(animalMachine, {
    context: {
      animal: cow,
    },
  }) as unknown as AnimalMachineInterpreter;

  const cowMachineState = useSelector(cowService, _animalState);
  const inventory = useSelector(gameService, _inventory);
  const [showFeedXP, setShowFeedXP] = useState(false);

  useEffect(() => {
    if (cow.state === "sick" && cowMachineState !== "sick") {
      cowService.send({
        type: "SICK",
        animal: cow,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cow.state]);

  const { t } = useTranslation();

  const [showDrops, setShowDrops] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [showAffectionQuickSelect, setShowAffectionQuickSelect] =
    useState(false);
  const [showWakesIn, setShowWakesIn] = useState(false);
  const [showNotEnoughFood, setShowNotEnoughFood] = useState(false);
  const [showNoMedicine, setShowNoMedicine] = useState(false);
  // Sounds
  const { play: playFeedAnimal } = useSound("feed_animal", true);
  const { play: playCowCollect } = useSound("cow_collect", true);
  const { play: playProduceDrop } = useSound("produce_drop");
  const { play: playLevelUp } = useSound("level_up");
  const { play: playCureAnimal } = useSound("cure_animal");

  const favFood = getAnimalFavoriteFood("Cow", cow.experience);
  const sleeping = cowMachineState === "sleeping";
  const needsLove = cowMachineState === "needsLove";
  const ready = cowMachineState === "ready";
  const idle = cowMachineState === "idle";
  const sick = cowMachineState === "sick";
  const loved = cowMachineState === "loved";

  const requiredFoodQty = getBoostedFoodQuantity({
    animalType: "Cow",
    foodQuantity: REQUIRED_FOOD_QTY.Cow,
    game,
  });

  const feedCow = (item?: InventoryItemName) => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Cow",
      item: item ? (item as AnimalFoodName) : undefined,
      id: cow.id,
    });

    setShowFeedXP(true);
    setTimeout(() => setShowFeedXP(false), 700);

    const updatedCow = updatedState.context.state.barn.animals[id];

    cowService.send({
      type: "FEED",
      animal: updatedCow,
    });

    playFeedAnimal();
  };

  const onLoveClick = () => {
    if (selectedItem !== cow.item || inventoryCount.lt(1)) {
      setShowAffectionQuickSelect(true);
      return;
    }

    loveCow(selectedItem);
  };

  const loveCow = (item = selectedItem) => {
    const updatedState = gameService.send({
      type: "animal.loved",
      animal: "Cow",
      id: cow.id,
      item: item as LoveAnimalItem,
    });

    const updatedCow = updatedState.context.state.barn.animals[id];

    cowService.send({
      type: "LOVE",
      animal: updatedCow,
    });

    playFeedAnimal();
  };

  const claimProduce = () => {
    const updatedState = gameService.send({
      type: "produce.claimed",
      animal: "Cow",
      id: cow.id,
    });

    const updatedCow = updatedState.context.state.barn.animals[id];

    cowService.send({
      type: "CLAIM_PRODUCE",
      animal: updatedCow,
    });
  };

  const cureCow = (item?: InventoryItemName) => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Cow",
      item: item ? (item as AnimalMedicineName) : undefined,
      id: cow.id,
    });

    const updatedCow = updatedState.context.state.barn.animals[id];

    cowService.send({
      type: "CURE",
      animal: updatedCow,
    });
  };

  const onSickClick = async () => {
    const hasMedicineSelected = selectedItem === "Barn Delight";
    const medicineCount = inventory["Barn Delight"] ?? new Decimal(0);
    const hasEnoughMedicine = medicineCount.gte(1);

    if (hasMedicineSelected && hasEnoughMedicine) {
      playCureAnimal();
      cureCow("Barn Delight");
      setShowQuickSelect(false);
    } else if (!hasMedicineSelected && hasEnoughMedicine) {
      setShowQuickSelect(true);
    } else {
      setShowNoMedicine(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowNoMedicine(false);
    }
    return;
  };

  const onReadyClick = async () => {
    setShowDrops(true);
    playProduceDrop();
    await new Promise((resolve) => setTimeout(resolve, 500));
    playCowCollect();

    await new Promise((resolve) => setTimeout(resolve, 900));

    playLevelUp();
    claimProduce();
    setShowDrops(false);

    return;
  };

  const handleClick = async () => {
    if (disabled) return;
    if (loved) return;

    if (needsLove) return onLoveClick();

    if (sick) return onSickClick();

    if (sleeping) {
      setShowWakesIn((prev) => !prev);
      return;
    }

    if (ready) {
      // Already animating
      if (showDrops) return;
      return onReadyClick();
    }

    const hasFoodSelected = selectedItem && isAnimalFood(selectedItem);

    if (hasFoodSelected) {
      const foodCount =
        inventory[selectedItem as AnimalFoodName] ?? new Decimal(0);
      // 5 is the amount of food needed to feed the cow
      if (foodCount.lt(requiredFoodQty)) {
        setShowNotEnoughFood(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowNotEnoughFood(false);
        return;
      }

      feedCow(selectedItem);
      setShowQuickSelect(false);

      return;
    }

    setShowQuickSelect(true);
  };

  const handleQuickSelect = async (item: InventoryItemName) => {
    if (sick) {
      setShowQuickSelect(false);
      // wait for quick select to close
      await new Promise((resolve) => setTimeout(resolve, 300));
      playCureAnimal();
      cureCow(item);

      return;
    }

    const foodCount = inventory[item as AnimalFoodName] ?? new Decimal(0);

    if (foodCount.lt(requiredFoodQty)) {
      setShowQuickSelect(false);
      setShowNotEnoughFood(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowNotEnoughFood(false);
      return;
    }

    feedCow(item);
    setShowQuickSelect(false);
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

    if (sick) {
      return {
        image: SUNNYSIDE.animals.cowSick,
        width: PIXEL_SCALE * 11,
      };
    }

    return {
      image: SUNNYSIDE.animals.cowIdle,
      width: PIXEL_SCALE * 11,
    };
  };

  if (cowMachineState === "initial") return null;

  const level = getAnimalLevel(cow.experience, "Cow");

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
            multiplier={cow.multiplier ?? 0}
            level={level}
            animalType="Cow"
            className="bottom-0 left-4 top-4"
          />
        )}
        <img
          src={animalImageInfo().image}
          alt={`${capitalize(cowMachineState)} Cow`}
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
            src={ANIMAL_EMOTION_ICONS[cowMachineState].icon}
            alt={`${capitalize(cowMachineState)} Cow`}
            style={{
              width: `${ANIMAL_EMOTION_ICONS[cowMachineState].width}px`,
              top: ANIMAL_EMOTION_ICONS[cowMachineState].top,
              right: ANIMAL_EMOTION_ICONS[cowMachineState].right,
            }}
            className="absolute"
          />
        )}
        {/* Request */}
        {idle && (
          <RequestBubble
            key={id}
            top={PIXEL_SCALE * 1}
            left={PIXEL_SCALE * 23}
            request={favFood}
            quantity={requiredFoodQty}
          />
        )}
        {sick && (
          <RequestBubble
            top={PIXEL_SCALE * 2}
            left={PIXEL_SCALE * 23}
            request="Barn Delight"
          />
        )}
        {needsLove && (
          <RequestBubble
            top={PIXEL_SCALE * 1}
            left={PIXEL_SCALE * 23}
            request={cow.item}
          />
        )}
        {(sleeping || needsLove) && showWakesIn && (
          <WakesIn awakeAt={cow.awakeAt} className="-top-10" />
        )}
        {/* Not enough food */}
        {showNotEnoughFood && (
          <InfoPopover
            showPopover
            className="-top-12 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center">
              <p className="text-xs p-0.5 py-1 font-secondary">
                {t("animal.notEnoughFood")}
              </p>
            </div>
          </InfoPopover>
        )}
        {showNoMedicine && (
          <InfoPopover
            showPopover
            className="-top-12 left-1/2 transform -translate-x-1/2"
          >
            <p className="text-xs p-0.5 py-1 font-secondary">
              {t("animal.noMedicine")}
            </p>
          </InfoPopover>
        )}
      </div>
      {/* Level Progress */}
      <LevelProgress
        animal="Cow"
        animalState={cowMachineState}
        experience={cow.experience}
        className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 ml-1"
        // Don't block level up UI with wakes in panel if accidentally clicked
        onLevelUp={() => setShowWakesIn(false)}
      />
      {/* Feed XP */}
      <Transition
        appear={true}
        id="oil-reserve-collected-amount"
        show={showFeedXP}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 -translate-y-0"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex -top-1 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
      >
        <span
          className="text-sm yield-text"
          style={{
            color: favFood === selectedItem ? "#71e358" : "#fff",
          }}
        >{`+${formatNumber(ANIMAL_FOOD_EXPERIENCE.Cow[level][selectedItem as AnimalFoodName])}`}</span>
      </Transition>
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
          options={
            !sick
              ? getKeys(ANIMAL_FOODS)
                  .filter(
                    (food) =>
                      ANIMAL_FOODS[food].type === "food" &&
                      (inventory[food] ?? new Decimal(0)).gte(requiredFoodQty),
                  )
                  .map((food) => ({
                    name: food,
                    icon: food,
                    showSecondaryImage: false,
                  }))
              : [
                  {
                    name: "Barn Delight",
                    icon: "Barn Delight",
                    showSecondaryImage: false,
                  },
                ]
          }
          onClose={() => setShowQuickSelect(false)}
          onSelected={(item) => handleQuickSelect(item)}
          emptyMessage={t(sick ? "animal.noMedicine" : "animal.noFoodMessage")}
        />
      </Transition>
      <Transition
        appear={true}
        show={showAffectionQuickSelect}
        enter="transition-opacity  duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex top-[-20px] left-[50%] z-40 absolute"
      >
        <QuickSelect
          options={[
            {
              name: cow.item,
              icon: cow.item,
              showSecondaryImage: false,
            },
          ]}
          onClose={() => setShowAffectionQuickSelect(false)}
          onSelected={() => {
            setShowAffectionQuickSelect(false);
            loveCow(cow.item);
          }}
          emptyMessage={t("animal.toolRequired", {
            tool: cow.item,
          })}
        />
      </Transition>
    </div>
  );
};
