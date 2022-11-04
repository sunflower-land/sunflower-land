import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import heart from "assets/icons/heart.png";
import close from "assets/icons/close.png";
import alert from "assets/icons/expression_alerted.png";

import progressBarSmall from "assets/ui/progress/transparent_bar_small.png";

import { Context } from "features/game/GameProvider";
import {
  BumpkinItem,
  Equipped as BumpkinParts,
} from "features/game/types/bumpkin";
import { DynamicNFT } from "./DynamicNFT";
import { InnerPanel, Panel } from "components/ui/Panel";
import { Badges } from "features/farming/house/House";
import {
  BumpkinLevel,
  getBumpkinLevel,
  LEVEL_BRACKETS,
} from "features/game/lib/level";
import { formatNumber } from "lib/utils/formatNumber";
import { Achievements } from "./Achievements";
import { AchievementBadges } from "./AchievementBadges";
import { Skills } from "features/bumpkins/components/Skills";
import { hasUnacknowledgedSkillPoints } from "features/island/bumpkin/lib/skillPointStorage";
import { CONFIG } from "lib/config";

type ViewState = "home" | "achievements" | "skills";

interface Props {
  initialView: ViewState;
  onClose: () => void;
}

export const BumpkinModal: React.FC<Props> = ({ initialView, onClose }) => {
  const [view, setView] = useState<ViewState>(initialView);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const getVisitBumpkinUrl = () => {
    if (gameState.matches("visiting")) {
      const baseUrl =
        CONFIG.NETWORK === "mainnet"
          ? `https://opensea.io/assets/matic`
          : `https://testnets.opensea.io/assets/mumbai`;

      return `${baseUrl}/${CONFIG.BUMPKIN_CONTRACT}/${state.bumpkin?.id}`;
    }

    const baseUrl =
      CONFIG.NETWORK === "mainnet"
        ? `https://bumpkins.io/#/bumpkins`
        : `https://testnet.bumpkins.io/#/bumpkins`;

    return `${baseUrl}/${state.bumpkin?.id}`;
  };

  if (view === "achievements") {
    return <Achievements onBack={() => setView("home")} onClose={onClose} />;
  }

  if (view === "skills") {
    return <Skills onBack={() => setView("home")} onClose={onClose} />;
  }

  // Do not show soul bound characteristics
  const { body, hair, background, ...wearables } = state.bumpkin
    ?.equipped as BumpkinParts;

  const equippedItems = Object.values(wearables) as BumpkinItem[];

  const experience = state.bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const nextLevelExperience = LEVEL_BRACKETS[level];
  const previousLevelExperience = LEVEL_BRACKETS[(level - 1) as BumpkinLevel];

  const currentExperienceProgress = experience - previousLevelExperience;
  const experienceToNextLevel = nextLevelExperience - previousLevelExperience;

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
            <a
              href={getVisitBumpkinUrl()}
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
                    width: `${
                      (currentExperienceProgress / experienceToNextLevel) * 100
                    }%`,
                    maxWidth: "100%",
                  }}
                />
              </div>
              <p className="text-xxs">{`${formatNumber(
                currentExperienceProgress
              )}/${formatNumber(experienceToNextLevel)} XP`}</p>
            </div>
          </div>

          <div className="mb-2">
            <InnerPanel className="relative mt-1 ">
              <div className="flex items-center  mb-1 justify-between">
                <div className="flex items-center">
                  <span className="text-xs">Skills</span>
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
                  <span className="text-xs">Achievements</span>
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
