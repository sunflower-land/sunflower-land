import { useActor, useInterpret, useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";
import classNames from "classnames";
import debounce from "lodash.debounce";

import hungryChicken from "assets/animals/chickens/hungry.gif";
import happyChicken from "assets/animals/chickens/happy.gif";
import walkingChicken from "assets/animals/chickens/walking.gif";
import sleepingChicken from "assets/animals/chickens/sleeping.gif";
import layingEggSheet from "assets/animals/chickens/laying-egg-sheet.png";
import wheatOnGround from "assets/animals/chickens/wheat.png";
import cancel from "assets/icons/cancel.png";
import wheat from "assets/crops/wheat/crop.png";
import egg from "assets/resources/egg.png";

import { Context } from "features/game/GameProvider";
import {
  ChickenContext,
  chickenMachine,
  MachineInterpreter,
  MachineState,
} from "../chickenMachine";
import Spritesheet from "components/animation/SpriteAnimator";
import {
  CHICKEN_TIME_TO_EGG,
  POPOVER_TIME_MS,
} from "features/game/lib/constants";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import Decimal from "decimal.js-light";
import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import { secondsToMidString } from "lib/utils/time";
import { MutantChickenModal } from "./MutantChickenModal";
import { MutantChicken } from "features/game/types/craftables";
import { ChickenPosition } from "features/game/types/game";
import { getWheatRequiredToFeed } from "features/game/events/feedChicken";

interface Props {
  index: number;
  position: ChickenPosition;
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
        "transition-opacity scale-90 absolute whitespace-nowrap sm:opacity-0 bottom-5 w-fit left-10 z-20 pointer-events-none",
        {
          "opacity-100": showTimeToEgg,
          "opacity-0": !showTimeToEgg,
        }
      )}
    >
      <div className="text-[8px] text-white mx-1">
        <span>
          {secondsToMidString(context.timeToEgg - context.timeElapsed)}
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

export const Chicken: React.FC<Props> = ({ index, position }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { setToast } = useContext(ToastContext);

  const chicken = state.chickens[index];

  const percentageComplete = getPercentageComplete(chicken?.fedAt);

  const chickenContext: Partial<ChickenContext> | undefined = chicken && {
    fedAt: chicken.fedAt,
  };

  // useInterpret returns a static reference (to just the interpreted machine) which will not rerender when its state changes
  const service = useInterpret(chickenMachine, {
    // If chicken is already brewing an egg then add that to the chicken machine context
    context: chickenContext,
  }) as MachineInterpreter;

  // As per xstate docs:
  // To use a piece of state from the service inside a render, use the useSelector(...) hook to subscribe to it
  const hungry = useSelector(service, isHungry);
  const eating = useSelector(service, isEating);
  const sleeping = useSelector(service, isSleeping);
  const happy = useSelector(service, isHappy);
  const eggReady = useSelector(service, isEggReady);
  const eggLaid = useSelector(service, isEggLaid);

  const eggIsBrewing = happy || sleeping;
  const showEggProgress = chicken && !eating && !eggLaid;

  // Popover is to indicate when player has no wheat or when wheat is not selected.
  const [showPopover, setShowPopover] = useState(false);
  const [showTimeToEgg, setShowTimeToEgg] = useState(false);
  const [showMutantModal, setShowMutantModal] = useState(false);

  const debouncedHandleMouseEnter = debounce(
    () => eggIsBrewing && setShowTimeToEgg(true),
    300
  );

  const handleMouseLeave = () => {
    setShowTimeToEgg(false);

    debouncedHandleMouseEnter.cancel();
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
    collectEgg();
  };

  const collectEgg = () => {
    gameService.send("chicken.collectEgg", {
      index,
    });

    service.send("COLLECT");

    setToast({
      icon: egg,
      content: `+${chicken.multiplier}`,
    });
  };

  return (
    <div
      className="absolute"
      style={{
        right: position.right,
        top: position.top,
      }}
    >
      <div className="relative w-16 h-16" style={{ zIndex: index }}>
        {hungry && (
          <>
            <img
              src={hungryChicken}
              alt="hungry-chicken"
              onClick={feed}
              className="absolute w-16 h-16 cursor-pointer hover:img-highlight"
            />
            <div
              className={classNames(
                "transition-opacity absolute z-20 pointer-events-none ",
                {
                  "opacity-100": showPopover,
                  "opacity-0": !showPopover,
                }
              )}
              style={{
                top: "18px",
                left: "29px",
                transform: "translateX(-50%)",
              }}
            >
              <img className="w-3" src={cancel} />
            </div>
            <div
              className={classNames(
                "transition-opacity absolute z-10 pointer-events-none ",
                {
                  "opacity-100": showPopover,
                  "opacity-0": !showPopover,
                }
              )}
              style={{
                top: "8px",
                left: "35px",
                transform: "translateX(-50%)",
              }}
            >
              <img className="w-5" src={wheat} />
            </div>
          </>
        )}
        {eating && (
          <div className="relative w-16 h-16" id="test">
            <img
              src={wheatOnGround}
              alt="wheat-on-ground"
              className="absolute w-16 top-8 -left-[6px]"
            />
            <img
              src={walkingChicken}
              alt="eating-chicken"
              className="absolute w-16 h-16"
              style={{ zIndex: 10 * index }}
            />
          </div>
        )}
        {happy && (
          <img
            onMouseEnter={debouncedHandleMouseEnter}
            onMouseLeave={handleMouseLeave}
            src={happyChicken}
            alt="happy-chicken"
            className="absolute w-16 h-16"
          />
        )}
        {sleeping && (
          <img
            onMouseEnter={debouncedHandleMouseEnter}
            onMouseLeave={handleMouseLeave}
            src={sleepingChicken}
            alt="sleeping-chicken"
            className="absolute w-16 h-16 top-[2px]"
          />
        )}
        {eggReady && (
          <Spritesheet
            className="absolute cursor-pointer hover:img-highlight"
            style={{
              top: "-14px",
              left: "16px",
              imageRendering: "pixelated",
            }}
            image={layingEggSheet}
            widthFrame={34}
            heightFrame={62}
            fps={3}
            steps={21}
            endAt={7}
            direction={`forward`}
            autoplay={true}
            loop={true}
            onClick={() => service.send("LAY")}
          />
        )}
        {eggLaid && (
          <Spritesheet
            image={layingEggSheet}
            className="absolute cursor-pointer hover:img-highlight"
            style={{
              top: "-14px",
              left: "16px",
              imageRendering: "pixelated",
            }}
            widthFrame={34}
            heightFrame={62}
            fps={20}
            steps={21}
            direction={`forward`}
            autoplay={true}
            loop={false}
            onClick={handleCollect}
          />
        )}
      </div>
      {eggIsBrewing && showTimeToEgg && (
        <TimeToEgg showTimeToEgg={showTimeToEgg} service={service} />
      )}
      {showEggProgress && (
        <div
          className="absolute w-2/5 bottom-1 left-4"
          style={{ zIndex: index + 1 }}
        >
          <Bar
            percentage={percentageComplete}
            seconds={CHICKEN_TIME_TO_EGG / 1000}
          />
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
    </div>
  );
};
