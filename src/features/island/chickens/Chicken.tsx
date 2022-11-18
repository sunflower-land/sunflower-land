import { useActor, useInterpret, useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";

import hungryChicken from "assets/animals/chickens/hungry_2.gif";
import happyChicken from "assets/animals/chickens/happy_2.gif";
import walkingChickenSheet from "assets/animals/chickens/walking_sheet_2.png";
import sleepingChicken from "assets/animals/chickens/sleeping_2.gif";
import chickenShadow from "assets/animals/chickens/chicken_shadow.png";
import layingEggSheet from "assets/animals/chickens/laying-egg-sheet_2.png";
import wheatOnGround from "assets/animals/chickens/wheat_2.png";
import cancel from "assets/icons/cancel.png";
import wheat from "assets/crops/wheat/crop.png";
import egg from "assets/resources/egg.png";

import { Context } from "features/game/GameProvider";

import Spritesheet from "components/animation/SpriteAnimator";
import {
  CHICKEN_TIME_TO_EGG,
  PIXEL_SCALE,
  POPOVER_TIME_MS,
} from "features/game/lib/constants";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import Decimal from "decimal.js-light";
import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import { MutantChicken } from "features/game/types/craftables";
import { getWheatRequiredToFeed } from "features/game/events/feedChicken";
import {
  ChickenContext,
  chickenMachine,
  MachineInterpreter,
  MachineState,
} from "features/farming/animals/chickenMachine";
import { MutantChickenModal } from "features/farming/animals/components/MutantChickenModal";
import { ITEM_DETAILS } from "features/game/types/images";
interface Props {
  index: number;
}

const getPercentageComplete = (fedAt?: number) => {
  if (!fedAt) return 0;

  const timePassedSinceFed = Date.now() - fedAt;

  if (timePassedSinceFed >= CHICKEN_TIME_TO_EGG) return 100;

  return Math.ceil((timePassedSinceFed / CHICKEN_TIME_TO_EGG) * 100);
};

interface TimeToEggProps {
  service: MachineInterpreter;
  showTimeToEgg: boolean;
}

const TimeToEgg = ({ showTimeToEgg, service }: TimeToEggProps) => {
  const [{ context }] = useActor(service);

  return (
    <InnerPanel
      className={classNames(
        "ml-10 transition-opacity absolute whitespace-nowrap sm:opacity-0 bottom-5 w-fit left-1 z-20 pointer-events-none",
        {
          "opacity-100": showTimeToEgg,
          "opacity-0": !showTimeToEgg,
        }
      )}
    >
      <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
        <div className="flex flex-1 items-center justify-center">
          <img src={egg} className="w-4 mr-1" />
          <span>Egg</span>
        </div>
        <span className="flex-1">
          {secondsToString(context.timeToEgg - context.timeElapsed, {
            length: "medium",
          })}
        </span>
      </div>
    </InnerPanel>
  );
};

const isHungry = (state: MachineState) => state.matches("hungry");
const isEating = (state: MachineState) => state.matches("eating");
const isSleeping = (state: MachineState) => state.matches({ fed: "sleeping" });
const isHappy = (state: MachineState) => state.matches({ fed: "happy" });
const isEggReady = (state: MachineState) => state.matches("eggReady");
const isEggLaid = (state: MachineState) => state.matches("eggLaid");

export const Chicken: React.FC<Props> = ({ index }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { setToast } = useContext(ToastContext);

  const chicken = state.chickens[index];

  const percentageComplete = getPercentageComplete(chicken?.fedAt);

  const chickenContext: Partial<ChickenContext> = chicken;

  // useInterpret returns a static reference (to just the interpreted machine) which will not rerender when its state changes
  const service = useInterpret(chickenMachine, {
    // If chicken is already brewing an egg then add that to the chicken machine context
    context: chickenContext,
  }) as unknown as MachineInterpreter;

  // As per xstate docs:
  // To use a piece of state from the service inside a render, use the useSelector(...) hook to subscribe to it
  const hungry = useSelector(service, isHungry);
  const eating = useSelector(service, isEating);
  const sleeping = useSelector(service, isSleeping);
  const happy = useSelector(service, isHappy);
  const eggReady = useSelector(service, isEggReady);
  const eggLaid = useSelector(service, isEggLaid);

  const eggIsBrewing = happy || sleeping;
  const showEggProgress = chicken && !eating && !eggLaid && !hungry;
  const interactable = hungry || eggReady || eggLaid;

  // Popover is to indicate when player has no wheat or when wheat is not selected.
  const [showPopover, setShowPopover] = useState(false);
  const [showTimeToEgg, setShowTimeToEgg] = useState(false);
  const [showMutantModal, setShowMutantModal] = useState(false);

  const [collectingEgg, setCollectingEgg] = useState(false);

  const handleMouseEnter = () => {
    eggIsBrewing && setShowTimeToEgg(true);
  };

  const handleMouseLeave = () => {
    setShowTimeToEgg(false);
  };

  const handleClick = () => {
    if (hungry) {
      feed();
      return;
    }

    if (eggReady) {
      service.send("LAY");
      return;
    }

    if (eggLaid) {
      handleCollect();
      return;
    }
  };

  const feed = async () => {
    const currentWheatAmount = state.inventory.Wheat ?? new Decimal(0);
    const wheatRequired = getWheatRequiredToFeed(state.inventory);

    if (selectedItem !== "Wheat" || currentWheatAmount.lt(wheatRequired)) {
      setShowPopover(true);
      await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
      setShowPopover(false);
      return;
    }

    const {
      context: {
        state: { chickens },
      },
    } = gameService.send("chicken.feed", {
      index,
    });

    const chicken = chickens[index];

    service.send("FEED", {
      fedAt: chicken.fedAt,
    });

    setToast({
      icon: wheat,
      content: `-${wheatRequired}`,
    });
  };

  const handleCollect = () => {
    if (chicken.reward) {
      setShowMutantModal(true);
      return;
    }

    collectEgg();
  };

  const handleContinue = () => {
    setShowMutantModal(false);

    setToast({
      icon: ITEM_DETAILS[chicken.reward?.items[0].name].image,
      content: "+1",
    });

    collectEgg();
  };

  // do not show toast and reset chicken state while hoarding
  useEffect(() => {
    if (collectingEgg && !gameState.matches("hoarding")) {
      service.send("COLLECT");
    }

    setCollectingEgg(false);
  }, [collectingEgg]);

  const collectEgg = () => {
    gameService.send("chicken.collectEgg", {
      index,
    });

    setToast({
      icon: egg,
      content: `+${chicken.multiplier}`,
    });

    setCollectingEgg(true);
  };

  return (
    <>
      <div
        className={classNames("w-full h-full relative", {
          "cursor-pointer hover:img-highlight": interactable,
        })}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative pointer-events-none">
          {hungry && (
            <>
              <img
                src={chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <img
                src={hungryChicken}
                alt="hungry-chicken"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                  top: `${PIXEL_SCALE * -5}px`,
                  left: `${PIXEL_SCALE * 2}px`,
                }}
                className="absolute"
              />
              <img
                src={cancel}
                className={classNames("transition-opacity absolute z-20", {
                  "opacity-100": showPopover,
                  "opacity-0": !showPopover,
                })}
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                  top: `${PIXEL_SCALE * 8}px`,
                  left: `${PIXEL_SCALE * 4}px`,
                }}
              />
              <img
                src={wheat}
                className={classNames("transition-opacity absolute z-10", {
                  "opacity-100": showPopover,
                  "opacity-0": !showPopover,
                })}
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                  top: `${PIXEL_SCALE * 5}px`,
                  left: `${PIXEL_SCALE * 9}px`,
                }}
              />
            </>
          )}
          {eating && (
            <>
              <img
                src={wheatOnGround}
                alt="wheat-on-ground"
                className="absolute display-block"
                style={{
                  width: `${PIXEL_SCALE * 126}px`,
                  imageRendering: "pixelated",
                }}
              />
              <Spritesheet
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 32}px`,
                  top: `${PIXEL_SCALE * -9}px`,
                  left: `${PIXEL_SCALE * -7}px`,
                  imageRendering: "pixelated",
                }}
                image={walkingChickenSheet}
                widthFrame={32}
                heightFrame={32}
                fps={10}
                steps={50}
                direction={`forward`}
                autoplay={true}
                loop={true}
              />
            </>
          )}
          {happy && (
            <>
              <img
                src={chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <img
                src={happyChicken}
                alt="happy-chicken"
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                  top: `${PIXEL_SCALE * -6}px`,
                  left: `${PIXEL_SCALE * 2}px`,
                }}
              />
            </>
          )}
          {sleeping && (
            <>
              <img
                src={chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <img
                src={sleepingChicken}
                alt="sleeping-chicken"
                className="absolute"
                style={{
                  transformOrigin: "top left",
                  scale: "calc(19/16)",
                  width: `${PIXEL_SCALE * 16}px`,
                  top: `${PIXEL_SCALE * -8}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
            </>
          )}
          {eggReady && (
            <>
              <img
                src={chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <Spritesheet
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 17}px`,
                  top: `${PIXEL_SCALE * -16}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                  imageRendering: "pixelated",
                }}
                image={layingEggSheet}
                widthFrame={17}
                heightFrame={31}
                fps={3}
                steps={21}
                endAt={7}
                direction={`forward`}
                autoplay={true}
                loop={true}
              />
            </>
          )}
          {eggLaid && (
            <>
              <img
                src={chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <Spritesheet
                image={layingEggSheet}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 17}px`,
                  top: `${PIXEL_SCALE * -16}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                  imageRendering: "pixelated",
                }}
                widthFrame={17}
                heightFrame={31}
                fps={20}
                steps={21}
                direction={`forward`}
                autoplay={true}
                loop={false}
              />
            </>
          )}
        </div>
      </div>

      <TimeToEgg showTimeToEgg={showTimeToEgg} service={service} />
      {showEggProgress && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            top: `${PIXEL_SCALE * 14}px`,
          }}
        >
          <Bar percentage={percentageComplete} type="progress" />
        </div>
      )}
      {showMutantModal && (
        <MutantChickenModal
          show={showMutantModal}
          type={chicken.reward?.items[0].name as MutantChicken}
          onContinue={handleContinue}
          inventory={state.inventory}
        />
      )}
    </>
  );
};
