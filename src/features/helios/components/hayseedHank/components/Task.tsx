import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import Decimal from "decimal.js-light";
import {
  ACHIEVEMENTS,
  AchievementName,
} from "features/game/types/achievements";
import { setPrecision } from "lib/utils/formatNumber";
import React from "react";
import { GUIDE_PATHS, GuidePath } from "../lib/guide";
import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  onOpenGuide: (guide: GuidePath) => void;
  state: GameState;
  task?: AchievementName;
}

interface GuideTaskProps {
  state: GameState;
  task: AchievementName;
  onNeedHelp?: (guide: GuidePath) => void;
}
export const GuideTask: React.FC<GuideTaskProps> = ({
  state,
  task,
  onNeedHelp,
}) => {
  const achievement = ACHIEVEMENTS()[task];
  const progress = achievement.progress(state);
  const isComplete = progress >= achievement.requirement;

  const progressPercentage =
    Math.min(1, progress / achievement.requirement) * 100;

  const guide = getKeys(GUIDE_PATHS).find((guide) =>
    GUIDE_PATHS[guide].achievements.includes(task)
  );
  return (
    <>
      <div className="flex">
        <img
          src={guide && GUIDE_PATHS[guide].icon}
          className="h-6 img-highlight mr-1 items-center"
        />
        <span className="text-sm mb-1">{achievement.description}</span>
      </div>
      <div className="mt-0.5 flex flex-warp items-center justify-between">
        <div className="flex items-center h-8">
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
        {onNeedHelp && (
          <Button
            className="w-32 h-8"
            onClick={() => onNeedHelp(guide as GuidePath)}
          >
            <div className="flex items-center">
              <span className="text-xs">Need help</span>
              <img
                src={SUNNYSIDE.icons.expression_confused}
                className="h-4 ml-1 relative top-0.5"
              />
            </div>
          </Button>
        )}
        {/* {!onNeedHelp &&
          (achievement.sfl.gt(0) ||
            getKeys(achievement.rewards ?? {}).length > 0) && (
            <Button
              // disabled={!isComplete}
              disabled // TODO
              className="w-32 h-8"
              onClick={console.log}
            >
              <div className="flex items-center">
                <span className="text-xs">Claim</span>
                <img src={chest} className="h-4 ml-1 relative top-0.5" />
              </div>
            </Button>
          )} */}
      </div>
    </>
  );
};
export const Task: React.FC<Props> = ({ onOpenGuide, state, task }) => {
  if (!task) {
    return (
      <div className="p-2">
        <p>{`Wow, you've mastered all of your tasks!`}</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <GuideTask
        state={state}
        task={task}
        onNeedHelp={(guide) => onOpenGuide(guide)}
      />
    </div>
  );
};
