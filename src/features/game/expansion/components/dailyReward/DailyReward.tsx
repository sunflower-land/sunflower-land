import React, { useContext } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { useVisiting } from "lib/utils/visitUtils";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { DailyRewardClaim } from "features/game/components/DailyReward";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";

const _bumpkinLevel = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

const _chestCollectedAt = (state: MachineState) =>
  state.context.state.dailyRewards?.chest?.collectedAt ?? 0;

/**
 * Treasure chest on home buildings; opens the same daily reward flow as the mailbox.
 */
export const DailyReward: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);

  const bumpkinLevel = useSelector(gameService, _bumpkinLevel);
  const chestCollectedAt = useSelector(gameService, _chestCollectedAt);
  const { isVisiting } = useVisiting();

  const { openModal } = useContext(ModalContext);

  if (isVisiting) {
    return null;
  }

  if (bumpkinLevel <= 5) {
    return null;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const isChestCollected = chestCollectedAt > today.getTime();

  return (
    <>
      <div
        className="absolute z-20"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
          left: `${GRID_WIDTH_PX * 1.5}px`,
          top: `${GRID_WIDTH_PX * 1}px`,
        }}
      >
        <img
          id="daily-reward"
          src={
            isChestCollected
              ? SUNNYSIDE.decorations.treasure_chest_opened
              : SUNNYSIDE.decorations.treasure_chest
          }
          className="cursor-pointer hover:img-highlight w-full absolute bottom-0"
          onClick={() => openModal("DAILY_REWARD")}
        />

        {!isChestCollected && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className={"absolute" + (showAnimations ? " animate-float" : "")}
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              top: `${PIXEL_SCALE * -14}px`,
              left: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}
      </div>
    </>
  );
};

export const DailyRewardChest: React.FC<{
  show: boolean;
  onHide?: () => void;
}> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <CloseButtonPanel onClose={onHide} container={OuterPanel}>
        <InnerPanel>
          <DailyRewardClaim />
        </InnerPanel>
      </CloseButtonPanel>
    </Modal>
  );
};
