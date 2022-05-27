import { useActor, useInterpret, useSelector } from "@xstate/react";
import React, { useContext } from "react";

import hungryChicken from "assets/animals/chickens/hungry.gif";
import happyChicken from "assets/animals/chickens/happy.gif";
import layingEggChicken from "assets/animals/chickens/laying-egg.gif";
import walkingChicken from "assets/animals/chickens/walking.gif";
import sleepingChicken from "assets/animals/chickens/sleeping.gif";
import wheat from "assets/animals/chickens/wheat.png";
import eggReadyChicken from "assets/animals/chickens/egg-ready.png";
import { Context } from "features/game/GameProvider";
import { chickenMachine, MachineState } from "../chickenMachine";
import { Position } from "./Chickens";

interface Props {
  index: number;
  position: Position;
}

const isHungry = (state: MachineState) => state.matches("hungry");
const isEating = (state: MachineState) => state.matches({ fed: "eating" });
const isHappy = (state: MachineState) => state.matches({ fed: "happy" });
const isSleeping = (state: MachineState) => state.matches({ fed: "sleeping" });
const isWalking = (state: MachineState) => state.matches({ fed: "walking" });
const isLayingEgg = (state: MachineState) => state.matches("layingEgg");
const isEggReady = (state: MachineState) => state.matches("eggReady");

export const Chicken: React.FC<Props> = ({ index, position }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const service = useInterpret(chickenMachine);

  // Chicken machine states
  const hungry = useSelector(service, isHungry);
  const eating = useSelector(service, isEating);
  const happy = useSelector(service, isHappy);
  const sleeping = useSelector(service, isSleeping);
  const walking = useSelector(service, isWalking);
  const layingEgg = useSelector(service, isLayingEgg);
  const eggReady = useSelector(service, isEggReady);

  const feed = () => {
    gameService.send("chicken.feed", {
      index,
    });

    service.send("FEED");
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
        {hungry && (
          <img
            src={hungryChicken}
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
        {walking && (
          <img
            src={walkingChicken}
            alt="walking-chicken"
            className="w-16 h-16"
          />
        )}
        {layingEgg && (
          <img
            src={layingEggChicken}
            alt="laying-egg"
            className="absolute w-16 h-auto -top-7"
          />
        )}
        {eggReady && (
          <img
            src={eggReadyChicken}
            alt="egg-ready"
            className="absolute w-16 h-auto cursor-pointer hover:img-highlight -top-7"
            onClick={collectEgg}
          />
        )}
      </div>
    </div>
  );
};
