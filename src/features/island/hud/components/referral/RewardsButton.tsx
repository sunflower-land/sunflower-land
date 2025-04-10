import { RoundButton } from "components/ui/RoundButton";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { Rewards } from "./Rewards";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import {
  InGameTaskName,
  IN_GAME_TASKS,
} from "features/game/events/landExpansion/completeSocialTask";
import { rewardChestMachine } from "features/game/expansion/components/dailyReward/rewardChestMachine";
import { useInterpret, useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { getKeys } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";

export const RewardsButton: React.FC = () => {
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

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
      lastUsedCode: dailyRewards?.chest?.code ?? 0,
      openedAt: dailyRewards?.chest?.collectedAt ?? 0,
      bumpkinLevel,
      network: state.settings.network,
    },
  });
  const [chestState] = useActor(chestService);

  // Load the chest state when component mounts
  useEffect(() => {
    chestService.send("LOAD");
  }, [chestService]);

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

  // Check if chest is locked or can be unlocked
  const isChestLocked = !chestState.matches("opened");

  return (
    <div
      className="absolute"
      style={{ top: `${PIXEL_SCALE * 5}px`, left: `${PIXEL_SCALE * 32}px` }}
    >
      <RoundButton buttonSize={18} onClick={() => setShowRewardsModal(true)}>
        <img
          src={ITEM_DETAILS["Love Charm"].image}
          className="absolute group-active:translate-y-[2px]"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${PIXEL_SCALE * 2}px`,
            top: `${PIXEL_SCALE * 5}px`,
          }}
        />
        {(isAnyTaskCompleted || isChestLocked) && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute animate-pulsate"
            style={{
              width: `${PIXEL_SCALE * 3}px`,
              right: `${PIXEL_SCALE * 0}px`,
            }}
          />
        )}
      </RoundButton>
      <Rewards
        show={showRewardsModal}
        onHide={() => setShowRewardsModal(false)}
        gameService={gameService}
        state={state}
        isRevealed={isRevealed}
        bumpkinLevel={bumpkinLevel}
        chestService={chestService}
        chestState={chestState}
        loveCharmCount={state.inventory["Love Charm"] ?? new Decimal(0)}
        socialTasks={state.socialTasks}
        isChestLocked={isChestLocked}
        isAnyTaskCompleted={isAnyTaskCompleted}
      />
    </div>
  );
};
