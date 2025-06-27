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
import { ITEM_DETAILS } from "features/game/types/images";
import { ModalContext } from "features/game/components/modal/ModalProvider";

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
      className="absolute"
      style={{ top: `${PIXEL_SCALE * 5}px`, left: `${PIXEL_SCALE * 32}px` }}
    >
      <RoundButton buttonSize={18} onClick={() => openModal("EARN")}>
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
    </div>
  );
};
