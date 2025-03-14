import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ButtonPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  TASKS,
  OTHER_WAYS_TO_EARN_SOCIAL_SPARK,
  Task,
  OtherTasks,
  SocialTaskName,
} from "features/game/events/landExpansion/completeSocialTask";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";

export const TaskBoard: React.FC = () => {
  const { t } = useAppTranslation();
  const [selectedTask, setSelectedTask] = useState<Task | OtherTasks>();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const loveTokenCount = useSelector(
    gameService,
    (state) => state.context.state.inventory["Social Spark"] ?? new Decimal(0),
  );
  const socialTasks = useSelector(
    gameService,
    (state) => state.context.state.socialTasks,
  );

  const isTaskCompleted = (taskId: SocialTaskName) =>
    !!socialTasks?.completed?.[taskId]?.completedAt;

  const completeTask = (taskId: SocialTaskName) => {
    gameService.send({
      type: "socialTask.completed",
      taskId,
    });
  };

  return (
    <div>
      {/* Tasks */}
      <div className="flex flex-col gap-2 m-1">
        <div className="flex justify-between gap-2">
          <Label type="default">{`Tasks`}</Label>
          <Label type="vibrant">{`Inventory: ${loveTokenCount} Social Spark`}</Label>
        </div>
        <div className="flex flex-col gap-2 text-xs mx-2">
          <p>{`Complete tasks to earn Social Spark.`}</p>
          <p>{`Social Spark can be used to purchase special items in the rewards shop`}</p>
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
                <Label type="vibrant" className="absolute right-1 top-1">
                  {`${task.reward?.["Social Spark"]} Social Spark`}
                </Label>
              </div>
            </ButtonPanel>
          ))}
        </div>
      </div>
      {/* Other ways to earn Social Spark */}
      <div className="flex flex-col gap-2 m-1">
        <Label type="default">{`Other ways to earn Social Spark`}</Label>

        <div className="flex flex-col gap-1 text-xs">
          {Object.values(OTHER_WAYS_TO_EARN_SOCIAL_SPARK).map((task) => (
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
            <div className="flex gap-2">
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
              <div className="flex flex-col h-20 items-center">
                <p>{selectedTask?.description}</p>
              </div>
            </div>
            {selectedTask &&
              "requirement" in selectedTask &&
              selectedTask.requirement(state) &&
              !isTaskCompleted(selectedTask.title as SocialTaskName) && (
                // TODO: Add complete condition
                <Button
                  onClick={() => {
                    completeTask(selectedTask.title as SocialTaskName);
                    setSelectedTask(undefined);
                  }}
                >
                  {`Complete`}
                </Button>
              )}
          </div>
        </CloseButtonPanel>
      </ModalOverlay>
    </div>
  );
};
