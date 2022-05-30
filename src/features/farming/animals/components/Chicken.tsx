import { useActor, useInterpret, useSelector } from "@xstate/react";
import React, { useContext } from "react";

import hungryActiveChicken from "assets/animals/chickens/hungry.gif";
import hungryStaticChicken from "assets/animals/chickens/hungry-static.png";
import happyActiveChicken from "assets/animals/chickens/happy.gif";
import happyStaticChicken from "assets/animals/chickens/happy-static.png";
import walkingChicken from "assets/animals/chickens/walking.gif";
import eggReadyChicken from "assets/animals/chickens/egg-ready.png";
import sleepingChicken from "assets/animals/chickens/sleeping.gif";
import layingEggSheet from "assets/animals/chickens/laying-egg-sheet.png";
import wheat from "assets/animals/chickens/wheat.png";
import { Context } from "features/game/GameProvider";
import { chickenMachine, MachineState } from "../chickenMachine";
import { Position } from "./Chickens";
import { getSecondsToEgg } from "features/game/events/collectEgg";
import Spritesheet from "components/animation/SpriteAnimator";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

interface Props {
  index: number;
  position: Position;
}

const isHungryActive = (state: MachineState) => state.matches("hungryActive");
const isHungryStatic = (state: MachineState) => state.matches("hungryStatic");
const isEating = (state: MachineState) => state.matches({ fed: "eating" });
const isHappyActive = (state: MachineState) =>
  state.matches({ fed: "happyActive" });
const isHappyStatic = (state: MachineState) =>
  state.matches({ fed: "happyStatic" });
const isSleeping = (state: MachineState) => state.matches({ fed: "sleeping" });
const isLayingEgg = (state: MachineState) => state.matches("layingEgg");
const isEggReady = (state: MachineState) => state.matches("eggReady");

export const Chicken: React.FC<Props> = ({ index, position }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const chicken = state.chickens[index];

  // useInterpret returns a static reference (to just the interpreted machine) which will not rerender when its state changes
  const service = useInterpret(chickenMachine, {
    devTools: true,
    // If chicken is already brewing an egg then add that to the chicken machine context
    ...(chicken && {
      context: { timeToEgg: getSecondsToEgg(chicken.fedAt), isFed: true },
    }),
  });

  // As per xstate docs:
  // To use a piece of state from the service inside a render, use the useSelector(...) hook to subscribe to it
  const hungryActive = useSelector(service, isHungryActive);
  const hungryStatic = useSelector(service, isHungryStatic);
  const eating = useSelector(service, isEating);
  const happyActive = useSelector(service, isHappyActive);
  const happyStatic = useSelector(service, isHappyStatic);
  const sleeping = useSelector(service, isSleeping);
  const layingEgg = useSelector(service, isLayingEgg);
  const eggReady = useSelector(service, isEggReady);

  const feed = () => {
    const {
      context: { state },
    } = gameService.send("chicken.feed", {
      index,
    });

    const chicken = state.chickens[index];

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
        {hungryActive && (
          <img
            src={hungryActiveChicken}
            alt="hungry-chicken"
            onClick={feed}
            className="w-16 h-16 cursor-pointer hover:img-highlight"
          />
        )}
        {hungryStatic && (
          <img
            src={hungryStaticChicken}
            alt="hungry-chicken"
            onClick={feed}
            className="w-16 h-16 cursor-pointer hover:img-highlight"
          />
        )}
        {eating && (
          <div className="relative w-16 h-16" id="test">
            <img
              src={wheat}
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
        {happyActive && (
          <img
            src={happyActiveChicken}
            alt="happy-chicken"
            className="absolute w-16 h-16"
          />
        )}
        {happyStatic && (
          <img
            src={happyStaticChicken}
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
        {layingEgg && (
          <Spritesheet
            className="absolute -top-7 cursor-pointer hover:img-highlight"
            style={{
              width: `${GRID_WIDTH_PX}px`,
              top: "-15px",
              left: "11px",
              imageRendering: "pixelated",
              transform: "scale(.9)",
            }}
            image={layingEggSheet}
            widthFrame={19}
            heightFrame={34}
            fps={10}
            steps={25}
            direction={`forward`}
            autoplay={true}
            onPause={() => service.send("LAID")}
          />
        )}
        {eggReady && (
          <img
            src={eggReadyChicken}
            alt="egg-ready"
            className="absolute w-16 h-auto cursor-pointer hover:img-highlight -top"
            onClick={collectEgg}
          />
        )}
        {/* <p style={{ fontSize: 10 }}>{index}</p> */}
      </div>
    </div>
  );
};
