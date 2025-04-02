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
  SocialTaskName,
  isSocialTask,
  OtherTaskName,
  ALL_TASKS,
  isSocialTaskName,
} from "features/game/events/landExpansion/completeSocialTask";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { ReferralContent } from "./Referral";
import { Modal } from "components/ui/Modal";
import { getObjectEntries } from "features/game/expansion/lib/utils";

interface TaskBoardProps {
  state: GameState;
  completeTask: (taskId: SocialTaskName) => void;
  loveCharmCount: Decimal;
  socialTasks?: GameState["socialTasks"];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  state,
  completeTask,
  loveCharmCount,
  socialTasks,
}) => {
  const { t } = useAppTranslation();
  const [selectedTask, setSelectedTask] = useState<
    SocialTaskName | OtherTaskName
  >();
  const [showReferralModal, setShowReferralModal] = useState(false);

  const task = selectedTask && ALL_TASKS[selectedTask];

  const isTaskCompleted = (taskId: SocialTaskName): boolean =>
    !!socialTasks?.completed?.[taskId]?.completedAt;

  return (
    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto scrollable">
      {/* Tasks */}
      <div className="flex flex-col gap-2 m-1">
        <div className="flex justify-between gap-2 mr-1">
          <Label type="default">{t("taskBoard.tasks")}</Label>
          <Label
            type="default"
            secondaryIcon={ITEM_DETAILS["Love Charm"].image}
          >
            {t("taskBoard.loveCharmCount", { loveCharmCount })}
          </Label>
        </div>
        <div className="flex flex-col gap-2 text-xs mx-2">
          <p>{t("taskBoard.tasksDescription")}</p>
          <p>{t("taskBoard.tasksDescriptionTwo")}</p>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          {getObjectEntries(TASKS).map(([taskTitle, task]) => (
            <ButtonPanel
              key={taskTitle}
              onClick={() => setSelectedTask(taskTitle)}
            >
              <div className="flex gap-3">
                <img src={task.image} className="w-10" />
                <div className="flex flex-col gap-1">
                  <p>{task.title}</p>
                  <p className="underline">{t("read.more")}</p>
                </div>
                <Label
                  type={isTaskCompleted(taskTitle) ? "success" : "warning"}
                  icon={
                    isTaskCompleted(taskTitle)
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
      {/* Other ways to earn Love Charm */}
      <div className="flex flex-col gap-2 m-1">
        <Label type="default">{t("taskBoard.otherWays")}</Label>

        <div className="flex flex-col gap-1 text-xs">
          {getObjectEntries(OTHER_WAYS_TO_EARN_LOVE_CHARM).map(
            ([taskTitle, task]) => (
              <ButtonPanel
                key={task.title}
                onClick={() => setSelectedTask(taskTitle)}
              >
                <div className="flex gap-3">
                  <img src={task.image} className="w-10" />
                  <div className="flex flex-col gap-1">
                    <p>{task.title}</p>
                    <p className="underline">{t("read.more")}</p>
                  </div>
                </div>
              </ButtonPanel>
            ),
          )}
        </div>
      </div>
      {/* Details Modal */}
      <ModalOverlay
        show={!!selectedTask}
        onBackdropClick={() => setSelectedTask(undefined)}
      >
        <CloseButtonPanel title={task?.title} className="text-xs">
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
                <img src={task?.image} className="w-[50%]" />
              </div>
              <div className="flex flex-col justify-between w-full gap-3">
                <p>{task?.description}</p>
                {(selectedTask === "Refer a friend" ||
                  selectedTask === "Refer a VIP friend") && (
                  <p
                    className="text-xs underline hover:text-blue-500"
                    onClick={() => setShowReferralModal(true)}
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
                    {isSocialTaskName(selectedTask) &&
                      isTaskCompleted(selectedTask) && (
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
            {selectedTask &&
              isSocialTaskName(selectedTask) &&
              !isTaskCompleted(selectedTask) && (
                <Button
                  onClick={() => completeTask(selectedTask)}
                  disabled={
                    task && isSocialTask(task) && !task.requirement(state)
                  }
                >
                  {t("complete")}
                </Button>
              )}
          </div>
        </CloseButtonPanel>
      </ModalOverlay>
      <Modal
        show={showReferralModal}
        onHide={() => setShowReferralModal(false)}
      >
        <ReferralContent onHide={() => setShowReferralModal(false)} />
      </Modal>
    </div>
  );
};
