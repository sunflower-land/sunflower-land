import React, { useContext, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { rewardChestMachine } from "./dailyRewardMachine";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

export const DailyReward: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showModal, setShowModal] = useState(false);

  const chestService = useInterpret(rewardChestMachine, {
    context: {
      lastUsedCode: gameState.context.state.dailyRewards?.chest?.code ?? 0,
      openedAt: gameState.context.state.dailyRewards?.chest?.collectedAt ?? 0,
    },
  });

  const [chestState] = useActor(chestService);

  const openModal = () => {
    setShowModal(true);
    chestService.send("LOAD");
  };

  const reveal = () => {
    gameService.send("REVEAL", {
      event: {
        type: "dailyReward.collected",
        createdAt: new Date(),
        code: chestState.context.code,
      },
    });
    chestService.send("OPEN");
  };

  const ModalContent = () => {
    console.log({ state: chestState.value });

    if (chestState.matches("opened")) {
      return (
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center p-2">
            <img
              src={SUNNYSIDE.decorations.treasure_chest_opened}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <span className="text-center">
              Come back tomorrow for more rewards
            </span>
          </div>
        </CloseButtonPanel>
      );
    }

    if (chestState.matches("locked")) {
      return (
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center p-2">
            <img
              src={SUNNYSIDE.decorations.treasure_chest}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <Button onClick={() => chestService.send("UNLOCK")}>
              Unlock Reward
            </Button>
          </div>
        </CloseButtonPanel>
      );
    }

    if (chestState.matches("unlocked")) {
      return (
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center p-2">
            <img
              src={SUNNYSIDE.decorations.treasure_chest}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <Button onClick={reveal}>Open reward</Button>
          </div>
        </CloseButtonPanel>
      );
    }

    if (chestState.matches("opening") && gameState.matches("revealing")) {
      return (
        <Panel>
          <Revealing icon={SUNNYSIDE.icons.treasure} />
        </Panel>
      );
    }

    if (chestState.matches("opening") && gameState.matches("revealed")) {
      return (
        <Panel>
          <Revealed onAcknowledged={() => chestService.send("ACKNOWLEDGE")} />
        </Panel>
      );
    }

    if (chestState.matches("loading") || chestState.matches("unlocking")) {
      return (
        <Panel>
          <div className=" p-2">
            <p className="loading">Loading</p>
          </div>
        </Panel>
      );
    }

    return null;
  };

  return (
    <>
      <img
        id="daily-reward"
        src={
          chestState.matches("opened")
            ? SUNNYSIDE.decorations.treasure_chest_opened
            : SUNNYSIDE.decorations.treasure_chest
        }
        className="cursor-pointer absolute z-20 hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          left: `${GRID_WIDTH_PX * 52}px`,
          top: `${GRID_WIDTH_PX * 30}px`,
        }}
        onClick={() => openModal()}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <ModalContent />
      </Modal>
    </>
  );
};
