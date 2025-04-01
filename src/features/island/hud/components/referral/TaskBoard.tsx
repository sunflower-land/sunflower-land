import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ButtonPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  TASKS,
  OTHER_WAYS_TO_EARN_LOVE_CHARM,
  Task,
  OtherTasks,
  InGameTaskName,
  isSocialTask,
  OtherTaskName,
} from "features/game/events/landExpansion/completeSocialTask";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { Referral, ReferralContent } from "./Referral";
import { useGame } from "features/game/GameProvider";

const TASK_COMPONENTS: Record<
  InGameTaskName | OtherTaskName,
  React.FC<{ onClose: () => void }>
> = {
  "Upgrade to Petal Paradise": <div>Upgrade to Petal Paradise</div>,
  "Complete 50 deliveries": <div>Complete 50 deliveries</div>,
  "Refer a friend": <ReferralContent />,
};

interface TaskBoardProps {
  state: GameState;
  loveCharmCount: Decimal;
  socialTasks?: GameState["socialTasks"];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  state,
  loveCharmCount,
  socialTasks,
}) => {
  const { t } = useAppTranslation();
  const [selectedTask, setSelectedTask] = useState<Task | OtherTasks>();
  const [showReferralModal, setShowReferralModal] = useState(false);

  const isTaskCompleted = (taskId: InGameTaskName): boolean =>
    !!socialTasks?.completed?.[taskId]?.completedAt;

  return (
    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto scrollable">
      <div className="px-1">
        <div className="flex justify-between gap-2 mb-1">
          <Label type="vibrant">Love Rush</Label>

          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            3 hrs left
          </Label>
        </div>
        <p className="text-xs mb-2">
          For a limited time, complete Bumpkin deliveries, chores & gifts to
          earn Love Charms!
        </p>

        <img
          src={SUNNYSIDE.announcement.bullRunSeason}
          className="w-full mb-2"
        />
        <div className="flex justify-between gap-2 mb-2">
          <Label type="default">How to earn?</Label>
        </div>
        <p className="text-xs">Complete tasks to earn Love Charms & Rewards.</p>
      </div>
      {/* Tasks */}
      <div className="flex flex-col gap-2 m-1">
        <div className="flex flex-col gap-1 text-xs">
          {Object.values(OTHER_WAYS_TO_EARN_LOVE_CHARM).map((task) => (
            <ButtonPanel key={task.title} onClick={() => setSelectedTask(task)}>
              <div className="flex gap-3">
                <img src={task.image} className="w-10" />
                <div className="flex flex-col gap-1">
                  <p>{task.title}</p>
                  <p className="underline">{t("read.more")}</p>
                </div>
              </div>
            </ButtonPanel>
          ))}

          {Object.values(TASKS).map((task) => (
            <ButtonPanel key={task.title} onClick={() => setSelectedTask(task)}>
              <div className="flex gap-3">
                <img src={task.image} className="w-10" />
                <div className="flex flex-col gap-1">
                  <p>{task.title}</p>
                  <p className="underline">{t("read.more")}</p>
                </div>
                <Label
                  type={
                    isTaskCompleted(task.title as InGameTaskName)
                      ? "success"
                      : "warning"
                  }
                  icon={
                    isTaskCompleted(task.title as InGameTaskName)
                      ? SUNNYSIDE.icons.confirm
                      : task.requirement(state)
                        ? SUNNYSIDE.icons.expression_alerted
                        : undefined
                  }
                  secondaryIcon={ITEM_DETAILS["Love Charm"].image}
                  className="absolute right-1 top-1"
                >
                  <p className="text-xs">{`${task.reward?.["Love Charm"]}`}</p>
                </Label>
              </div>
            </ButtonPanel>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <ModalOverlay
        show={!!selectedTask}
        onBackdropClick={() => setSelectedTask(undefined)}
      ></ModalOverlay>
      <Referral
        show={showReferralModal}
        onHide={() => setShowReferralModal(false)}
      />
    </div>
  );
};

const InGameTask: React.FC<{
  taskName: InGameTaskName;
  socialTasks: GameState["socialTasks"];
  onClose: () => void;
}> = ({ taskName, socialTasks, onClose }) => {
  const { gameService, gameState } = useGame();
  const completeTask = (taskId: InGameTaskName) => {
    gameService.send({
      type: "socialTask.completed",
      taskId,
    });
  };

  const task = TASKS[taskName];
  const isTaskCompleted = (taskId: InGameTaskName): boolean =>
    !!socialTasks?.completed?.[taskId]?.completedAt;

  const state = gameState.context.state;

  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel title={task.title} className="text-xs">
      <div className="flex flex-col gap-2 m-1">
        <div className="flex flex-row gap-2">
          <div
            className="w-[40%] relative min-w-[40%] rounded-md overflow-hidden shadow-md mr-2 flex justify-center items-center h-32"
            style={{
              backgroundImage: `url(${SUNNYSIDE.ui.grey_background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img src={task.image} className="w-[50%]" />
          </div>
          <div className="flex flex-col justify-between w-full gap-3">
            <p>{task.description}</p>
            {(taskName === t("socialTask.referFriend") ||
              taskName === t("socialTask.referVipFriend")) && (
              <p
                className="text-xs underline hover:text-blue-500"
                onClick={onClose}
              >
                {t("taskBoard.howToRefer")}
              </p>
            )}
            {task && isSocialTask(task) && (
              <div className="flex flex-col gap-2 items-start">
                <RequirementLabel
                  type="other"
                  currentProgress={
                    task.requirementProgress?.(state) ??
                    (task.requirement(state) ? 1 : 0)
                  }
                  requirement={task.requirementTotal ?? 1}
                  hideIcon
                />
                {isTaskCompleted(taskName) && (
                  <Label
                    type="success"
                    icon={SUNNYSIDE.icons.confirm}
                    className="ml-1"
                  >
                    {t("completed")}
                  </Label>
                )}
              </div>
            )}
          </div>
        </div>
        {!isTaskCompleted(taskName) && (
          <Button
            onClick={() => completeTask(taskName)}
            disabled={
              !task.requirement(state) ||
              isTaskCompleted(task.title as InGameTaskName)
            }
          >
            {t("complete")}
          </Button>
        )}
      </div>
    </CloseButtonPanel>
  );
};
