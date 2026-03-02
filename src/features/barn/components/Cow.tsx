import React, { useContext, useEffect, useState } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useActorRef, useSelector } from "@xstate/react";
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
  MutantAnimal,
} from "features/game/types/game";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { useSound } from "lib/utils/hooks/useSound";
import Decimal from "decimal.js-light";
import { InfoPopover } from "features/island/common/InfoPopover";
import {
  getBarnDelightCost,
  handleFoodXP,
  REQUIRED_FOOD_QTY,
} from "features/game/events/landExpansion/feedAnimal";
import { getAnimalXP } from "features/game/events/landExpansion/loveAnimal";
import { MutantAnimalModal } from "features/farming/animals/components/MutantAnimalModal";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import { SleepingAnimalModal } from "./SleepingAnimalModal";
import glow from "public/world/glow.png";

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
const _game = (state: MachineState) => state.context.state;

export const Cow: React.FC<{ id: string; disabled: boolean }> = ({
  id,
  disabled,
}) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);

  const cow = useSelector(gameService, _cow(id));
  const game = useSelector(gameService, _game);
  const cowService = useActorRef(animalMachine, {
    context: {
      animal: cow,
    },
  }) as unknown as AnimalMachineInterpreter;

  const cowMachineState = useSelector(cowService, _animalState);
  const inventory = useSelector(gameService, _inventory);
  const [showFeedXP, setShowFeedXP] = useState(false);
  const [showLoveItem, setShowLoveItem] = useState<LoveAnimalItem>();
  const [showMutantAnimalModal, setShowMutantAnimalModal] = useState(false);

  useEffect(() => {
    if (cow.awakeAt < Date.now() && cowMachineState === "sleeping") {
      cowService.send({
        type: "INSTANT_WAKE_UP",
        animal: cow,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cow.awakeAt]);

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
  const [showAnimalDetails, setShowAnimalDetails] = useState(false);
  const [showNoFoodSelected, setShowNoFoodSelected] = useState(false);
  const [showNotEnoughFood, setShowNotEnoughFood] = useState(false);
  const [showNoMedicine, setShowNoMedicine] = useState(false);
  // Sounds
  const { play: playFeedAnimal } = useSound("feed_animal");
  const { play: playCowCollect } = useSound("cow_collect");
  const { play: playProduceDrop } = useSound("produce_drop");
  const { play: playLevelUp } = useSound("level_up");
  const { play: playCureAnimal } = useSound("cure_animal");

  const favFood = getAnimalFavoriteFood("Cow", cow.experience);
  const sleeping = cowMachineState === "sleeping";
  const needsLove = cowMachineState === "needsLove";
  const ready = cowMachineState === "ready";
  const idle = cowMachineState === "idle";
  const sick = cowMachineState === "sick" || cow.state === "sick";

  const { foodQuantity: requiredFoodQty } = getBoostedFoodQuantity({
    animalType: "Cow",
    foodQuantity: REQUIRED_FOOD_QTY.Cow,
    game,
  });

  const hasGoldenCow = isCollectibleBuilt({
    name: "Golden Cow",
    game,
  });

  const hasOracleSyringeEquipped = isWearableActive({
    name: "Oracle Syringe",
    game,
  });

  const { name: mutantName } = cow.reward?.items?.[0] ?? {};

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

  const onLoveClick = async () => {
    if ((inventory[cow.item] ?? new Decimal(0)).lt(1)) {
      handleShowDetails();
      return;
    }

    shortcutItem(cow.item);
    loveCow(cow.item);
  };

  const loveCow = (item = selectedItem) => {
    const updatedState = gameService.send({
      type: "animal.loved",
      animal: "Cow",
      id: cow.id,
      item: item as LoveAnimalItem,
    });

    setShowLoveItem(item as LoveAnimalItem);
    setTimeout(() => setShowLoveItem(undefined), 700);

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
    const medicineCount = inventory["Barn Delight"] ?? new Decimal(0);
    const { amount: barnDelightCost } = getBarnDelightCost({ state: game });
    const hasEnoughMedicine = medicineCount.gte(barnDelightCost);

    if (hasOracleSyringeEquipped) {
      playCureAnimal();
      cureCow("Barn Delight");
      return;
    }

    if (hasEnoughMedicine) {
      playCureAnimal();
      cureCow("Barn Delight");
      return;
    }

    setShowNoMedicine(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowNoMedicine(false);

    return;
  };

  const handleShowDetails = () => {
    // Check if an event has been fired in the last 0.5 seconds - if so return;
    const actions = gameService.getSnapshot().context.actions;
    const lastEventTime =
      actions.length > 0 ? actions[actions.length - 1]?.createdAt : undefined;
    const currentTime = Date.now();

    if (currentTime - (lastEventTime?.getTime() ?? 0) < 500) return;

    setShowAnimalDetails(true);
  };

  const onReadyClick = async () => {
    if (mutantName && !showMutantAnimalModal) {
      setShowMutantAnimalModal(true);
      return;
    }

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

    if (sick) return onSickClick();

    if (needsLove) return onLoveClick();

    if (sleeping) {
      handleShowDetails();
      return;
    }

    if (ready) {
      // Already animating
      if (showDrops) return;
      return onReadyClick();
    }

    const hasFoodSelected = selectedItem && isAnimalFood(selectedItem);

    if (hasGoldenCow) {
      feedCow();
      return;
    }

    if (hasFoodSelected) {
      const foodCount =
        inventory[selectedItem as AnimalFoodName] ?? new Decimal(0);
      if (foodCount.lt(requiredFoodQty)) {
        setShowNotEnoughFood(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowNotEnoughFood(false);
        return;
      }

      feedCow(selectedItem);
      return;
    }

    setShowNoFoodSelected(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowNoFoodSelected(false);
  };

  const getInfoPopoverMessage = () => {
    if (showNoFoodSelected) return t("animal.noFoodMessage");
    if (showNoMedicine) return t("animal.noMedicine");
    if (showNotEnoughFood)
      return t("animal.notEnoughFood", { amount: requiredFoodQty });
  };

  const getAnimalXPEarned = () => {
    const { foodXp } = handleFoodXP({
      state: game,
      animal: "Cow",
      level,
      food: hasGoldenCow ? favFood : (selectedItem as AnimalFoodName),
    });

    return foodXp;
  };

  const animalImageInfo = () => {
    if (ready) {
      return {
        image: SUNNYSIDE.animals.cowReady,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sleeping || needsLove) {
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

  const requestBubbleRequest = () => {
    if (sick) return "Barn Delight";
    if (needsLove) return cow.item;
    return favFood;
  };
  const showRequestBubble = sick || needsLove || idle;

  if (cowMachineState === "initial") return null;

  const level = getAnimalLevel(cow.experience, "Cow");
  const xpIndicatorColor =
    favFood === selectedItem || selectedItem === "Omnifeed" || hasGoldenCow
      ? "#71e358"
      : "#fff";
  const xpIndicatorAmount = getAnimalXPEarned();

  const { animalXP } = getAnimalXP({
    state: game,
    name: showLoveItem!,
    animal: "Cow",
  });

  return (
    <>
      {mutantName && (
        <MutantAnimalModal
          mutant={mutantName as MutantAnimal}
          show={!!showMutantAnimalModal}
          onContinue={() => {
            setShowMutantAnimalModal(false);
            onReadyClick();
          }}
        />
      )}

      {/* Upcoming Mutant Sign */}
      {mutantName && (
        <img
          src={glow}
          className="absolute animate-pulsate pointer-events-none"
          style={{
            bottom: "-28px",
            left: "-27.5px",
            width: "165%",
            height: "165%",
            maxWidth: `${GRID_WIDTH_PX * 40}px`,
            maxHeight: `${GRID_WIDTH_PX * 40}px`,
          }}
        />
      )}

      <div
        className="relative flex items-center justify-center cursor-pointer"
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
          height: `${GRID_WIDTH_PX * 2}px`,
        }}
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
              className="absolute pointer-events-none"
            />
          )}
          {/* Request */}
          {showRequestBubble && (
            <RequestBubble
              top={PIXEL_SCALE * 1}
              left={PIXEL_SCALE * 23}
              request={requestBubbleRequest()}
              quantity={idle && !hasGoldenCow ? requiredFoodQty : undefined}
            />
          )}
          <Modal
            show={showAnimalDetails}
            onHide={() => setShowAnimalDetails(false)}
          >
            <CloseButtonPanel
              container={OuterPanel}
              onClose={() => setShowAnimalDetails(false)}
            >
              <SleepingAnimalModal
                id={cow.id}
                animal={cow}
                awakeAt={cow.awakeAt}
                onClose={() => setShowAnimalDetails(false)}
              />
            </CloseButtonPanel>
          </Modal>
          <InfoPopover
            showPopover={
              showNoFoodSelected || showNoMedicine || showNotEnoughFood
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
          animal={cow}
          animalState={cowMachineState}
          experience={cow.experience}
          className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 ml-1 pointer-events-none"
          // Don't block level up UI with wakes in panel if accidentally clicked
          onLevelUp={() => setShowAnimalDetails(false)}
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
          as="div"
        >
          <span
            className="text-sm yield-text"
            style={{
              color: xpIndicatorColor,
            }}
          >
            {!!xpIndicatorAmount && `+${xpIndicatorAmount}`}
          </span>
        </Transition>
        <Transition
          appear={true}
          id="oil-reserve-collected-amount"
          show={!!showLoveItem}
          enter="transition-opacity transition-transform duration-200"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 -translate-y-0"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex -top-1 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
          as="div"
        >
          <span
            className="text-sm yield-text"
            style={{
              color: "#ffffff",
            }}
          >
            {!!animalXP && `+${animalXP}`}
          </span>
        </Transition>
      </div>
    </>
  );
};
