import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useInterpret, useSelector } from "@xstate/react";
import { useNow } from "lib/utils/hooks/useNow";
import { PRE_ACTION_TICK_MS } from "features/game/lib/timerDisplay";
import { capitalize } from "lib/utils/capitalize";
import {
  animalMachine,
  type AnimalMachineInterpreter,
  type TState as AnimalMachineState,
} from "features/game/lib/animalMachine";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  getBoostedFoodQuantity,
  getFeedItem,
  isAnimalFood,
  resolveAnimal,
} from "features/game/lib/animals";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { RequestBubble } from "features/game/expansion/components/animals/RequestBubble";
import { LevelProgress } from "features/game/expansion/components/animals/LevelProgress";
import { ProduceDrops } from "features/game/expansion/components/animals/ProduceDrops";
import type {
  AnimalFeedBuffName,
  AnimalFoodName,
  AnimalMedicineName,
  InventoryItemName,
  LoveAnimalItem,
  MutantAnimal,
} from "features/game/types/game";
import { isAnimalFeedBuffItem } from "features/game/events/landExpansion/applyAnimalFeedBuff";
import { AnimalFeedBuffBadge } from "features/game/expansion/components/animals/AnimalFeedBuffBadge";
import { Transition } from "@headlessui/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import Decimal from "decimal.js-light";
import { InfoPopover } from "features/island/common/InfoPopover";
import {
  getBarnDelightCost,
  handleFoodXP,
  REQUIRED_FOOD_QTY,
} from "features/game/events/landExpansion/feedAnimal";
import { getAnimalXP } from "features/game/events/landExpansion/loveAnimal";
import { isAnimalFeedable } from "features/game/events/landExpansion/buyAnimal";
import { MutantAnimalModal } from "features/farming/animals/components/MutantAnimalModal";
import { MutantSparkles } from "features/farming/animals/components/MutantSparkles";
import { isAnimalCoveredByGoldenAsset } from "features/game/events/landExpansion/feedAllAnimals";
import { isWearableActive } from "features/game/lib/wearables";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import { SleepingAnimalModal } from "features/barn/components/SleepingAnimalModal";
import { LockedAnimalModal } from "features/barn/components/LockedAnimalModal";
import { ANIMAL_EMOTION_ICONS } from "features/barn/components/Cow";

// The idle sprite stands in for every state until the rest of the art lands
// (Elias 2026-09-18) - the emotion icon above the sprite still shows sleeping,
// ready and sick, so no state cue is lost. Repoint an entry as its art arrives.
const PIG_IMAGES = {
  idle: SUNNYSIDE.animals.pigIdle,
  ready: SUNNYSIDE.animals.pigIdle, // TODO(Chapter 16 art): pigs/ready
  sleeping: SUNNYSIDE.animals.pigIdle, // TODO(Chapter 16 art): pigs/sleeping
  sick: SUNNYSIDE.animals.pigIdle, // TODO(Chapter 16 art): pigs/sick
};

const _animalState = (state: AnimalMachineState) =>
  // Casting here because we know the value is always a string rather than an object
  // This helps to be able to use the string as a key in the CHICKEN_STATES object
  state.value as AnimalMachineState["value"];

const _pig = (id: string) => (state: MachineState) =>
  state.context.state.pigpen.animals[id];
const _inventory = (state: MachineState) => state.context.state.inventory;
const _game = (state: MachineState) => state.context.state;

