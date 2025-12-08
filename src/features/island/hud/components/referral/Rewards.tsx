import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useCallback, useContext, useState } from "react";
// import giftIcon from "assets/icons/gift.png";
import vipGift from "assets/decorations/vip_gift.png";
import flowerIcon from "assets/icons/flower_token.webp";
import loveCharmSmall from "assets/icons/love_charm_small.webp";
import lockIcon from "assets/icons/lock.png";
import { DailyRewardContent } from "../../../../game/expansion/components/dailyReward/DailyReward";
import { SUNNYSIDE } from "assets/sunnyside";
import { TaskBoard } from "./TaskBoard";
import { MachineState } from "features/game/lib/gameMachine";
import { rewardChestMachine } from "features/game/expansion/components/dailyReward/rewardChestMachine";

import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { getSeasonalTicket } from "features/game/types/seasons";
import { VIPGiftContent } from "features/world/ui/VIPGift";
import { BlockchainBox } from "./BlockchainBox";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { pixelOrangeBorderStyle } from "features/game/lib/style";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import { getBumpkinLevel } from "features/game/lib/level";
import { Context } from "features/game/GameProvider";
import {
  IN_GAME_TASKS,
  InGameTaskName,
} from "features/game/events/landExpansion/completeSocialTask";
import { getKeys } from "features/game/types/decorations";
import { useNow } from "lib/utils/hooks/useNow";
import { hasFeatureAccess } from "lib/flags";
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
        {currentTab === "Rewards" &&
          (hasFeatureAccess(state, "DAILY_BOXES") ? (
            <DailyRewardClaim />
          ) : (
            <RewardOptions />
          ))}
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

export type RewardType = "DAILY_REWARD" | "VIP" | "BLOCKCHAIN_BOX";

export const RewardOptions: React.FC<{ selectedButton?: RewardType }> = ({
  selectedButton,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const now = useNow();

  // Get daily rewards data for chest state
  const dailyRewards = useSelector(
    gameService,
    (state) => state.context.state.dailyRewards,
  );
  const bumpkinLevel = useSelector(gameService, (state) =>
    getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0),
  );
  const isRevealed = useSelector(gameService, (state) =>
    state.matches("revealed"),
  );

  // Initialize chest service to check if chest is locked
  const chestService = useInterpret(rewardChestMachine, {
    context: {
      // First code is 1
      nextCode: dailyRewards?.chest?.code ?? 1,
      openedAt: dailyRewards?.chest?.collectedAt ?? 0,
      bumpkinLevel,
    },
  });
  const [chestState] = useActor(chestService);

  const [selected, setSelected] = useState<RewardType | undefined>(
    selectedButton,
  );
  const { t } = useAppTranslation();

  if (selected === "DAILY_REWARD") {
    return (
      <DailyRewardContent
        onClose={() => {
          setSelected(undefined);
        }}
        gameService={gameService}
        dailyRewards={state.dailyRewards}
        isRevealed={isRevealed}
        bumpkinLevel={bumpkinLevel}
        chestService={chestService}
        chestState={chestState}
      />
    );
  }

  if (selected === "VIP") {
    return <VIPGiftContent onClose={() => setSelected(undefined)} />;
  }

  if (selected === "BLOCKCHAIN_BOX") {
    return <BlockchainBox />;
  }

  const vipOpenedAt = state.pumpkinPlaza.vipChest?.openedAt ?? 0;

  const hasOpenedVIP =
    !!vipOpenedAt &&
    new Date(vipOpenedAt).toISOString().substring(0, 7) ===
      new Date().toISOString().substring(0, 7);

  const today = new Date().toISOString().substring(0, 10);
  const hasOpenedDaily =
    new Date(state.dailyRewards?.chest?.collectedAt ?? 0)
      .toISOString()
      .substring(0, 10) === today;

  return (
    <>
      <Label type="default" className="mb-1">
        {t("rewards.claim.title")}
      </Label>

      <ButtonPanel
        onClick={
          bumpkinLevel < 6 ? undefined : () => setSelected("DAILY_REWARD")
        }
        disabled={bumpkinLevel < 6}
        className="mb-1"
      >
        <div className="flex items-start">
          <img
            src={SUNNYSIDE.decorations.treasure_chest}
            className="w-10 mr-4"
          />
          <div className="relative flex-1">
            <p className="text-sm mb-1">{t("rewards.daily.title")}</p>
            <p className="text-xs">
              {t("rewards.daily.description", { ticket: getSeasonalTicket() })}
            </p>
          </div>
          {hasOpenedDaily && (
            <Label className="absolute top-0 right-0" type="success">
              {t("rewards.daily.claimed")}
            </Label>
          )}
          {bumpkinLevel < 6 && (
            <Label
              icon={lockIcon}
              secondaryIcon={SUNNYSIDE.icons.player}
              className="absolute top-0 right-1"
              type="formula"
            >
              {`${t("lvl")} 6`}
            </Label>
          )}
        </div>
      </ButtonPanel>

      <ButtonPanel onClick={() => setSelected("VIP")}>
        <div className="flex items-start">
          <img src={vipGift} className="w-10 mr-4" />
          <div className="relative flex-1">
            <p className="text-sm mb-1">{t("rewards.vip.title")}</p>
            <p className="text-xs">{t("rewards.vip.description")}</p>
          </div>
          {hasOpenedVIP && (
            <Label className="absolute top-0 right-0" type="success">
              {t("rewards.vip.claimed")}
            </Label>
          )}
          {!hasOpenedVIP && !hasVipAccess({ game: state, now }) && (
            <Label
              icon={lockIcon}
              className="absolute top-0 right-0"
              type="formula"
            >
              {t("locked")}
            </Label>
          )}
        </div>
      </ButtonPanel>
    </>
  );
};
