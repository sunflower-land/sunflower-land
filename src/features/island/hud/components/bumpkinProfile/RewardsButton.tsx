import { RoundButton } from "components/ui/RoundButton";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { useCallback, useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { useGame } from "features/game/GameProvider";
import {
  InGameTaskName,
  IN_GAME_TASKS,
} from "features/game/events/landExpansion/completeSocialTask";
import { getKeys } from "features/game/types/decorations";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { isMobile } from "mobile-device-detect";
import giftIcon from "assets/icons/gift.png";

export const RewardsButton: React.FC = () => {
  const { gameState } = useGame();
  const { openModal } = useContext(ModalContext);

  const isTaskCompleted = useCallback(
    (task: InGameTaskName) =>
      IN_GAME_TASKS[task].requirement(gameState.context.state),
    [gameState.context.state],
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
        !gameState.context.state.socialTasks?.completed[task]?.completedAt,
    );

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const isChestLocked =
    (gameState.context.state.dailyRewards?.chest?.collectedAt ?? 0) <
    today.getTime();

  return (
    <div
      className="absolute z-10"
      style={{
        top: `${PIXEL_SCALE * (isMobile ? 15 : 5)}px`,
        left: `${PIXEL_SCALE * (isMobile ? 34 : 32)}px`,
      }}
    >
      <RoundButton
        buttonSize={isMobile ? 15 : 18}
        onClick={() => openModal("EARN")}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${PIXEL_SCALE * (isMobile ? 12 : 14)}px`,
          }}
        >
          <img
            src={giftIcon}
            className="group-active:translate-y-[2px] relative"
            style={{
              width: `${PIXEL_SCALE * (isMobile ? 9 : 11)}px`,
              left: `${PIXEL_SCALE * 1.5}px`,
            }}
          />
        </div>

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
    </div>
  );
};
