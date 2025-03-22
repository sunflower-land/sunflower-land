import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useState } from "react";
// import giftIcon from "assets/icons/gift.png";
import { DailyRewardContent } from "../../../../game/expansion/components/dailyReward/DailyReward";
import { SUNNYSIDE } from "assets/sunnyside";
import { TaskBoard } from "./TaskBoard";
import { SocialTaskName } from "features/game/events/landExpansion/completeSocialTask";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import { GameState } from "features/game/types/game";
import {
  DailyRewardContext,
  DailyRewardEvent,
  DailyRewardState,
} from "features/game/expansion/components/dailyReward/rewardChestMachine";
import {
  Interpreter,
  ResolveTypegenMeta,
  TypegenDisabled,
  BaseActionObject,
  ServiceMap,
  State,
} from "xstate";
import Decimal from "decimal.js-light";

interface Props {
  show: boolean;
  onHide: () => void;
  gameService: MachineInterpreter;
  state: GameState;
  isRevealed: boolean;
  bumpkinLevel: number;
  chestService: Interpreter<
    DailyRewardContext,
    any,
    DailyRewardEvent,
    DailyRewardState,
    ResolveTypegenMeta<
      TypegenDisabled,
      DailyRewardEvent,
      BaseActionObject,
      ServiceMap
    >
  >;
  chestState: State<
    DailyRewardContext,
    DailyRewardEvent,
    any,
    DailyRewardState,
    ResolveTypegenMeta<
      TypegenDisabled,
      DailyRewardEvent,
      BaseActionObject,
      ServiceMap
    >
  >;
  completeTask: (taskId: SocialTaskName) => void;
  loveCharmCount: Decimal;
  socialTasks?: GameState["socialTasks"];
}

export const Rewards: React.FC<Props> = ({
  show,
  onHide,
  gameService,
  state,
  isRevealed,
  bumpkinLevel,
  chestService,
  chestState,
  completeTask,
  loveCharmCount,
  socialTasks,
}) => {
  const [tab, setTab] = useState<number>(0);

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: SUNNYSIDE.ui.board, name: "Task Board" },
          // { icon: giftIcon, name: "Rewards Shop" },
          ...(bumpkinLevel > 5
            ? [
                {
                  icon: SUNNYSIDE.decorations.treasure_chest,
                  name: "Daily Reward",
                },
              ]
            : []),
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
        onClose={onHide}
      >
        {tab === 0 && (
          <TaskBoard
            state={state}
            completeTask={completeTask}
            socialTasks={socialTasks}
            loveCharmCount={loveCharmCount}
          />
        )}
        {tab === 1 && (
          <DailyRewardContent
            onClose={onHide}
            gameService={gameService}
            dailyRewards={state.dailyRewards}
            isRevealed={isRevealed}
            bumpkinLevel={bumpkinLevel}
            chestService={chestService}
            chestState={chestState}
          />
        )}
        {/* {tab === 2 && <RewardsShop />} */}
      </CloseButtonPanel>
    </Modal>
  );
};
