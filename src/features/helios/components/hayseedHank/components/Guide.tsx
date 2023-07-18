import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import cake from "assets/sfts/cakes/carrot_cake.png";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import {
  ACHIEVEMENTS,
  Achievement,
  AchievementName,
} from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { SpeakingText } from "features/game/components/SpeakingModal";

type AchievementPath =
  | "gathering"
  | "building"
  | "crops"
  | "cooking"
  | "crafting"
  | "deliveries"
  | "animals"
  | "scavenger";

const ACHIEVEMENT_PATHS: Record<
  AchievementPath,
  { icon: string; achievements: AchievementName[] }
> = {
  building: {
    achievements: ["Explorer", "Apple of my Eye"],
    icon: SUNNYSIDE.icons.hammer,
  },
  gathering: {
    achievements: [],
    icon: SUNNYSIDE.tools.axe,
  },
  crops: {
    achievements: ["Bakers Dozen", "Cabbage King"],
    icon: SUNNYSIDE.icons.plant,
  },
  cooking: {
    achievements: [],
    icon: cake,
  },
  animals: {
    achievements: [],
    icon: cake,
  },
  crafting: {
    achievements: [],
    icon: cake,
  },
  deliveries: {
    achievements: [],
    icon: cake,
  },

  scavenger: {
    achievements: [],
    icon: SUNNYSIDE.resource.clam_shell,
  },
};

export const Guide: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const state = gameState.context.state;

  return (
    <div
      style={{ maxHeight: "300px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      {getKeys(ACHIEVEMENT_PATHS).map((path) => {
        const achievements = ACHIEVEMENT_PATHS[path].achievements;

        const activeAchievement = achievements.find((name) => {
          const achievement = ACHIEVEMENTS()[name];
          const progress = achievement.progress(state);
          const isComplete = progress >= achievement.requirement;

          return !isComplete;
        });

        return (
          <OuterPanel className="flex mb-2 p-1 w-full cursor-pointer  hover:bg-brown-200">
            <div className="flex-1">
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex">
                  <p className="text-sm  mr-1 capitalize ">{path}</p>
                  <img
                    src={ACHIEVEMENT_PATHS[path].icon}
                    className="h-5 mr-1"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex">
                  {achievements.map((name) => {
                    const achievement = ACHIEVEMENTS()[name];
                    const progress = achievement.progress(state);
                    const isComplete = progress >= achievement.requirement;
                    if (isComplete) {
                      return (
                        <img
                          src={SUNNYSIDE.icons.confirm}
                          className="h-3 mr-1"
                        />
                      );
                    }
                    return <img src={SUNNYSIDE.ui.dot} className="h-3 mr-1" />;
                  })}
                </div>
                <p className="text-xs underline mr-1 capitalize ">Read more</p>
              </div>

              {/* 
              {activeAchievement && (
                <Progress
                  achievement={ACHIEVEMENTS()[activeAchievement]}
                  state={state}
                  onClaim={console.log}
                />
              )}
              {!activeAchievement && (
                <div className="flex-1">
                  <p className="text-xs my-1">
                    {`You have mastered the ${path} profession!`}
                  </p>
                </div>
              )} */}
            </div>
          </OuterPanel>
        );
      })}
    </div>
  );
};
