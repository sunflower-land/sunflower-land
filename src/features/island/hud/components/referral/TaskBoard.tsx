import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ButtonPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";

type Task = {
  title: string;
  description: string;
  image: string;
  reward?: Partial<Record<InventoryItemName, number>>;
};

const TASKS: Task[] = [
  {
    title: "Invite a friend",
    description: "Invite a friend to join the game",
    image: SUNNYSIDE.icons.player,
    reward: { "Social Spark": 15 },
  },
  {
    title: "Link your Discord",
    description: "Link your Discord to your account",
    image: SUNNYSIDE.icons.discord,
    reward: { "Social Spark": 25 },
  },
  {
    title: "Link your Telegram",
    description: "Link your Telegram to your account",
    image: SUNNYSIDE.icons.telegram,
    reward: { "Social Spark": 25 },
  },
];

const OTHER_WAYS_TO_EARN_SOCIAL_SPARK: Task[] = [
  {
    title: "Invite a VIP friend",
    description:
      "Invite a friend to join the game and buy VIP to earn bonus Social Spark",
    image: SUNNYSIDE.icons.player,
  },
  {
    title: "Join a stream",
    description:
      "Join a dev chat on discord or twitch stream to earn 1 Social Spark every 5 minutes from the host wearing a stream hat.",
    image: SUNNYSIDE.icons.player,
  },
];

export const TaskBoard: React.FC = () => {
  const { t } = useAppTranslation();
  const [selectedTask, setSelectedTask] = useState<Task>();
  const { gameService } = useContext(Context);
  const loveTokenCount = useSelector(
    gameService,
    (state) => state.context.state.inventory["Social Spark"] ?? new Decimal(0),
  );

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
          {TASKS.map((task) => (
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
          {OTHER_WAYS_TO_EARN_SOCIAL_SPARK.map((task) => (
            <ButtonPanel key={task.title} onClick={() => setSelectedTask(task)}>
              <div className="flex gap-3">
                <img src={task.image} className="w-10" />
                <div className="flex flex-col gap-1">
                  <p>{task.title}</p>
                  <p className="underline">{t("read.more")}</p>
                </div>
                {task.reward && (
                  <Label type="vibrant" className="absolute right-1 top-1">
                    {`${task.reward["Social Spark"]} Social Spark`}
                  </Label>
                )}
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
            {
              // TODO: Add complete condition
              <Button onClick={() => setSelectedTask(undefined)}>
                {`Complete`}
              </Button>
            }
          </div>
        </CloseButtonPanel>
      </ModalOverlay>
    </div>
  );
};
