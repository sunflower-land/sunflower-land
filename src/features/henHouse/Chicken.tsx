import React, { useContext, useEffect, useState } from "react";
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
  getBoostedFoodQuantity,
  isAnimalFood,
} from "features/game/lib/animals";
import classNames from "classnames";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { Transition } from "@headlessui/react";
import { ANIMAL_FOOD_EXPERIENCE } from "features/game/types/animals";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  AnimalFoodName,
  AnimalMedicineName,
  InventoryItemName,
  LoveAnimalItem,
} from "features/game/types/game";
import { ProduceDrops } from "features/game/expansion/components/animals/ProduceDrops";
import { useSound } from "lib/utils/hooks/useSound";
import { WakesIn } from "features/game/expansion/components/animals/WakesIn";
import { InfoPopover } from "features/island/common/InfoPopover";
import Decimal from "decimal.js-light";
import { REQUIRED_FOOD_QTY } from "features/game/events/landExpansion/feedAnimal";
import { formatNumber } from "lib/utils/formatNumber";
import { ITEM_XP } from "features/game/events/landExpansion/loveAnimal";

export const CHICKEN_EMOTION_ICONS: Record<
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
    width: PIXEL_SCALE * 8,
    top: PIXEL_SCALE * -2.3,
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
const _game = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const Chicken: React.FC<{ id: string; disabled: boolean }> = ({
  id,
  disabled,
}) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const { t } = useAppTranslation();
  const chicken = useSelector(gameService, _chicken(id));
  const game = useSelector(gameService, _game);
  const inventory = useSelector(gameService, _inventory);
  const chickenService = useInterpret(animalMachine, {
    context: { animal: chicken },
    devTools: true,
  }) as unknown as AnimalMachineInterpreter;

  const chickenMachineState = useSelector(chickenService, _animalState);

  useEffect(() => {
    if (chicken.state === "sick" && chickenMachineState !== "sick") {
      chickenService.send({
        type: "SICK",
        animal: chicken,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chicken.state]);

  const [showDrops, setShowDrops] = useState(false);
  const [showWakesIn, setShowWakesIn] = useState(false);
  const [showNotEnoughFood, setShowNotEnoughFood] = useState(false);
  const [showNoMedicine, setShowNoMedicine] = useState(false);
  const [showFeedXP, setShowFeedXP] = useState(false);
  const [showNoToolPopover, setShowNoToolPopover] = useState(false);
  const [showNoFoodSelected, setShowNoFoodSelected] = useState(false);
  const [showLoveXp, setShowLoveXp] = useState(false);

  const favFood = getAnimalFavoriteFood("Chicken", chicken.experience);
  const sleeping = chickenMachineState === "sleeping";
  const needsLove = chickenMachineState === "needsLove";
  const ready = chickenMachineState === "ready";
  const idle = chickenMachineState === "idle";
  const sick = chickenMachineState === "sick";

  // Sounds
  const { play: playFeedAnimal } = useSound("feed_animal");
  const { play: playChickenCollect } = useSound("chicken_collect");
  const { play: playProduceDrop } = useSound("produce_drop");
  const { play: playLevelUp } = useSound("level_up");
  const { play: playCureAnimal } = useSound("cure_animal");

  const requiredFoodQty = getBoostedFoodQuantity({
    animalType: "Chicken",
    foodQuantity: REQUIRED_FOOD_QTY.Chicken,
    game,
  });

  const feedChicken = (item?: InventoryItemName) => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Chicken",
      item: item ? (item as AnimalFoodName) : undefined,
      id: chicken.id,
    });

    setShowFeedXP(true);
    setTimeout(() => setShowFeedXP(false), 700);

    const updatedChicken = updatedState.context.state.henHouse.animals[id];

    chickenService.send({
      type: "FEED",
      animal: updatedChicken,
    });

    playFeedAnimal();
  };

  const onLoveClick = async () => {
    if ((inventory[chicken.item] ?? new Decimal(0)).lt(1)) {
      setShowNoToolPopover(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      setShowNoToolPopover(false);
      return;
    }

    shortcutItem(chicken.item);
    loveChicken(chicken.item);
  };

  const loveChicken = (item = selectedItem) => {
    const updatedState = gameService.send({
      type: "animal.loved",
      animal: "Chicken",
      id: chicken.id,
      item: item as LoveAnimalItem,
    });

    setShowLoveXp(true);
    setTimeout(() => setShowLoveXp(false), 700);

    const updatedChicken = updatedState.context.state.henHouse.animals[id];

    chickenService.send({
      type: "LOVE",
      animal: updatedChicken,
    });

    playFeedAnimal();
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

  const cureChicken = (item = selectedItem) => {
    const updatedState = gameService.send("animal.fed", {
      animal: "Chicken",
      item: item as AnimalMedicineName,
      id: chicken.id,
    });

    const updatedChicken = updatedState.context.state.henHouse.animals[id];

    chickenService.send({
      type: "CURE",
      animal: updatedChicken,
    });
  };

  const onSickClick = async () => {
    const medicineCount = inventory["Barn Delight"] ?? new Decimal(0);
    const hasEnoughMedicine = medicineCount.gte(1);

    if (hasEnoughMedicine) {
      shortcutItem("Barn Delight");
      playCureAnimal();
      cureChicken("Barn Delight");
      return;
    }

    setShowNoMedicine(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowNoMedicine(false);

    return;
  };

  const onReadyClick = async () => {
    setShowDrops(true);
    playProduceDrop();
    await new Promise((resolve) => setTimeout(resolve, 500));
    playChickenCollect();

    await new Promise((resolve) => setTimeout(resolve, 900));

    playLevelUp();
    claimProduce();
    setShowDrops(false);

    return;
  };

  const handleClick = async () => {
    if (disabled) return;

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
      if (foodCount.lt(requiredFoodQty)) {
        setShowNotEnoughFood(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowNotEnoughFood(false);
        return;
      }

      feedChicken(selectedItem);
      return;
    }

    setShowNoFoodSelected(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowNoFoodSelected(false);
  };

  const getInfoPopoverMessage = () => {
    if (showNoFoodSelected) return t("animal.noFoodMessage");
    if (showNoToolPopover)
      return t("animal.toolRequired", { tool: chicken.item });
    if (showNoMedicine) return t("animal.noMedicine");
  };

  const animalImageInfo = () => {
    if (ready) {
      return {
        image: SUNNYSIDE.animals.chickenReady,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sleeping || needsLove) {
      return {
        image: SUNNYSIDE.animals.chickenAsleep,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sick) {
      return {
        image: SUNNYSIDE.animals.chickenSick,
        width: PIXEL_SCALE * 11,
      };
    }

    return {
      image: SUNNYSIDE.animals.chickenIdle,
      width: PIXEL_SCALE * 11,
    };
  };

  if (chickenMachineState === "initial") return null;

  const level = getAnimalLevel(chicken.experience, "Chicken");

  return (
    <>
      <div
        className="relative cursor-pointer w-full h-full flex items-center justify-center"
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
          height: `${GRID_WIDTH_PX * 2}px`,
        }}
        onClick={handleClick}
        onMouseLeave={() => showWakesIn && setShowWakesIn(false)}
        onTouchEnd={() => showWakesIn && setShowWakesIn(false)}
      >
        <div
          className="relative w-full h-full"
          style={{
            height: `${PIXEL_SCALE * 19}px`,
          }}
        >
          {showDrops && (
            <ProduceDrops
              multiplier={chicken.multiplier ?? 0}
              level={level}
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
            alt={`${capitalize(chickenMachineState)} Chicken`}
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
          {!idle && !needsLove && !sick && (
            <img
              src={CHICKEN_EMOTION_ICONS[chickenMachineState].icon}
              alt={`${capitalize(chickenMachineState)} Chicken`}
              style={{
                width: `${CHICKEN_EMOTION_ICONS[chickenMachineState].width}px`,
                top: CHICKEN_EMOTION_ICONS[chickenMachineState].top,
                right: CHICKEN_EMOTION_ICONS[chickenMachineState].right,
              }}
              className="absolute"
            />
          )}
          {/* Request */}
          {idle && (
            <RequestBubble
              top={PIXEL_SCALE * -3.5}
              left={PIXEL_SCALE * 20}
              request={favFood}
            />
          )}
          {sick && (
            <RequestBubble
              top={PIXEL_SCALE * -3.5}
              left={PIXEL_SCALE * 20}
              request="Barn Delight"
            />
          )}
          {needsLove && (
            <RequestBubble
              top={PIXEL_SCALE * -3.5}
              left={PIXEL_SCALE * 20}
              request={chicken.item}
            />
          )}
          {sleeping && showWakesIn && (
            <WakesIn awakeAt={chicken.awakeAt} className="-top-9 z-20" />
          )}
        </div>
        <InfoPopover
          showPopover={
            showNoToolPopover ||
            showNoFoodSelected ||
            showNoMedicine ||
            showNotEnoughFood
          }
          className="-top-10 left-1/2 transform -translate-x-1/2 z-20"
        >
          <p className="text-xs p-0.5 py-1 font-secondary">
            {getInfoPopoverMessage()}
          </p>
        </InfoPopover>
      </div>
      {/* Level Progress */}
      <LevelProgress
        animalState={chickenMachineState}
        experience={chicken.experience}
        animal={chicken}
        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 ml-0.5"
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
        className="flex top-1 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
      >
        <span
          className="text-sm yield-text"
          style={{
            color:
              favFood === selectedItem || selectedItem === "Omnifeed"
                ? "#71e358"
                : "#fff",
          }}
        >{`+${formatNumber(ANIMAL_FOOD_EXPERIENCE.Chicken[level][selectedItem as AnimalFoodName])}`}</span>
      </Transition>
      <Transition
        appear={true}
        id="oil-reserve-collected-amount"
        show={showLoveXp}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 -translate-y-0"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex top-1 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
      >
        <span
          className="text-sm yield-text"
          style={{
            color: "#ffffff",
          }}
        >{`+${formatNumber(ITEM_XP[chicken.item])}`}</span>
      </Transition>
    </>
  );
};
