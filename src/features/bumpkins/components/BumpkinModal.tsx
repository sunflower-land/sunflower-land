import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import levelIcon from "assets/icons/level_up.png";
import close from "assets/icons/close.png";
import alert from "assets/icons/expression_alerted.png";

import progressBarSmall from "assets/ui/progress/transparent_bar_small.png";

import { Context } from "features/game/GameProvider";
import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import { DynamicNFT } from "./DynamicNFT";
import { InnerPanel, Panel } from "components/ui/Panel";
import {
  getBumpkinLevel,
  getExperienceToNextLevel,
  isMaxLevel,
} from "features/game/lib/level";
import { Achievements } from "./Achievements";
import { AchievementBadges } from "./AchievementBadges";
import { Skills } from "features/bumpkins/components/Skills";
import { CONFIG } from "lib/config";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SkillBadges } from "./SkillBadges";
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";

type ViewState = "home" | "achievements" | "skills";

const PROGRESS_BAR_DIMENSIONS = {
  width: 40,
  height: 7,
  innerWidth: 36,
  innerHeight: 2,
  innerTop: 2,
  innerLeft: 2,
};

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

  const experience = state.bumpkin?.experience ?? 0;
  const level = getBumpkinLevel(experience);
  const maxLevel = isMaxLevel(experience);
  const { currentExperienceProgress, experienceToNextLevel } =
    getExperienceToNextLevel(experience);

  const hasAvaliableSP = getAvailableBumpkinSkillPoints(state.bumpkin) > 0;

  const progressWidth = Math.min(
    Math.floor(
      (PROGRESS_BAR_DIMENSIONS.innerWidth * currentExperienceProgress) /
        experienceToNextLevel
    ),
    PROGRESS_BAR_DIMENSIONS.innerWidth
  );

  return (
    <Panel>
      <div className="flex flex-wrap">
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
        <div className="w-full sm:w-1/3 z-10 mr-0 sm:mr-2">
          <div className="w-full rounded-md overflow-hidden mb-1">
            <DynamicNFT
              showBackground
              bumpkinParts={state.bumpkin?.equipped as BumpkinParts}
            />
          </div>
          <div className="ml-1">
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
          <div className="mb-3">
            <div className="flex items-center ml-1 my-2">
              <img
                src={levelIcon}
                style={{
                  width: `${PIXEL_SCALE * 10}px`,
                  marginRight: `${PIXEL_SCALE * 4}px`,
                }}
              />
              <div>
                <p className="text-base">
                  Level {level}
                  {maxLevel ? " (Max)" : ""}
                </p>
                {/* Progress bar */}
                <div className="flex item-center mt-1">
                  <div
                    className="absolute"
                    style={{
                      width: `${PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.width}px`,
                    }}
                  >
                    <img
                      src={progressBarSmall}
                      className="absolute"
                      style={{
                        width: `${
                          PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.width
                        }px`,
                      }}
                    />
                    <div
                      className="absolute bg-[#193c3e]"
                      style={{
                        top: `${
                          PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerTop
                        }px`,
                        left: `${
                          PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft
                        }px`,
                        width: `${
                          PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerWidth
                        }px`,
                        height: `${
                          PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerHeight
                        }px`,
                      }}
                    />
                    <div
                      className="absolute bg-[#63c74d]"
                      style={{
                        top: `${
                          PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerTop
                        }px`,
                        left: `${
                          PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerLeft
                        }px`,
                        width: `${PIXEL_SCALE * progressWidth}px`,
                        height: `${
                          PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.innerHeight
                        }px`,
                      }}
                    />
                  </div>
                  <p
                    className="text-xxs mt-0.5"
                    style={{
                      marginLeft: `${
                        PIXEL_SCALE * PROGRESS_BAR_DIMENSIONS.width + 8
                      }px`,
                    }}
                  >{`${Math.floor(currentExperienceProgress)}/${Math.floor(
                    experienceToNextLevel
                  )} XP`}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mb-2 cursor-pointer"
            onClick={() => setView("skills")}
          >
            <InnerPanel className="relative mt-1 px-2 py-1">
              <div className="flex items-center mb-1 justify-between">
                <div className="flex items-center">
                  <span className="text-xs">Skills</span>
                  {hasAvaliableSP && !gameState.matches("visiting") && (
                    <img src={alert} className="h-4 ml-2" />
                  )}
                </div>
                <span className="text-xxs underline">View all</span>
              </div>
              <SkillBadges inventory={state.inventory} />
            </InnerPanel>
          </div>

          <div
            className="mb-2 cursor-pointer"
            onClick={() => setView("achievements")}
          >
            <InnerPanel className="relative mt-1 px-2 py-1">
              <div className="flex items-center mb-1 justify-between">
                <div className="flex items-center">
                  <span className="text-xs">Achievements</span>
                </div>
                <span className="text-xxs underline">View all</span>
              </div>
              <AchievementBadges achievements={state.bumpkin?.achievements} />
            </InnerPanel>
          </div>
        </div>
      </div>
    </Panel>
  );
};
