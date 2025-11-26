import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ButtonPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  IN_GAME_TASKS,
  InGameTaskName as taskName,
  isSocialTask,
  Task,
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
import giftIcon from "assets/icons/gift.png";
import flowerIcon from "assets/icons/flower_token.webp";
import { secondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import { SUNNYSIDE } from "assets/sunnyside";

interface TaskBoardProps {
  state: GameState;
  socialTasks?: GameState["socialTasks"];
}

const TaskButton: React.FC<{
  title: string;
  onClick: () => void;
  image: string;
  expiresAt?: Date;
  label?: string;
}> = ({ image, onClick, title, expiresAt, label }) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });

  return (
    <ButtonPanel key={title} onClick={onClick}>
      <div className="flex gap-3">
        <img src={image} className="w-10 h-auto object-contain" />
        <div className="flex flex-col gap-1">
          {label && (
            <Label type="warning" icon={giftIcon}>
              {label}
            </Label>
          )}
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
          {`${secondsToString((expiresAt.getTime() - now) / 1000, {
            length: "short",
          })} left`}
        </Label>
      )}
    </ButtonPanel>
  );
};

export const TaskBoard: React.FC<TaskBoardProps> = ({ state, socialTasks }) => {
  const { t } = useAppTranslation();
  const { openModal } = useContext(ModalContext);

  const [selectedTask, setSelectedTask] = useState<taskName>();

  const isTaskCompleted = (taskId: taskName): boolean =>
    !!socialTasks?.completed?.[taskId]?.completedAt;

  return (
    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto scrollable">
      <div className="px-1">
        <div className="flex justify-between gap-2 mb-2">
          <Label type="default">{t("taskBoard.howToEarn")}</Label>
        </div>
        <p className="text-xs">{t("taskBoard.earnDescription")}</p>
      </div>
      {/* Tasks */}
      <div className="flex flex-col gap-2 m-1">
        <div className="flex flex-col gap-1 text-xs">
          <TaskButton
            title={t("socialTask.twitter")}
            onClick={() => openModal("TWITTER")}
            image={SUNNYSIDE.icons.x}
          />
          <TaskButton
            title={t("socialTask.merkl")}
            onClick={() => openModal("MERKL")}
            image={flowerIcon}
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
            title={t("socialTask.joinStream")}
            onClick={() => openModal("STREAMS")}
            image={tvIcon}
          />

          {getKeys(IN_GAME_TASKS)
            // These have their own panels with descriptions
            .filter(
              (name) =>
                name !== "Link your Discord" && name !== "Link your Telegram",
            )
            .map((taskName) => {
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
                      type={isTaskCompleted(taskName) ? "success" : "warning"}
                      icon={
                        isTaskCompleted(taskName)
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
          <InGameTask taskName={selectedTask} socialTasks={socialTasks} />
        )}
      </ModalOverlay>
    </div>
  );
};

const InGameTask: React.FC<{
  taskName: taskName;
  socialTasks: GameState["socialTasks"];
}> = ({ taskName, socialTasks }) => {
  const { gameService, gameState } = useGame();
  const completeTask = (taskId: taskName) => {
    gameService.send({
      type: "socialTask.completed",
      taskId,
    });
  };

  const task = IN_GAME_TASKS[taskName] as Task;
  const isTaskCompleted = (taskId: taskName): boolean =>
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

            {task && isSocialTask(task) && (
              <div className="flex flex-col gap-2 items-start">
                <RequirementLabel
                  type="other"
                  currentProgress={
                    task.currentProgress
                      ? task.currentProgress(state)
                      : task.requirement(state)
                        ? 1
                        : 0
                  }
                  requirement={task.requirementTotal}
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
            disabled={!task.requirement(state) || isTaskCompleted(taskName)}
          >
            {t("complete")}
          </Button>
        )}
      </div>
    </CloseButtonPanel>
  );
};
