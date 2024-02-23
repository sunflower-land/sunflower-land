import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Revealed } from "features/game/components/Revealed";
import { MapPlacement } from "./MapPlacement";
import { Revealing } from "features/game/components/Revealing";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { isWearableActive } from "features/game/lib/wearables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const PirateChest: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService, showAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showCollectedModal, setShowCollectedModal] = useState(false);
  const [showNotPirateModal, setShowNotPirateModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  useUiRefresher();

  const collectedAt =
    gameState.context.state.treasureIsland?.rewardCollectedAt ?? 0;

  const date = new Date();

  const canCollect = (openedAt?: number) => {
    if (!openedAt) return true;

    const today = new Date().toISOString().substring(0, 10);

    return new Date(openedAt).toISOString().substring(0, 10) !== today;
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

    setIsCollecting(true);
  };

  const isPirate = isWearableActive({
    name: "Pirate Potion",
    game: gameState.context.state,
  });
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
            className={"absolute" + (showAnimations ? " animate-float" : "")}
            style={{
              top: `${PIXEL_SCALE * -13}px`,
              left: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 4}px`,
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
      >
        <CloseButtonPanel onClose={() => setShowCollectedModal(false)}>
          <div className="flex flex-col items-center p-2 w-full">
            <img
              src={SUNNYSIDE.decorations.treasure_chest_opened}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <span className="text-center">{t("piratechest.greeting")}</span>
            <div className="flex flex-wrap gap-y-1 justify-center mt-4 items-center">
              <p className="text-xxs mr-2">{t("piratechest.refreshesIn")}</p>
              <CountdownLabel timeLeft={nextRefreshInSeconds} />
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal
        show={showNotPirateModal}
        onHide={() => setShowNotPirateModal(false)}
      >
        <CloseButtonPanel onClose={() => setShowNotPirateModal(false)}>
          <div className="flex flex-col items-center p-2 w-full">
            <img
              src={SUNNYSIDE.decorations.treasure_chest}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <span className="mb-2 text-sm">{t("piratechest.warning")}</span>
          </div>
        </CloseButtonPanel>
      </Modal>

      {gameState.matches("revealing") && isCollecting && (
        <Modal show>
          <CloseButtonPanel>
            <Revealing icon={SUNNYSIDE.decorations.treasure_chest} />
          </CloseButtonPanel>
        </Modal>
      )}
      {gameState.matches("revealed") && isCollecting && (
        <Modal show>
          <CloseButtonPanel>
            <Revealed onAcknowledged={() => setIsCollecting(false)} />
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
