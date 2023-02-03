import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Revealed } from "features/game/components/Revealed";
import { MapPlacement } from "./MapPlacement";
import { Revealing } from "features/game/components/Revealing";

export const PirateChest: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showCollectedModal, setShowCollectedModal] = useState(false);
  const [showNotPirateModal, setShowNotPirateModal] = useState(false);

  useUiRefresher();

  const collectedAt =
    gameState.context.state.treasureIsland?.rewardCollectedAt ?? 0;

  const date = new Date();

  const canCollect = (openedAt?: number) => {
    if (!openedAt) return true;

    const today = new Date().getUTCDay();

    return new Date(openedAt).getUTCDay() !== today;
  };

  const nextRefreshInSeconds =
    24 * 60 * 60 -
    (date.getUTCHours() * 60 * 60 +
      date.getUTCMinutes() * 60 +
      date.getUTCSeconds());

  const isReady = canCollect(collectedAt);

  const reveal = () => {
    gameService.send("REVEAL", {
      event: {
        type: "pirateReward.collected",
        createdAt: new Date(),
      },
    });
  };

  const isPirate =
    gameState.context.state.bumpkin?.equipped.body === "Pirate Potion";
  const canOpen = isReady && isPirate;

  const onClick = () => {
    if (!isPirate) {
      setShowNotPirateModal(true);
      return;
    }

    canOpen ? reveal() : setShowCollectedModal(true);
  };

  return (
    <>
      <MapPlacement x={11} y={6} height={1} width={1}>
        {canOpen && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="w-2 absolute animate-float"
            style={{
              top: `${PIXEL_SCALE * -13}px`,
              left: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}
        <img
          src={
            isReady
              ? SUNNYSIDE.decorations.treasure_chest
              : SUNNYSIDE.decorations.treasure_chest_opened
          }
          className="cursor-pointer absolute z-20 hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
          onClick={onClick}
        />
      </MapPlacement>
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
              Ahoy matey! Set sail and come back later for a chest full of
              swashbuckling rewards!
            </span>
            <div className="flex justify-center mt-4 items-center">
              <p className="text-xxs mr-2">Chest Refreshes in: </p>
              <div className="flex items-center justify-center bg-blue-600 text-white text-xxs px-1.5 pb-1 pt-0.5 border rounded-md">
                <img
                  src={SUNNYSIDE.icons.stopwatch}
                  className="w-3 left-0 mr-1"
                />
                <span>
                  {`${secondsToString(nextRefreshInSeconds as number, {
                    length: "medium",
                    isShortFormat: true,
                  })}`}
                </span>
              </div>
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal
        show={showNotPirateModal}
        onHide={() => setShowNotPirateModal(false)}
        centered
      >
        <CloseButtonPanel onClose={() => setShowNotPirateModal(false)}>
          <div className="flex flex-col items-center p-2">
            <img
              src={SUNNYSIDE.decorations.treasure_chest}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <span className="text-center mb-2 text-sm">
              Ahoy there! This chest be filled with treasures fit for a pirate
              king, but beware, only those with a pirate skin can open it and
              claim the booty within!
            </span>
          </div>
        </CloseButtonPanel>
      </Modal>

      {gameState.matches("revealing") && (
        <Modal show centered>
          <CloseButtonPanel showCloseButton={false}>
            <Revealing icon={SUNNYSIDE.decorations.treasure_chest} />
          </CloseButtonPanel>
        </Modal>
      )}
      {gameState.matches("revealed") && (
        <Modal show centered>
          <CloseButtonPanel showCloseButton={false}>
            <Revealed />
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
