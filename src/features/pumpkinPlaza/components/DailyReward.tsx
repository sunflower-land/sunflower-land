import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";

export const DailyReward: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showCollectedModal, setShowCollectedModal] = useState(false);

  useUiRefresher();

  const canOpen = (openedAt?: number) => {
    if (!openedAt) return true;

    const today = new Date().toISOString().substring(0, 10);

    return new Date(openedAt).toISOString().substring(0, 10) !== today;
  };

  const date = new Date();

  const nextRefreshInSeconds =
    24 * 60 * 60 -
    (date.getUTCHours() * 60 * 60 +
      date.getUTCMinutes() * 60 +
      date.getUTCSeconds());

  const collectedAt =
    gameState.context.state.pumpkinPlaza?.rewardCollectedAt ?? 0;

  const isReady = canOpen(collectedAt);

  const reveal = () => {
    gameService.send("REVEAL", {
      event: {
        type: "plazaReward.collected",
        createdAt: new Date(),
      },
    });
  };

  return (
    <>
      <img
        id="daily-reward"
        src={
          isReady
            ? SUNNYSIDE.decorations.treasure_chest
            : SUNNYSIDE.decorations.treasure_chest_opened
        }
        className="cursor-pointer absolute z-20 hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          left: `${GRID_WIDTH_PX * 52}px`,
          top: `${GRID_WIDTH_PX * 30}px`,
        }}
        onClick={isReady ? reveal : () => setShowCollectedModal(true)}
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
              {secondsToString(nextRefreshInSeconds, { length: "full" })} for
              more rewards!
            </span>
          </div>
        </CloseButtonPanel>
      </Modal>
      {gameState.matches("revealing") && (
        <Modal show centered>
          <CloseButtonPanel>
            <Revealing icon={SUNNYSIDE.decorations.treasure_chest} />
          </CloseButtonPanel>
        </Modal>
      )}
      {gameState.matches("revealed") && (
        <Modal show centered>
          <CloseButtonPanel>
            <Revealed />
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
