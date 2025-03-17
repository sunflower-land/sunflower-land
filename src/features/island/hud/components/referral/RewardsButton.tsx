import { RoundButton } from "components/ui/RoundButton";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import giftIcon from "assets/icons/gift.png";
import { Rewards } from "./Rewards";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import {
  SocialTaskName,
  TASKS,
} from "features/game/events/landExpansion/completeSocialTask";
import { rewardChestMachine } from "features/game/expansion/components/dailyReward/rewardChestMachine";
import { useInterpret, useActor } from "@xstate/react";

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
    state.context.state.bumpkin ? state.context.state.bumpkin.experience : 0,
  );

  // Initialize chest service to check if chest is locked
  const chestService = useInterpret(rewardChestMachine, {
    context: {
      lastUsedCode: dailyRewards?.chest?.code ?? 0,
      openedAt: dailyRewards?.chest?.collectedAt ?? 0,
      bumpkinLevel,
    },
  });
  const [chestState] = useActor(chestService);

  // Load the chest state when component mounts
  useEffect(() => {
    chestService.send("LOAD");
  }, [chestService]);

  const isTaskCompleted = useCallback(
    (task: SocialTaskName) => TASKS[task].requirement(state),
    [state],
  );
  const isAnyTaskCompleted = Object.values(TASKS).some(
    (task) =>
      isTaskCompleted(task.title as SocialTaskName) &&
      !state.socialTasks?.completed[task.title as SocialTaskName]?.completedAt,
  );

  // Check if chest is locked or can be unlocked
  const isChestLocked = useMemo(
    () => !chestState.matches("unlocked"),
    [chestState],
  );

  return (
    <div
      className="absolute"
      style={{ top: `${PIXEL_SCALE * 5}px`, left: `${PIXEL_SCALE * 32}px` }}
    >
      <RoundButton buttonSize={18} onClick={() => setShowRewardsModal(true)}>
        <img
          src={giftIcon}
          className="absolute group-active:translate-y-[2px]"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            left: `${PIXEL_SCALE * 4}px`,
            top: `${PIXEL_SCALE * 4}px`,
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
      />
    </div>
  );
};
