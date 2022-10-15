import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import heart from "assets/icons/heart.png";
import staminaIcon from "assets/icons/lightning.png";
import close from "assets/icons/close.png";
import alert from "assets/icons/expression_alerted.png";

import progressBarSmall from "assets/ui/progress/transparent_bar_small.png";

import { Context } from "features/game/GameProvider";
import { BumpkinItems, BumpkinParts } from "features/game/types/bumpkin";
import { DynamicNFT } from "./DynamicNFT";
import { BUMPKIN_ITEMS } from "../types/BumpkinDetails";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import { Badges } from "features/farming/house/House";
import { getBumpkinLevel, LEVEL_BRACKETS } from "features/game/lib/level";
import { MAX_STAMINA } from "features/game/lib/constants";
import { formatNumber } from "lib/utils/formatNumber";
import { Achievements } from "./Achievements";
import { AchievementBadges } from "./AchievementBadges";
import { Skills } from "features/bumpkins/components/Skills";
import { hasUnacknowledgedSkillPoints } from "features/island/bumpkin/lib/skillPointStorage";

interface Props {
  onClose: () => void;
}

export const BumpkinModal: React.FC<Props> = ({ onClose }) => {
  const [view, setView] = useState<"home" | "achievements" | "skills">();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  if (view === "achievements") {
    return <Achievements onClose={() => setView("home")} />;
  }

  if (view === "skills") {
    return <Skills onClose={() => setView("home")} />;
  }

  // Do not show soul bound characteristics
  const { body, hair, background, ...wearables } = state.bumpkin
    ?.equipped as BumpkinParts;

  const equippedItems = Object.values(wearables) as BumpkinItems[];

  const experience = state.bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const nextLevelExperience = LEVEL_BRACKETS[level];

  const stamina = state.bumpkin?.stamina.value ?? 0;
  const staminaCapacity = MAX_STAMINA[level];

  const hasSkillPoint = hasUnacknowledgedSkillPoints(state.bumpkin);

  return (
    <Panel>
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
              Visit Bumpkin
            </a>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <div className="flex items-center mt-2 md:mt-0">
              <p className="text-sm">Level {level}</p>
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
                    width: `${(experience / nextLevelExperience) * 100}%`,
                    maxWidth: "100%",
                  }}
                />
              </div>
              <p className="text-xxs">{`${formatNumber(
                experience
              )}/${formatNumber(nextLevelExperience)} XP`}</p>
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
                    maxWidth: "100%",
                  }}
                />
              </div>
              <p className="text-xxs">{`${formatNumber(stamina)}/${formatNumber(
                staminaCapacity
              )}`}</p>
            </div>
          </div>

          <div className="mb-2">
            <InnerPanel className="relative mt-1 ">
              <div className="flex items-center  mb-1 justify-between">
                <div className="flex items-center">
                  <span className="text-xs text-shadow">Skills</span>
                  {hasSkillPoint && <img src={alert} className="h-4 ml-2" />}
                </div>
                <span
                  className="text-xxs underline cursor-pointer"
                  onClick={() => setView("skills")}
                >
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
                <span
                  className="text-xxs underline cursor-pointer"
                  onClick={() => setView("achievements")}
                >
                  View all
                </span>
              </div>
              <AchievementBadges achievements={state.bumpkin?.achievements} />
            </InnerPanel>
          </div>
        </div>
      </div>
    </Panel>
  );
};
