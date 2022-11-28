import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import femaleGoblin from "assets/npcs/goblin_female.gif";
import femaleHuman from "assets/npcs/human_female.gif";
import sword from "assets/sfts/quest/ancient_goblin_sword.png";
import warhammer from "assets/sfts/quest/ancient_human_warhammer.png";

import close from "assets/icons/close.png";
import stopwatch from "assets/icons/stopwatch.png";
import warBond from "assets/icons/warBond.png";

import { secondsToString } from "lib/utils/time";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { WarCollectionOffer as Offer } from "features/game/types/game";

import { WarCollectionOffer } from "./WarCollectionOffer";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { getWarBonds } from "features/game/events/buyWarBonds";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
  side: "human" | "goblin";
}
export const WarCollectors: React.FC<Props> = ({ onClose, side }) => {
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
    "noOffer" | "intro" | "ancientWeapon" | "showOffer" | "exchanged"
  >(warCollectionOffer ? "intro" : "noOffer");
  const { setToast } = useContext(ToastContext);

  const secondsLeft =
    (new Date(warCollectionOffer?.endAt as string).getTime() - Date.now()) /
    1000;

  const showOffer = () => {
    if (
      inventory["Ancient Goblin Sword"] ||
      inventory["Ancient Human Warhammer"]
    ) {
      setState("ancientWeapon");
    } else {
      setState("showOffer");
    }
  };

  const exchange = () => {
    const newstate = gameService.send("warBonds.bought");

    if (!newstate.matches("hoarding")) {
      warCollectionOffer?.ingredients?.map((ingredient) => {
        const item = ITEM_DETAILS[ingredient.name];
        setToast({
          icon: item.image,
          content: `-${ingredient.amount}`,
        });
      });

      const warBonds = getWarBonds(
        inventory,
        warCollectionOffer?.warBonds || 0
      );

      setToast({
        icon: warBond,
        content: `+${warBonds}`,
      });

      setState("exchanged");
    }
  };

  if (state === "exchanged") {
    return (
      <div className="flex flex-col items-center">
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <span>Thanks!</span>
        <img
          src={side === "human" ? femaleHuman : femaleGoblin}
          className="w-8"
        />
        <p className="sm:text-sm p-2">Together we will win the war.</p>
        <p className="sm:text-sm p-2">
          Visit the War Tent in Goblin Village to exchange your War Bonds for
          rare items!
        </p>
      </div>
    );
  }

  if (state === "noOffer") {
    return (
      <div className="flex flex-col items-center">
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <span>A war is coming...</span>
        <img
          src={side === "human" ? femaleHuman : femaleGoblin}
          className="w-8"
        />
      </div>
    );
  }

  if (state === "ancientWeapon") {
    return (
      <div className="flex flex-col items-center">
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <span>You are a warrior!</span>
        <img
          src={inventory["Ancient Goblin Sword"] ? sword : warhammer}
          className="w-16 my-1"
        />
        <p className="sm:text-sm p-2">
          I will give you bonus war tokens in exchange for resources
        </p>
        <Button onClick={() => setState("showOffer")}>{`Continue`}</Button>
      </div>
    );
  }

  if (state === "showOffer") {
    return (
      <WarCollectionOffer
        inventory={inventory}
        offer={warCollectionOffer as Offer}
        onCraft={exchange}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <img
        src={close}
        className="absolute cursor-pointer z-20"
        onClick={onClose}
        style={{
          top: `${PIXEL_SCALE * 6}px`,
          right: `${PIXEL_SCALE * 6}px`,
          width: `${PIXEL_SCALE * 11}px`,
        }}
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
          length: "medium",
        })} left`}</span>
      </span>
      <div className="flex justify-evenly w-full">
        <Button onClick={showOffer}>{`Continue`}</Button>
      </div>
    </div>
  );
};
