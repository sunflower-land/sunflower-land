import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";

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
          className="cursor-pointer absolute z-20  hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            left: `${GRID_WIDTH_PX * 52}px`,
            top: `${GRID_WIDTH_PX * 30}px`,
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
              <img
                src={SUNNYSIDE.decorations.treasure_chest_opened}
                className="w-1/4 mb-2"
              />
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
        src={SUNNYSIDE.decorations.treasure_chest}
        className="cursor-pointer absolute z-20   hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          left: `${GRID_WIDTH_PX * 52}px`,
          top: `${GRID_WIDTH_PX * 30}px`,
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
