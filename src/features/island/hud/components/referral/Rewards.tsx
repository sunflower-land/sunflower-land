import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useCallback, useContext, useState } from "react";
import flowerIcon from "assets/icons/flower_token.webp";
import loveCharmSmall from "assets/icons/love_charm_small.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { TaskBoard } from "./TaskBoard";
import { MachineState } from "features/game/lib/gameMachine";

import { pixelOrangeBorderStyle } from "features/game/lib/style";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  IN_GAME_TASKS,
  InGameTaskName,
} from "features/game/events/landExpansion/completeSocialTask";
import { getKeys } from "features/game/types/decorations";
import { DailyRewardClaim } from "features/game/components/DailyReward";

const _chestCollectedAt = (state: MachineState) =>
  state.context.state.dailyRewards?.chest?.collectedAt ?? 0;

interface Props {
  show: boolean;
  onHide?: () => void;
  tab: "Earn" | "Rewards";
}

export const Rewards: React.FC<Props> = ({ show, onHide, tab }) => {
  const { t } = useAppTranslation();
  const [showMessage, setShowMessage] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab);

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

  const isTaskCompleted = useCallback(
    (task: InGameTaskName) => IN_GAME_TASKS[task].requirement(state),
    [state],
  );
  const isAnyTaskCompleted = getKeys(IN_GAME_TASKS)
    .filter(
      (task) =>
        !(
          ["Link your Discord", "Link your Telegram"] as InGameTaskName[]
        ).includes(task),
    )
    .some(
      (task) =>
        isTaskCompleted(task) &&
        !state.socialTasks?.completed[task]?.completedAt,
    );

  const chestCollectedAt = useSelector(gameService, _chestCollectedAt);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const isChestCollected = chestCollectedAt > today.getTime();

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          {
            icon: loveCharmSmall,
            name: t("earn"),
            alert: isAnyTaskCompleted,
            id: "Earn",
          },
          {
            icon: SUNNYSIDE.decorations.treasure_chest,
            name: t("rewards"),
            alert: !isChestCollected,
            id: "Rewards",
          },
        ]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onClose={onHide}
      >
        {currentTab === "Earn" && (
          <TaskBoard state={state} socialTasks={state.socialTasks} />
        )}
        {currentTab === "Rewards" && <DailyRewardClaim />}
        {/* {tab === 2 && <RewardsShop />} */}
      </CloseButtonPanel>
      {showMessage && (
        <div
          className={`w-full items-center flex  text-xs p-1 pr-4 mt-1 relative`}
          style={{
            background: "#f09100",
            color: "#3e2731",
            ...pixelOrangeBorderStyle,
          }}
        >
          <img src={flowerIcon} className="w-8 mr-4" />
          <div>
            <p className="text-xs flex-1">
              {t("announcement.exchangeLoveCharms")}
            </p>
            <a
              href={
                "https://docs.sunflower-land.com/getting-started/usdflower-erc20"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2"
            >
              {t("read.more")}
            </a>
          </div>
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute right-2 top-1 w-5 cursor-pointer"
            onClick={() => setShowMessage(false)}
          />
        </div>
      )}
    </Modal>
  );
};
