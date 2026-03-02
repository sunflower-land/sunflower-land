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
} from "features/game/lib/animalMachine";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  getBoostedFoodQuantity,
  isAnimalFood,
} from "features/game/lib/animals";
import classNames from "classnames";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";
import { ANIMAL_EMOTION_ICONS } from "./Cow";
import {
  AnimalFoodName,
  AnimalMedicineName,
  InventoryItemName,
  LoveAnimalItem,
  MutantAnimal,
} from "features/game/types/game";
import { Transition } from "@headlessui/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
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
import { MutantAnimalModal } from "features/farming/animals/components/MutantAnimalModal";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { Modal } from "components/ui/Modal";
import { SleepingAnimalModal } from "./SleepingAnimalModal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import glow from "public/world/glow.png";

const _animalState = (state: AnimalMachineState) =>
  // Casting here because we know the value is always a string rather than an object
  // This helps to be able to use the string as a key in the CHICKEN_STATES object
  state.value as AnimalMachineState["value"];

const _sheep = (id: string) => (state: MachineState) =>
  state.context.state.barn.animals[id];
const _inventory = (state: MachineState) => state.context.state.inventory;
const _game = (state: MachineState) => state.context.state;

export const Sheep: React.FC<{ id: string; disabled: boolean }> = ({
  id,
  disabled,
}) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);

  const sheep = useSelector(gameService, _sheep(id));
  const sheepService = useActorRef(animalMachine, {
    context: {
      animal: sheep,
    },
  }) as unknown as AnimalMachineInterpreter;

  const sheepState = useSelector(sheepService, _animalState);
  const inventory = useSelector(gameService, _inventory);
  const game = useSelector(gameService, _game);
  const [showDrops, setShowDrops] = useState(false);
  const [showNoFoodSelected, setShowNoFoodSelected] = useState(false);
  const [showAnimalDetails, setShowAnimalDetails] = useState(false);
  const [showNotEnoughFood, setShowNotEnoughFood] = useState(false);
  const [showNoMedicine, setShowNoMedicine] = useState(false);
  const [showFeedXP, setShowFeedXP] = useState(false);
  const [showLoveItem, setShowLoveItem] = useState<LoveAnimalItem>();
  const [showMutantAnimalModal, setShowMutantAnimalModal] = useState(false);

  // Sounds
  const { play: playFeedAnimal } = useSound("feed_animal");
  const { play: playSheepCollect } = useSound("sheep_collect");
  const { play: playProduceDrop } = useSound("produce_drop");
  const { play: playLevelUp } = useSound("level_up");
  const { play: playCureAnimal } = useSound("cure_animal");
  const { t } = useAppTranslation();

  const favFood = getAnimalFavoriteFood("Sheep", sheep.experience);
  const sleeping = sheepState === "sleeping";
  const needsLove = sheepState === "needsLove";
  const ready = sheepState === "ready";
  const sick = sheepState === "sick" || sheep.state === "sick";
  const idle = sheepState === "idle";

  const { foodQuantity: requiredFoodQty } = getBoostedFoodQuantity({
    animalType: "Sheep",
    foodQuantity: REQUIRED_FOOD_QTY.Sheep,
    game,
  });

  const hasGoldenSheep = isCollectibleBuilt({
    name: "Golden Sheep",
    game,
  });

  const hasOracleSyringeEquipped = isWearableActive({
    name: "Oracle Syringe",
    game,
  });

  const { name: mutantName } = sheep.reward?.items?.[0] ?? {};

  useEffect(() => {
    if (sheep.awakeAt < Date.now() && sheepState === "sleeping") {
      sheepService.send({
        type: "INSTANT_WAKE_UP",
        animal: sheep,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheep.awakeAt]);

  useEffect(() => {
    if (sheep.state === "sick" && sheepState !== "sick") {
      sheepService.send({
        type: "SICK",
        animal: sheep,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheep.state]);

  const feedSheep = (item?: InventoryItemName) => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Sheep",
      item: item ? (item as AnimalFoodName) : undefined,
      id: sheep.id,
    });

    setShowFeedXP(true);
    setTimeout(() => setShowFeedXP(false), 700);

    const updatedSheep = updatedState.context.state.barn.animals[id];

    sheepService.send({
      type: "FEED",
      animal: updatedSheep,
    });

    playFeedAnimal();
  };

  const onLoveClick = async () => {
    if ((inventory[sheep.item] ?? new Decimal(0)).lt(1)) {
      handleShowDetails();
      return;
    }

    shortcutItem(sheep.item);
    loveSheep(sheep.item);
  };

  const loveSheep = (item = selectedItem) => {
    const updatedState = gameService.send({
      type: "animal.loved",
      animal: "Sheep",
      id: sheep.id,
      item: item as LoveAnimalItem,
    });

    setShowLoveItem(item as LoveAnimalItem);
    setTimeout(() => setShowLoveItem(undefined), 700);

    const updatedSheep = updatedState.context.state.barn.animals[id];

    sheepService.send({
      type: "LOVE",
      animal: updatedSheep,
    });

    playFeedAnimal();
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

  const cureSheep = (item?: InventoryItemName) => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Sheep",
      item: item ? (item as AnimalMedicineName) : undefined,
      id: sheep.id,
    });

    const updatedSheep = updatedState.context.state.barn.animals[id];

    sheepService.send({
      type: "CURE",
      animal: updatedSheep,
    });
  };

  const onSickClick = async () => {
    const medicineCount = inventory["Barn Delight"] ?? new Decimal(0);
    const { amount: barnDelightCost } = getBarnDelightCost({ state: game });
    const hasEnoughMedicine = medicineCount.gte(barnDelightCost);

    if (hasOracleSyringeEquipped) {
      playCureAnimal();
      cureSheep("Barn Delight");
      return;
    }

    if (hasEnoughMedicine) {
      playCureAnimal();
      cureSheep("Barn Delight");
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
    playSheepCollect();

    await new Promise((resolve) => setTimeout(resolve, 900));

    playLevelUp();
    claimProduce();
    setShowDrops(false);

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

    if (hasGoldenSheep) {
      feedSheep();
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

      feedSheep(selectedItem);
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
      animal: "Sheep",
      level,
      food: hasGoldenSheep ? favFood : (selectedItem as AnimalFoodName),
    });

    return foodXp;
  };

  const animalImageInfo = () => {
    if (ready) {
      return {
        image: SUNNYSIDE.animals.sheepReady,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sleeping || needsLove) {
      return {
        image: SUNNYSIDE.animals.sheepSleeping,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sick) {
      return {
        image: SUNNYSIDE.animals.sheepSick,
        width: PIXEL_SCALE * 11,
      };
    }

    return {
      image: SUNNYSIDE.animals.sheepIdle,
      width: PIXEL_SCALE * 11,
    };
  };

  const requestBubbleRequest = () => {
    if (sick) return "Barn Delight";
    if (needsLove) return sheep.item;
    return favFood;
  };
  const showRequestBubble = sick || needsLove || idle;

  if (sheepState === "initial") return null;

  const level = getAnimalLevel(sheep.experience, "Sheep");

  const xpIndicatorColor =
    favFood === selectedItem || selectedItem === "Omnifeed" || hasGoldenSheep
      ? "#71e358"
      : "#fff";
  const xpIndicatorAmount = getAnimalXPEarned();

  const { animalXP } = getAnimalXP({
    state: game,
    name: showLoveItem!,
    animal: "Sheep",
  });

  const { foodXp } = handleFoodXP({
    state: game,
    animal: "Sheep",
    level,
    food: selectedItem as AnimalFoodName,
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
            bottom: "-22px",
            left: "-25px",
            width: "160%",
            height: "160%",
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
              multiplier={sheep.multiplier ?? 0}
              level={level}
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
              className="absolute pointer-events-none"
            />
          )}
          {/* Request */}
          {showRequestBubble && (
            <RequestBubble
              top={PIXEL_SCALE * 1}
              left={PIXEL_SCALE * 23}
              request={requestBubbleRequest()}
              quantity={idle && !hasGoldenSheep ? requiredFoodQty : undefined}
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
                id={sheep.id}
                animal={sheep}
                awakeAt={sheep.awakeAt}
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
          animal={sheep}
          animalState={sheepState}
          experience={sheep.experience}
          className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 ml-1"
          // Don't block level up UI with wakes in panel if accidentally clicked
          onLevelUp={() => setShowAnimalDetails(false)}
        />
        {/* Feed XP */}
        <Transition
          appear={true}
          id="food-xp-amount"
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
          id="food-xp-amount"
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
