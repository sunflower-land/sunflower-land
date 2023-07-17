import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
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

type AchievementPath = "expanding" | "planting";

const ACHIEVEMENT_PATHS: Record<AchievementPath, AchievementName[]> = {
  expanding: ["Explorer", "Apple of my Eye"],
  planting: ["Bakers Dozen", "Cabbage King"],
};

const Progress: React.FC<{
  achievement: Achievement;
  state: GameState;
  onClaim: () => void;
}> = ({ achievement, state, onClaim }) => {
  const progress = achievement.progress(state);
  const isComplete = progress >= achievement.requirement;

  const progressPercentage =
    Math.min(1, progress / achievement.requirement) * 100;

  return (
    <>
      <span className="text-xs mb-1">{achievement.description}</span>
      <div className="mt-0.5 flex flex-warp items-center justify-between">
        <div className="mt-0.5 flex items-center">
          <ResizableBar
            percentage={progressPercentage}
            type="progress"
            outerDimensions={{
              width: 30,
              height: 7,
            }}
          />
          <span className="text-xs ml-1">{`${setPrecision(
            new Decimal(progress)
          )}/${achievement.requirement}`}</span>
        </div>
        <Button disabled={!isComplete} className="w-24 h-7" onClick={onClaim}>
          <div className="flex items-center">
            <span className="text-xs">Claim</span>
            <img src={chest} className="h-4 ml-1 relative top-0.5" />
          </div>
        </Button>
      </div>
    </>
  );
};
export const HayseedHankAchievements: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const state = gameState.context.state;

  return (
    <div className="p-1">
      {getKeys(ACHIEVEMENT_PATHS).map((path) => {
        const achievements = ACHIEVEMENT_PATHS[path];

        const activeAchievement = ACHIEVEMENT_PATHS[path].find((name) => {
          const achievement = ACHIEVEMENTS()[name];
          const progress = achievement.progress(state);
          const isComplete = progress >= achievement.requirement;

          return !isComplete;
        });

        return (
          <OuterPanel className="flex mb-2">
            <div className="relative mr-2 h-12 w-12 flex justify-center items-center">
              <img
                src={SUNNYSIDE.icons.disc}
                className="absolute w-full h-full"
              />
              <img src={SUNNYSIDE.icons.hammer} className="h-8 z-10" />
            </div>
            {activeAchievement && (
              <div className="flex-1">
                <div className="flex mb-0.5 items-center justify-between w-full">
                  <p className="text-xs underline mr-2 capitalize ">{path}</p>
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
                      return (
                        <img src={SUNNYSIDE.ui.dot} className="h-3 mr-1" />
                      );
                    })}
                  </div>
                </div>
                <Progress
                  achievement={ACHIEVEMENTS()[activeAchievement]}
                  state={state}
                  onClaim={console.log}
                />
              </div>
            )}
            {!activeAchievement && (
              <div className="flex-1">
                <div className="flex mb-0.5 items-center justify-between w-full">
                  <p className="text-xs underline mr-2 ">Master Builder</p>
                </div>
                <span className="text-xs mb-1">
                  Congratulations, you have mastered this profession.
                </span>
              </div>
            )}
          </OuterPanel>
        );
      })}
    </div>
  );
};
