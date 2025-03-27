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
  SocialTaskName,
  isSocialTask,
} from "features/game/events/landExpansion/completeSocialTask";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { Referral } from "./Referral";

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
  const [selectedTask, setSelectedTask] = useState<Task | OtherTasks>();
  const [showReferralModal, setShowReferralModal] = useState(false);

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
                    isTaskCompleted(task.title as SocialTaskName)
                      ? "success"
                      : "warning"
                  }
                  icon={
                    isTaskCompleted(task.title as SocialTaskName)
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
        </div>
      </div>
      {/* Details Modal */}
      <ModalOverlay
        show={!!selectedTask}
        onBackdropClick={() => setSelectedTask(undefined)}
      >
        <CloseButtonPanel title={selectedTask?.title} className="text-xs">
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
                <img src={selectedTask?.image} className="w-[50%]" />
              </div>
              <div className="flex flex-col justify-between w-full gap-3">
                <p>{selectedTask?.description}</p>
                {(selectedTask?.title === t("socialTask.referFriend") ||
                  selectedTask?.title === t("socialTask.referVipFriend")) && (
                  <p
                    className="text-xs underline hover:text-blue-500"
                    onClick={() => setShowReferralModal(true)}
                  >
                    {t("taskBoard.howToRefer")}
                  </p>
                )}
                {selectedTask && isSocialTask(selectedTask) && (
                  <div className="flex flex-col gap-2 items-start">
                    <RequirementLabel
                      type="other"
                      currentProgress={
                        selectedTask.requirementProgress?.(state) ??
                        (selectedTask.requirement(state) ? 1 : 0)
                      }
                      requirement={selectedTask.requirementTotal ?? 1}
                      hideIcon
                    />
                    {isTaskCompleted(selectedTask.title as SocialTaskName) && (
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
              isSocialTask(selectedTask) &&
              !isTaskCompleted(selectedTask.title as SocialTaskName) && (
                <Button
                  onClick={() =>
                    completeTask(selectedTask.title as SocialTaskName)
                  }
                  disabled={
                    !selectedTask.requirement(state) ||
                    isTaskCompleted(selectedTask.title as SocialTaskName)
                  }
                >
                  {t("complete")}
                </Button>
              )}
          </div>
        </CloseButtonPanel>
      </ModalOverlay>
      <Referral
        show={showReferralModal}
        onHide={() => setShowReferralModal(false)}
      />
    </div>
  );
};
