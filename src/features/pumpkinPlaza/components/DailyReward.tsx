import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import treasure from "assets/decorations/treasure_chest.png";
import opened from "assets/decorations/treasure_opened.png";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const DailyReward: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showCollectedModal, setShowCollectedModal] = useState(false);

  const collectedAt =
    gameState.context.state.pumpkinPlaza?.rewardCollectedAt ?? 0;

  if (Date.now() - collectedAt < 24 * 60 * 60 * 1000) {
    return (
      <>
        <img
          id="daily-reward"
          src={opened}
          className="cursor-pointer absolute z-20"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            left: `${GRID_WIDTH_PX * 40}px`,
            top: `${GRID_WIDTH_PX * 18}px`,
          }}
          onClick={() => setShowCollectedModal(true)}
        />
        <Modal
          show={showCollectedModal}
          onHide={() => setShowCollectedModal(false)}
          centered
        >
          <CloseButtonPanel onClose={() => setShowCollectedModal(false)}>
            <div className="flex flex-col items-center">
              <img src={opened} className="w-1/4 mb-2" />
              <span className="text-center">
                Come back tomorrow for more rewards!
              </span>
            </div>
          </CloseButtonPanel>
        </Modal>
      </>
    );
  }

  // Load data
  return (
    <>
      <img
        id="daily-reward"
        src={treasure}
        className="cursor-pointer absolute z-20"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          left: `${GRID_WIDTH_PX * 40}px`,
          top: `${GRID_WIDTH_PX * 18}px`,
        }}
        onClick={() => {
          gameService.send("REVEAL", {
            event: {
              type: "dailyReward.collected",
              createdAt: new Date(),
            },
          });
        }}
      />
    </>
  );
};