export const Pig: React.FC<{ id: string; disabled: boolean }> = ({
  id,
  disabled,
}) => {
  // No time-limited feed discount covers Pigs today (the Collie and Bantam
  // Shrine discounts are type-gated), but the required-food display stays on a
  // LIVE clock like every other animal so a future Pig boost can't show a
  // stale discount. One tick a minute is enough.
  const now = useNow({ live: true, intervalMs: PRE_ACTION_TICK_MS });
  const { gameService, selectedItem, shortcutItem } = useContext(Context);

  const storedPig = useSelector(gameService, _pig(id));
  const game = useSelector(gameService, _game);
  // The animal machine has no access to game state, so every consumer below —
  // the machine included — is handed the animal with its live windowed wake time
  // substituted in. Read-only: nothing here writes an animal back.
  const pig = useMemo(() => resolveAnimal(storedPig, game), [storedPig, game]);
  const pigService = useInterpret(animalMachine, {
    context: {
      animal: pig,
    },
  }) as unknown as AnimalMachineInterpreter;

  const pigMachineState = useSelector(pigService, _animalState);
  const inventory = useSelector(gameService, _inventory);
  const [showFeedXP, setShowFeedXP] = useState(false);
  const [showLoveItem, setShowLoveItem] = useState<LoveAnimalItem>();
  const [showMutantAnimalModal, setShowMutantAnimalModal] = useState(false);

  useEffect(() => {
    if (pig.awakeAt < Date.now() && pigMachineState === "sleeping") {
      pigService.send({
        type: "INSTANT_WAKE_UP",
        animal: pig,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pig.awakeAt]);

  useEffect(() => {
    if (pig.state === "sick" && pigMachineState !== "sick") {
      pigService.send({
        type: "SICK",
        animal: pig,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pig.state]);

  const { t } = useAppTranslation();

  const [showDrops, setShowDrops] = useState(false);
  const [showAnimalDetails, setShowAnimalDetails] = useState(false);
  const [showNoFoodSelected, setShowNoFoodSelected] = useState(false);
  const [showNotEnoughFood, setShowNotEnoughFood] = useState(false);
  const [showNoMedicine, setShowNoMedicine] = useState(false);
  const [showLockedDetails, setShowLockedDetails] = useState(false);
  // Sounds
  const { play: playFeedAnimal } = useSound("feed_animal");
  // TODO(Chapter 16 art): Pig SFX exist in the asset repo but are not wired up.
  const { play: playPigCollect } = useSound("cow_collect");
  const { play: playProduceDrop } = useSound("produce_drop");
  const { play: playLevelUp } = useSound("level_up");
  const { play: playCureAnimal } = useSound("cure_animal");

  const lastSynced = useRef({ state: pig.state, experience: pig.experience });

  // Sync the local machine when game state changes underneath it,
  // e.g. via the Feed All button (bulk feed/cure/claim without a click).
  useEffect(() => {
    const prev = lastSynced.current;
    lastSynced.current = { state: pig.state, experience: pig.experience };

    if (prev.state === pig.state && prev.experience === pig.experience) {
      return;
    }

    const machineState = () => pigService.getSnapshot().value;

    if (machineState() === "sick" && pig.state !== "sick") {
      pigService.send({ type: "CURE", animal: pig });
    }

    // A bulk claim happens without a click — play the same drop animation
    // and sounds as a manual claim before the sprite transitions.
    const animateBulkClaim = async (
      event: "CLAIM_PRODUCE" | "INSTANT_WAKE_UP",
    ) => {
      setShowDrops(true);
      playProduceDrop();
      await new Promise((resolve) => setTimeout(resolve, 500));
      playPigCollect();
      await new Promise((resolve) => setTimeout(resolve, 900));
      playLevelUp();
      pigService.send({ type: event, animal: pig });
      setShowDrops(false);
    };

    if (machineState() === "ready" && pig.state === "idle") {
      animateBulkClaim("CLAIM_PRODUCE");
    }

    if (
      ["idle", "happy", "sad"].includes(machineState() as string) &&
      pig.state === "idle" &&
      Date.now() < pig.awakeAt
    ) {
      // Bulk feeding can level an animal to ready and claim its produce in
      // the same event; INSTANT_WAKE_UP re-derives the machine state from
      // the animal, which maps an asleep animal to "sleeping".
      animateBulkClaim("INSTANT_WAKE_UP");
    }

    if (
      ["idle", "happy", "sad"].includes(machineState() as string) &&
      ["happy", "sad", "ready"].includes(pig.state) &&
      machineState() !== pig.state
    ) {
      pigService.send({ type: "FEED", animal: pig });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pig.state, pig.experience]);

  const favFood = getAnimalFavoriteFood("Pig", pig.experience);
  const sleeping = pigMachineState === "sleeping";
  const needsLove = pigMachineState === "needsLove";
  const ready = pigMachineState === "ready";
  const idle = pigMachineState === "idle";
  const sick = pigMachineState === "sick" || pig.state === "sick";
  // Over-capacity animals (e.g. the Pigpen's capacity shrank below the herd)
  // cannot be fed. They go dormant (rendered like a sleeping
  // animal) but can still be cured and sold to bounties.
  const isLocked = !isAnimalFeedable("pigpen", game, id);

  const { foodQuantity: requiredFoodQty } = getBoostedFoodQuantity({
    animalType: "Pig",
    foodQuantity: REQUIRED_FOOD_QTY.Pig,
    game,
    animal: pig,
    now,
  });

  const hasGoldenPig = isAnimalCoveredByGoldenAsset({
    state: game,
    animalType: "Pig",
  });

  const hasOracleSyringeEquipped = isWearableActive({
    name: "Oracle Syringe",
    game,
  });

  const { name: mutantName } = pig.reward?.items?.[0] ?? {};

  const feedPig = (item?: InventoryItemName) => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Pig",
      item: item ? (item as AnimalFoodName) : undefined,
      id: pig.id,
    });

    setShowFeedXP(true);
    setTimeout(() => setShowFeedXP(false), 700);

    // Resolve before handing it to the machine: the raw record carries the
    // stale cached `awakeAt`, and the machine's sleep guard has no game state
    // of its own to re-derive from.
    const updatedPig = resolveAnimal(
      updatedState.context.state.pigpen.animals[id],
      updatedState.context.state,
    );

    pigService.send({
      type: "FEED",
      animal: updatedPig,
    });

    playFeedAnimal();
  };

  const onLoveClick = async () => {
    if ((inventory[pig.item] ?? new Decimal(0)).lt(1)) {
      handleShowDetails();
      return;
    }

    shortcutItem(pig.item);
    lovePig(pig.item);
  };

  const lovePig = (item = selectedItem) => {
    const updatedState = gameService.send({
      type: "animal.loved",
      animal: "Pig",
      id: pig.id,
      item: item as LoveAnimalItem,
    });

    setShowLoveItem(item as LoveAnimalItem);
    setTimeout(() => setShowLoveItem(undefined), 700);

    // Resolve before handing it to the machine: the raw record carries the
    // stale cached `awakeAt`, and the machine's sleep guard has no game state
    // of its own to re-derive from.
    const updatedPig = resolveAnimal(
      updatedState.context.state.pigpen.animals[id],
      updatedState.context.state,
    );

    pigService.send({
      type: "LOVE",
      animal: updatedPig,
    });

    playFeedAnimal();
  };

  const claimProduce = () => {
    const updatedState = gameService.send({
      type: "produce.claimed",
      animal: "Pig",
      id: pig.id,
    });

    // Resolve before handing it to the machine: the raw record carries the
    // stale cached `awakeAt`, and the machine's sleep guard has no game state
    // of its own to re-derive from.
    const updatedPig = resolveAnimal(
      updatedState.context.state.pigpen.animals[id],
      updatedState.context.state,
    );

    pigService.send({
      type: "CLAIM_PRODUCE",
      animal: updatedPig,
    });
  };

  const curePig = (item?: InventoryItemName) => {
    const updatedState = gameService.send({
      type: "animal.fed",
      animal: "Pig",
      item: item ? (item as AnimalMedicineName) : undefined,
      id: pig.id,
    });

    // Resolve before handing it to the machine: the raw record carries the
    // stale cached `awakeAt`, and the machine's sleep guard has no game state
    // of its own to re-derive from.
    const updatedPig = resolveAnimal(
      updatedState.context.state.pigpen.animals[id],
      updatedState.context.state,
    );

    pigService.send({
      type: "CURE",
      animal: updatedPig,
    });
  };

  const onSickClick = async () => {
    const medicineCount = inventory["Barn Delight"] ?? new Decimal(0);
    const { amount: barnDelightCost } = getBarnDelightCost({ state: game });
    const hasEnoughMedicine = medicineCount.gte(barnDelightCost);

    if (hasOracleSyringeEquipped) {
      playCureAnimal();
      curePig("Barn Delight");
      return;
    }

    if (hasEnoughMedicine) {
      playCureAnimal();
      curePig("Barn Delight");
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
    playPigCollect();

    await new Promise((resolve) => setTimeout(resolve, 900));

    playLevelUp();
    claimProduce();
    setShowDrops(false);

    return;
  };

  const handleClick = async () => {
    if (disabled) return;
    // A bulk-claim animation is in flight: the sprite still looks awake but
    // the game-state animal is already asleep, so any feed/claim event would
    // throw. Ignore clicks until the animation resolves.
    if (showDrops) return;

    const showNoFoodPrompt = async () => {
      setShowNoFoodSelected(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowNoFoodSelected(false);
    };

    if (sick) return onSickClick();

    if (needsLove) {
      if (!hasGoldenPig) return onLoveClick();

      handleShowDetails();
      return;
    }

    const hasBuffSelected = selectedItem && isAnimalFeedBuffItem(selectedItem);

    if (hasBuffSelected) {
      const buffItem = selectedItem as AnimalFeedBuffName;
      const buffCount = inventory[buffItem] ?? new Decimal(0);
      if (!pig.feedBuff && buffCount.gte(1)) {
        gameService.send({
          type: "animal.feedBuffApplied",
          animal: "Pig",
          id: pig.id,
          item: buffItem,
        });
        playFeedAnimal();
        return;
      }

      await showNoFoodPrompt();
      return;
    }

    if (sleeping) {
      handleShowDetails();
      return;
    }

    if (ready) {
      // Already animating
      if (showDrops) return;
      return onReadyClick();
    }

    // Defensive: never let the capacity lock block curing a sick animal
    // (sick is handled above via onSickClick); only normal feeding is gated.
    // Locked animals behave like sleeping ones: clicking opens an info modal.
    if (isLocked && !sick) {
      setShowLockedDetails(true);
      return;
    }

    if (hasGoldenPig) {
      feedPig();
      return;
    }

    // Auto-select the favourite food when it is held so a stale selection
    // (e.g. Hay left over from another building) never feeds the wrong item.
    const feedItem = getFeedItem({
      selectedItem,
      favouriteFood: favFood,
      inventory,
      requiredQty: requiredFoodQty,
    });
    if (feedItem && feedItem !== selectedItem) {
      shortcutItem(feedItem);
    }

    const hasFoodSelected = feedItem && isAnimalFood(feedItem);

    if (hasFoodSelected) {
      const foodCount = inventory[feedItem as AnimalFoodName] ?? new Decimal(0);
      if (foodCount.lt(requiredFoodQty)) {
        setShowNotEnoughFood(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowNotEnoughFood(false);
        return;
      }

      feedPig(feedItem);
      return;
    }

    await showNoFoodPrompt();
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
      animal: "Pig",
      level,
      food: hasGoldenPig ? favFood : (selectedItem as AnimalFoodName),
    });

    return foodXp;
  };

  const animalImageInfo = () => {
    if (ready) {
      return {
        image: PIG_IMAGES.ready,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sleeping || needsLove) {
      return {
        image: PIG_IMAGES.sleeping,
        width: PIXEL_SCALE * 13,
      };
    }

    if (sick) {
      return {
        image: PIG_IMAGES.sick,
        width: PIXEL_SCALE * 11,
      };
    }

    // Locked (over-capacity) animals are dormant - show them sleeping.
    if (isLocked) {
      return {
        image: PIG_IMAGES.sleeping,
        width: PIXEL_SCALE * 13,
      };
    }

    return {
      image: PIG_IMAGES.idle,
      width: PIXEL_SCALE * 11,
    };
  };

  const requestBubbleRequest = () => {
    if (sick) return "Barn Delight";
    if (needsLove) return pig.item;
    return favFood;
  };
  const showRequestBubble =
    sick || (needsLove && !hasGoldenPig) || (idle && !isLocked && !showDrops);

  if (pigMachineState === "initial") return null;

  const level = getAnimalLevel(pig.experience, "Pig", game);
  const xpIndicatorColor =
    favFood === selectedItem || selectedItem === "Omnifeed" || hasGoldenPig
      ? "#71e358"
      : "#fff";
  const xpIndicatorAmount = getAnimalXPEarned();

  const { animalXP } = getAnimalXP({
    state: game,
    name: showLoveItem!,
    animal: "Pig",
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

      <div
        className="relative flex items-center justify-center cursor-pointer"
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
          height: `${GRID_WIDTH_PX * 2}px`,
        }}
      >
        <div className="relative w-full h-full">
          <AnimalFeedBuffBadge feedBuff={pig.feedBuff} />
          {showDrops && (
            <ProduceDrops
              animal={pig}
              multiplier={pig.multiplier ?? 0}
              level={level}
              animalType="Pig"
              className="bottom-0 left-4 top-4"
            />
          )}
          <img
            src={animalImageInfo().image}
            alt={`${capitalize(pigMachineState)} Pig`}
            style={{
              width: `${PIXEL_SCALE * animalImageInfo().width}px`,
            }}
            onClick={handleClick}
            className={classNames(
              "absolute ml-[1px] mt-[2px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            )}
          />
          {/* Upcoming Mutant Sign */}
          {mutantName && <MutantSparkles />}
          {/* Emotion */}
          {!idle && !needsLove && !sick && (
            <img
              src={ANIMAL_EMOTION_ICONS[pigMachineState].icon}
              alt={`${capitalize(pigMachineState)} Pig`}
              style={{
                width: `${ANIMAL_EMOTION_ICONS[pigMachineState].width}px`,
                top: ANIMAL_EMOTION_ICONS[pigMachineState].top,
                right: ANIMAL_EMOTION_ICONS[pigMachineState].right,
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
              quantity={
                idle && !hasGoldenPig ? requiredFoodQty.toNumber() : undefined
              }
            />
          )}
          {/* Over-capacity lock */}
          {isLocked && (
            <img
              src={SUNNYSIDE.icons.lock}
              alt={t("animal.overCapacity")}
              className="absolute z-20 pointer-events-none"
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                top: `${PIXEL_SCALE * 1}px`,
                right: `${PIXEL_SCALE * 1}px`,
              }}
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
                id={pig.id}
                animal={pig}
                awakeAt={pig.awakeAt}
                onClose={() => setShowAnimalDetails(false)}
              />
            </CloseButtonPanel>
          </Modal>
          <Modal
            show={showLockedDetails}
            onHide={() => setShowLockedDetails(false)}
          >
            <CloseButtonPanel
              container={OuterPanel}
              onClose={() => setShowLockedDetails(false)}
            >
              <LockedAnimalModal animal={pig} />
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
          animal={pig}
          animalState={pigMachineState}
          experience={pig.experience}
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
