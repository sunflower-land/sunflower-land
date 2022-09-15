import { useActor } from "@xstate/react";
import React, { useContext } from "react";

import heart from "assets/icons/heart.png";
import staminaIcon from "assets/icons/lightning.png";
import basket from "assets/icons/basket.png";

import progressBarSmall from "assets/ui/progress/transparent_bar_small.png";

import { Context } from "features/game/GameProvider";
import { BumpkinParts } from "features/game/types/bumpkin";
import { DynamicNFT, ITEM_IMAGES } from "./DynamicNFT";
import { Box } from "components/ui/Box";

export const BumpkinModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const equippedItems = Object.values(state.bumpkin?.equipped as BumpkinParts);

  return (
    <div className="flex">
      <div className="w-1/3 z-10 rounded-md mr-2 overflow-hidden">
        <DynamicNFT bumpkinParts={state.bumpkin?.equipped as BumpkinParts} />
      </div>
      <div className="flex-1">
        <div className="mb-2">
          <div className="flex items-center">
            <p className="text-sm">Level 3</p>
            <img src={heart} className="w-4 ml-1" />
          </div>
          <div className="flex items-center">
            <div className="flex mr-2 items-center relative w-20 z-10">
              <img src={progressBarSmall} className="w-full" />
              <div
                className="w-full h-full bg-[#262b45] absolute -z-20"
                style={{
                  borderRadius: "10px",
                }}
              />
              <div
                className="h-full bg-[#63c74d] absolute -z-10 "
                style={{
                  borderRadius: "10px 0 0 10px",
                  width: `${50}%`,
                }}
              />
            </div>
            <p className="text-xxs">50 XP/200 XP</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center">
            <p className="text-sm">Energy</p>
            <img src={staminaIcon} className="w-4 ml-1" />
          </div>
          <div className="flex items-center">
            <div className="flex items-center relative w-20 z-10 mr-2">
              <img src={progressBarSmall} className="w-full" />
              <div
                className="w-full h-full bg-[#262b45] absolute -z-20"
                style={{
                  borderRadius: "10px",
                }}
              />
              <div
                className="h-full bg-[#f3a632] absolute -z-10 "
                style={{
                  borderRadius: "10px 0 0 10px",
                  width: `${50}%`,
                }}
              />
            </div>
            <p className="text-xxs">20/30</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center">
            <p className="text-sm">Equipped</p>
            <img src={basket} className="w-4 ml-1" />
          </div>
          <div className="flex flex-wrap">
            {equippedItems.map((itemName) => (
              <Box image={ITEM_IMAGES[itemName]} key={itemName} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
