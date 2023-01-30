import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

export const DailyReward: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showCollectedModal, setShowCollectedModal] = useState(false);

  useUiRefresher();

  const cooldown = 24 * 60 * 60 * 1000; // 1 day

  const collectedAt =
    gameState.context.state.pumpkinPlaza?.rewardCollectedAt ?? 0;
  const readyInSeconds = (collectedAt + cooldown - Date.now()) / 1000;

  if (readyInSeconds > 0) {
    return (
      <>
        <img
          id="daily-reward"
          src={SUNNYSIDE.decorations.treasure_chest_opened}
          className="cursor-pointer absolute z-20 hover:img-highlight"
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
            <div className="flex flex-col items-center p-2">
              <img
                src={SUNNYSIDE.decorations.treasure_chest_opened}
                className="mb-2"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                }}
              />
              <span className="text-center">
                Come back in{" "}
                {secondsToString(readyInSeconds, { length: "full" })} for more
                rewards!
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
        className="cursor-pointer absolute z-20 hover:img-highlight"
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
