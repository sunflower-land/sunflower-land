import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ButtonPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  IN_GAME_TASKS,
  InGameTaskName,
  isSocialTask,
} from "features/game/events/landExpansion/completeSocialTask";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { useGame } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import promoteIcon from "assets/icons/promote.webp";
import tvIcon from "assets/icons/tv.webp";
import { secondsToString } from "lib/utils/time";

interface TaskBoardProps {
  state: GameState;
  loveCharmCount: Decimal;
  socialTasks?: GameState["socialTasks"];
}

const TaskButton: React.FC<{
  title: string;
  onClick: () => void;
  image: string;
  expiresAt?: Date;
}> = ({ image, onClick, title, expiresAt }) => {
  const { t } = useAppTranslation();
  return (
    <ButtonPanel key={title} onClick={onClick}>
      <div className="flex gap-3">
        <img src={image} className="w-10 h-auto object-contain" />
        <div className="flex flex-col gap-1">
          <p>{title}</p>

          <p className="underline">{t("read.more")}</p>
        </div>
      </div>
      {expiresAt && (
        <Label
          type="info"
          icon={SUNNYSIDE.icons.stopwatch}
          className="absolute -right-0 -bottom-0"
        >
          {`${secondsToString((expiresAt.getTime() - Date.now()) / 1000, {
            length: "short",
          })} left`}
        </Label>
      )}
    </ButtonPanel>
  );
};

export const TaskBoard: React.FC<TaskBoardProps> = ({
  state,
  loveCharmCount,
  socialTasks,
}) => {
  const { t } = useAppTranslation();
  const { openModal } = useContext(ModalContext);

  const [selectedTask, setSelectedTask] = useState<InGameTaskName>();

  const isTaskCompleted = (taskId: InGameTaskName): boolean =>
    !!socialTasks?.completed?.[taskId]?.completedAt;

  return (
    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto scrollable">
      <div className="px-1">
        <div className="flex justify-between gap-2 mb-1">
          <Label type="vibrant">{t("taskBoard.loveRush")}</Label>
        </div>
        <p className="text-xs mb-2">{t("taskBoard.limitedTimeDescription")}</p>

        <img src={SUNNYSIDE.announcement.loveRush} className="w-full mb-2" />
        <div className="flex justify-between gap-2 mb-2">
          <Label type="default">{t("taskBoard.howToEarn")}</Label>
        </div>
        <p className="text-xs">{t("taskBoard.earnDescription")}</p>
      </div>
      {/* Tasks */}
      <div className="flex flex-col gap-2 m-1">
        <div className="flex flex-col gap-1 text-xs">
          <TaskButton
            title={t("socialTask.helpBumpkins")}
            onClick={() => openModal("LOVE_RUSH")}
            image={SUNNYSIDE.icons.player}
            expiresAt={new Date("2025-05-04T00:00:00Z")}
          />

          <TaskButton
            title={t("socialTask.referFriend")}
            onClick={() => openModal("REFERRAL")}
            image={promoteIcon}
          />

          <TaskButton
            title={t("socialTask.discord")}
            onClick={() => openModal("DISCORD")}
            image={SUNNYSIDE.icons.discord}
          />

          <TaskButton
            title={t("socialTask.telegram")}
            onClick={() => openModal("TELEGRAM")}
            image={SUNNYSIDE.icons.telegram}
          />

          <TaskButton
            title={t("socialTask.twitter")}
            onClick={() => openModal("TWITTER")}
            image={SUNNYSIDE.icons.x}
          />

          <TaskButton
            title={t("socialTask.joinStream")}
            onClick={() => openModal("STREAMS")}
            image={tvIcon}
          />

          {getKeys(IN_GAME_TASKS).map((taskName) => {
            const task = IN_GAME_TASKS[taskName];
            return (
              <ButtonPanel
                key={task.title}
                onClick={() => setSelectedTask(taskName)}
              >
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
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      <ModalOverlay
        show={!!selectedTask && selectedTask in IN_GAME_TASKS}
        onBackdropClick={() => setSelectedTask(undefined)}
      >
        {selectedTask && selectedTask in IN_GAME_TASKS && (
          <InGameTask
            taskName={selectedTask as InGameTaskName}
            socialTasks={socialTasks}
            onClose={() => setSelectedTask(undefined)}
          />
        )}
      </ModalOverlay>
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

  const task = IN_GAME_TASKS[taskName];
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
