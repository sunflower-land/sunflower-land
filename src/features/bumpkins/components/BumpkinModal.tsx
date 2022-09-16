import { useActor } from "@xstate/react";
import React, { useContext } from "react";

import heart from "assets/icons/heart.png";
import staminaIcon from "assets/icons/lightning.png";
import close from "assets/icons/close.png";
import alert from "assets/icons/expression_alerted.png";

import progressBarSmall from "assets/ui/progress/transparent_bar_small.png";

import { Context } from "features/game/GameProvider";
import { BumpkinItems, BumpkinParts } from "features/game/types/bumpkin";
import { DynamicNFT } from "./DynamicNFT";
import { BUMPKIN_ITEMS } from "../types/BumpkinDetails";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Badges } from "features/farming/house/House";

interface Props {
  onClose: () => void;
}

export const BumpkinModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  // Do not show soul bound characteristics
  const { eyes, mouth, body, hair, background, ...wearables } = state.bumpkin
    ?.equipped as BumpkinParts;

  const equippedItems = Object.values(wearables) as BumpkinItems[];

  // TODO
  const level = 2;
  const experience = 30;
  const level2Experience = 50;

  const stamina = 3;
  const staminaCapacity = 12;
  const hasSkillPoint = true;

  return (
    <div className="flex flex-wrap ">
      <img
        src={close}
        className="absolute w-6 top-4 right-4 cursor-pointer z-20"
        onClick={onClose}
      />
      <div className="w-full sm:w-1/3 z-10 md:mr-4">
        <div className="w-full rounded-md overflow-hidden mb-1">
          <DynamicNFT
            showBackground
            bumpkinParts={state.bumpkin?.equipped as BumpkinParts}
          />
        </div>
        <div>
          <div className="mb-1 md:mb-0">
            <OuterPanel className="relative mt-1 ">
              <div className="flex items-center  mb-1">
                <span className="text-xs text-shadow">Equipped</span>
              </div>
              <div className="flex flex-wrap">
                {equippedItems.map((itemName) => (
                  <img
                    src={BUMPKIN_ITEMS[itemName].shopImage}
                    key={itemName}
                    className="h-6 w-6 object-contain mr-1"
                  />
                ))}
              </div>
            </OuterPanel>
          </div>
          <a
            href="https://testnet.bumpkins.io/#/bumpkins/1"
            target="_blank"
            className="underline text-xxs"
            rel="noreferrer"
          >
            Bumpkin Shop
          </a>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-2">
          <div className="flex items-center mt-2 md:mt-0">
            <p className="text-sm">Level 3</p>
            <img src={heart} className="w-4 ml-1" />
          </div>
          <div className="flex items-center">
            <div className="flex mr-2 items-center relative w-20 z-10">
              <img src={progressBarSmall} className="w-full" />
              <div
                className="w-full h-full bg-[#193c3e] absolute -z-20"
                style={{
                  borderRadius: "10px",
                }}
              />
              <div
                className="h-full bg-[#63c74d] absolute -z-10 "
                style={{
                  borderRadius: "10px 0 0 10px",
                  width: `${(experience / level2Experience) * 100}%`,
                }}
              />
            </div>
            <p className="text-xxs">{`${experience}/${level2Experience} XP`}</p>
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
                className="w-full h-full bg-[#322107] absolute -z-20"
                style={{
                  borderRadius: "10px",
                }}
              />
              <div
                className="h-full bg-[#f3a632] absolute -z-10 "
                style={{
                  borderRadius: "10px 0 0 10px",
                  width: `${(stamina / staminaCapacity) * 100}%`,
                }}
              />
            </div>
            <p className="text-xxs">{`${stamina}/${staminaCapacity}`}</p>
          </div>
        </div>

        <div className="mb-2">
          <InnerPanel className="relative mt-1 ">
            <div className="flex items-center  mb-1 justify-between">
              <div className="flex items-center">
                <span className="text-xs text-shadow">Skills</span>
                {hasSkillPoint && <img src={alert} className="h-4 ml-2" />}
              </div>
              <span className="text-xxs underline cursor-pointer">
                View all
              </span>
            </div>
            <Badges inventory={state.inventory} />
          </InnerPanel>
        </div>

        <div className="mb-2">
          <InnerPanel className="relative mt-1 ">
            <div className="flex items-center  mb-1 justify-between">
              <div className="flex items-center">
                <span className="text-xs text-shadow">Achievements</span>
              </div>
              <span className="text-xxs underline cursor-pointer">
                View all
              </span>
            </div>
            <p className="text-xxs">No achievements.</p>
          </InnerPanel>
        </div>
      </div>
    </div>
  );
};
