import { ResizableBar } from "components/ui/ProgressBar";
import {
  ACHIEVEMENTS,
  AchievementName,
} from "features/game/types/achievements";
import { formatNumber } from "lib/utils/formatNumber";
import React, { useContext } from "react";
import { GUIDE_PATHS, GuidePath } from "../lib/guide";
import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onOpenGuide: (guide: GuidePath) => void;
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
  const { t } = useAppTranslation();
  const achievement = ACHIEVEMENTS()[task];
  const progress = achievement.progress(state);

  const progressPercentage =
    Math.min(1, progress / achievement.requirement) * 100;

  const guide = getKeys(GUIDE_PATHS).find((guide) =>
    GUIDE_PATHS[guide].achievements.includes(task),
  );
  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center">
          <img
            src={guide && GUIDE_PATHS[guide].icon}
            className="h-4 sm:h-5 mr-1 items-center"
          />
          <span className="text-xs sm:text-sm">{achievement.description}</span>
        </div>
        {onNeedHelp && (
          <div className="w-5" onClick={() => onNeedHelp(guide as GuidePath)}>
            <img
              src={SUNNYSIDE.icons.expression_confused}
              className="h-4 sm:h-5 ml-1 relative top-0.5"
            />
          </div>
        )}
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
          <span className="text-xs sm:text-sm ml-1">{`${formatNumber(progress)}/${formatNumber(achievement.requirement)}`}</span>
        </div>
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
                <span className="text-xs">{t("claim")}</span>
                <img src={chest} className="h-4 ml-1 relative top-0.5" />
              </div>
            </Button>
          )} */}
      </div>
    </>
  );
};
export const Task: React.FC<Props> = ({ onOpenGuide, task }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const state = gameState.context.state;

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
