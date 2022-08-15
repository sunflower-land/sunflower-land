import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import femaleGoblin from "assets/npcs/goblin_female.gif";
import femaleHuman from "assets/npcs/human_female.gif";
import close from "assets/icons/close.png";
import stopwatch from "assets/icons/stopwatch.png";

import { secondsToString } from "lib/utils/time";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { WarCollectionOffer as Offer } from "features/game/types/game";

import { WarCollectionOffer } from "./WarCollectionOffer";

interface Props {
  onClose: () => void;
}
export const WarCollectors: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: {
        state: { inventory, warCollectionOffer },
      },
    },
  ] = useActor(gameService);
  console.log({ warCollectionOffer });

  const [state, setState] = useState<
    "noOffer" | "intro" | "showOffer" | "exchanged"
  >(warCollectionOffer ? "intro" : "noOffer");

  const side: "goblin" | "human" = "human";

  const secondsLeft = 100;

  const exchange = () => {
    setState("exchanged");
  };

  if (state === "exchanged") {
    return (
      <div className="flex flex-col items-center">
        <img
          src={close}
          className="h-6 top-4 right-4 absolute cursor-pointer z-10"
          onClick={onClose}
        />
        <span>Thankyou for supporting the war effort.</span>
        <img
          src={side === "human" ? femaleHuman : femaleGoblin}
          className="w-8"
        />
      </div>
    );
  }

  if (state === "noOffer") {
    return (
      <div className="flex flex-col items-center">
        <img
          src={close}
          className="h-6 top-4 right-4 absolute cursor-pointer z-10"
          onClick={onClose}
        />
        <span>A war is coming...</span>
        <img
          src={side === "human" ? femaleHuman : femaleGoblin}
          className="w-8"
        />
      </div>
    );
  }

  if (state === "showOffer") {
    return (
      <WarCollectionOffer
        inventory={inventory}
        offer={warCollectionOffer as Offer}
        onCraft={exchange}
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <img
        src={close}
        className="h-6 top-4 right-4 absolute cursor-pointer z-10"
        onClick={onClose}
      />
      <span>Help us win the war!</span>
      <img
        src={side === "human" ? femaleHuman : femaleGoblin}
        className="w-8"
      />

      <p className="sm:text-sm p-2">
        Our warriors need resources to crush the enemy.
      </p>
      <p className="sm:text-sm p-2">
        I will provide you with war bonds for a limited time.
      </p>
      <span className="bg-blue-600 border flex text-[8px] sm:text-xxs items-center p-[3px] rounded-md whitespace-nowrap  mb-2">
        <img src={stopwatch} className="w-3 left-0 -top-4 mr-1" />
        <span className="mt-[2px]">{`${secondsToString(secondsLeft as number, {
          separator: " ",
        })} left`}</span>
      </span>
      <Button onClick={() => setState("showOffer")}>{`Continue`}</Button>
    </div>
  );
};
