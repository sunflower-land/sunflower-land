import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import Decimal from "decimal.js-light";
import { AchievementDetails } from "features/bumpkins/components/AchievementDetails";
import { Context } from "features/game/GameProvider";
import { ACHIEVEMENTS } from "features/game/types/achievements";
import { setPrecision } from "lib/utils/formatNumber";
import React, { useContext } from "react";
import chest from "assets/icons/chest.png";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

export const Task: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const achievement = ACHIEVEMENTS()["20/20 Vision"];
  const progress = achievement.progress(gameState.context.state);
  const isComplete = progress >= achievement.requirement;

  const progressPercentage =
    Math.min(1, progress / achievement.requirement) * 100;

  return (
    <div className="p-2">
      <div className="flex">
        <img
          src={CROP_LIFECYCLE.Carrot.crop}
          className="h-6 img-highlight mr-1 items-center"
        />
        <span className="text-sm mb-1">{achievement.description}</span>
      </div>
      <div className="mt-0.5 flex flex-warp items-center justify-between">
        <div className="flex items-center">
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
        <Button
          disabled={!isComplete}
          className="w-32 h-8"
          onClick={console.log}
        >
          <div className="flex items-center">
            <span className="text-xs">Complete</span>
            <img src={chest} className="h-4 ml-1 relative top-0.5" />
          </div>
        </Button>
      </div>
      <span className="underline text-xxs cursor-pointer">Need help?</span>
    </div>
  );
};
