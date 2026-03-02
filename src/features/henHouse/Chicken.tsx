import React, { useContext, useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
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
import classNames from "classnames";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { Transition } from "@headlessui/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  AnimalFoodName,
  AnimalMedicineName,
  InventoryItemName,
  LoveAnimalItem,
  MutantAnimal,
} from "features/game/types/game";
import { ProduceDrops } from "features/game/expansion/components/animals/ProduceDrops";
import { useSound } from "lib/utils/hooks/useSound";
import { InfoPopover } from "features/island/common/InfoPopover";
import Decimal from "decimal.js-light";
import {
  getBarnDelightCost,
  handleFoodXP,
  REQUIRED_FOOD_QTY,
} from "features/game/events/landExpansion/feedAnimal";
import { getAnimalXP } from "features/game/events/landExpansion/loveAnimal";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { MutantAnimalModal } from "features/farming/animals/components/MutantAnimalModal";
import { isWearableActive } from "features/game/lib/wearables";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import { SleepingAnimalModal } from "features/barn/components/SleepingAnimalModal";
import glow from "public/world/glow.png";

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

export const getMedicineOption = (): {
  name: InventoryItemName;
  icon: InventoryItemName;
  showSecondaryImage: boolean;
}[] => [
  {
    name: "Barn Delight" as InventoryItemName,
    icon: "Barn Delight" as InventoryItemName,
    showSecondaryImage: false,
  },
];

export const Chicken: React.FC<{ id: string; disabled: boolean }> = ({
  id,
  disabled,
}) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const { t } = useAppTranslation();
  const chicken = useSelector(gameService, _chicken(id));
  const game = useSelector(gameService, _game);
  const inventory = useSelector(gameService, _inventory);
  const chickenService = useActorRef(animalMachine, {
    context: { animal: chicken },
    devTools: true,
  }) as unknown as AnimalMachineInterpreter;

  const chickenMachineState = useSelector(chickenService, _animalState);

  useEffect(() => {
    if (chicken.awakeAt < Date.now() && chickenMachineState === "sleeping") {
      chickenService.send({
        type: "INSTANT_WAKE_UP",
        animal: chicken,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chicken.awakeAt]);

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
  const [showAnimalDetails, setShowAnimalDetails] = useState(false);
  const [showNotEnoughFood, setShowNotEnoughFood] = useState(false);
  const [showNoMedicine, setShowNoMedicine] = useState(false);
  const [showFeedXP, setShowFeedXP] = useState(false);
  const [showNoFoodSelected, setShowNoFoodSelected] = useState(false);
  const [showLoveItem, setShowLoveItem] = useState<LoveAnimalItem>();
  const [showMutantAnimalModal, setShowMutantAnimalModal] = useState(false);

  const favFood = getAnimalFavoriteFood("Chicken", chicken.experience);
  const sleeping = chickenMachineState === "sleeping";
  const needsLove = chickenMachineState === "needsLove";
  const ready = chickenMachineState === "ready";
  const idle = chickenMachineState === "idle";
  const sick = chickenMachineState === "sick" || chicken.state === "sick";

  // Sounds
  const { play: playFeedAnimal } = useSound("feed_animal");
  const { play: playChickenCollect } = useSound("chicken_collect");
  const { play: playProduceDrop } = useSound("produce_drop");
  const { play: playLevelUp } = useSound("level_up");
  const { play: playCureAnimal } = useSound("cure_animal");

  const { foodQuantity: requiredFoodQty } = getBoostedFoodQuantity({
    animalType: "Chicken",
    foodQuantity: REQUIRED_FOOD_QTY.Chicken,
    game,
  });

  const hasGoldEgg = isCollectibleBuilt({
    name: "Gold Egg",
    game,
  });

  const hasOracleSyringeEquipped = isWearableActive({
    name: "Oracle Syringe",
    game,
  });

  // Check if the chicken has a mutant
  const { name: mutantName } = chicken.reward?.items?.[0] ?? {};

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
      handleShowDetails();
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

    setShowLoveItem(item as LoveAnimalItem);
    setTimeout(() => setShowLoveItem(undefined), 700);

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
    const updatedState = gameService.send({
      type: "animal.fed",
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

  const handleShowDetails = () => {
    // Check if an event has been fired in the last 0.5 seconds - if so return;
    const actions = gameService.getSnapshot().context.actions;
    const lastEventTime =
      actions.length > 0 ? actions[actions.length - 1]?.createdAt : undefined;
    const currentTime = Date.now();

    if (currentTime - (lastEventTime?.getTime() ?? 0) < 500) return;

    setShowAnimalDetails(true);
  };

  const onSickClick = async () => {
    const medicineCount = inventory["Barn Delight"] ?? new Decimal(0);
    const { amount: barnDelightCost } = getBarnDelightCost({ state: game });
    const hasEnoughMedicine = medicineCount.gte(barnDelightCost);

    if (hasOracleSyringeEquipped) {
      playCureAnimal();
      cureChicken("Barn Delight");
      return;
    }

    if (hasEnoughMedicine) {
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
    if (mutantName && !showMutantAnimalModal) {
      setShowMutantAnimalModal(true);
      return;
    }

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

    if (hasGoldEgg) {
      feedChicken();
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

      feedChicken(selectedItem);
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
      animal: "Chicken",
      level,
      food: hasGoldEgg ? favFood : (selectedItem as AnimalFoodName),
    });

    return foodXp;
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

  const requestBubbleRequest = () => {
    if (sick) return "Barn Delight";
    if (needsLove) return chicken.item;
    return favFood;
  };
  const showRequestBubble = sick || needsLove || idle;

  if (chickenMachineState === "initial") return null;

  const level = getAnimalLevel(chicken.experience, "Chicken");
  const xpIndicatorColor =
    favFood === selectedItem || selectedItem === "Omnifeed" || hasGoldEgg
      ? "#71e358"
      : "#fff";
  const xpIndicatorAmount = getAnimalXPEarned();

  const { animalXP } = getAnimalXP({
    state: game,
    name: showLoveItem!,
    animal: "Chicken",
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
            bottom: "-6px",
            maxWidth: "85px",
            maxHeight: "85px",
          }}
        />
      )}

      <div
        className="relative cursor-pointer w-full h-full flex items-center justify-center"
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
          height: `${GRID_WIDTH_PX * 2}px`,
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
              className="absolute pointer-events-none"
            />
          )}
          {/* Request */}
          {showRequestBubble && (
            <RequestBubble
              top={PIXEL_SCALE * -3.5}
              left={PIXEL_SCALE * 20}
              request={requestBubbleRequest()}
            />
          )}
        </div>
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
      <Modal
        show={showAnimalDetails}
        onHide={() => setShowAnimalDetails(false)}
      >
        <CloseButtonPanel
          container={OuterPanel}
          onClose={() => setShowAnimalDetails(false)}
        >
          <SleepingAnimalModal
            id={chicken.id}
            animal={chicken}
            awakeAt={chicken.awakeAt}
            onClose={() => setShowAnimalDetails(false)}
          />
        </CloseButtonPanel>
      </Modal>
      {/* Level Progress */}
      <LevelProgress
        animalState={chickenMachineState}
        experience={chicken.experience}
        animal={chicken}
        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 ml-0.5 pointer-events-none"
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
        className="flex top-1 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
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
        id="love-xp"
        show={!!showLoveItem}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 -translate-y-0"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex top-1 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
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
    </>
  );
};
