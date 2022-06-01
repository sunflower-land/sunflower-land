import { useActor, useInterpret, useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";
import classNames from "classnames";

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
  MachineState,
} from "../chickenMachine";
import { Position } from "./Chickens";
import { getSecondsToEgg } from "features/game/events/collectEgg";
import Spritesheet from "components/animation/SpriteAnimator";
import { POPOVER_TIME_MS } from "features/game/lib/constants";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import Decimal from "decimal.js-light";

interface Props {
  index: number;
  position: Position;
}

const isHungry = (state: MachineState) => state.matches("hungry");
const isEating = (state: MachineState) => state.matches({ fed: "eating" });
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

  const chickenContext: Partial<ChickenContext> = {
    timeToEgg: chicken && getSecondsToEgg(chicken.fedAt),
    isFed: true,
  };

  // useInterpret returns a static reference (to just the interpreted machine) which will not rerender when its state changes
  const service = useInterpret(chickenMachine, {
    // If chicken is already brewing an egg then add that to the chicken machine context
    ...(chicken && {
      context: chickenContext,
    }),
  });

  // As per xstate docs:
  // To use a piece of state from the service inside a render, use the useSelector(...) hook to subscribe to it
  const hungry = useSelector(service, isHungry);
  const eating = useSelector(service, isEating);
  const sleeping = useSelector(service, isSleeping);
  const happy = useSelector(service, isHappy);
  const eggReady = useSelector(service, isEggReady);
  const eggLaid = useSelector(service, isEggLaid);

  const [showPopover, setShowPopover] = useState(false);

  const feed = async () => {
    const wheatAmount = state.inventory.Wheat ?? new Decimal(0);

    if (selectedItem !== "Wheat" || wheatAmount.lt(1)) {
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
      timeToEgg: getSecondsToEgg(chicken.fedAt),
      isFed: true,
    });
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
        zIndex: index,
      }}
    >
      <div className="relative w-16 h-16">
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
            src={happyChicken}
            alt="happy-chicken"
            className="absolute w-16 h-16"
          />
        )}
        {sleeping && (
          <img
            src={sleepingChicken}
            alt="sleeping-chicken"
            className="absolute w-16 h-16 top-[2px]"
          />
        )}
        {/* {layingEgg && (
          <img
            src={layingEggChicken}
            alt="laying-egg"
            className="absolute w-16 cursor-pointer hover:img-highlight h-auto -top-7"
            onClick={collectEgg}
          />
        )} */}
        {eggReady && (
          <Spritesheet
            className="absolute cursor-pointer hover:img-highlight"
            style={{
              top: "-14px",
              left: "16px",
              imageRendering: "pixelated",
              // width: `${GRID_WIDTH_PX * 0.9}px`,
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
            onClick={collectEgg}
          />
        )}

        {/* <p style={{ fontSize: 10 }}>{index}</p> */}
      </div>
    </div>
  );
};
