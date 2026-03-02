import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import { Context } from "features/game/GameProvider";
import { WaveModalData, waveModalManager } from "./lib/waveModalManager";
import { useTranslation } from "react-i18next";
import confetti from "canvas-confetti";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

const _username = (state: MachineState) => state.context.state.username;

export const WaveModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();
  const username = useSelector(gameService, _username);

  const [modalData, setModalData] = useState<WaveModalData | undefined>(
    undefined,
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    waveModalManager.listen((data) => {
      setModalData(data);
      setShowModal(true);
      waveModalManager.setIsOpen(true);
    });
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setModalData(undefined);
    waveModalManager.setIsOpen(false);
  };

  const claimTiara = () => {
    gameService.send({ type: "bonus.claimed", name: "2026-tiara-wave" });
    confetti();
    closeModal();
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <SpeakingModal
        bumpkinParts={modalData?.wavedAtClothing}
        onClose={closeModal}
        message={[
          {
            text: t("bonus.2026-tiara-wave.message", {
              username,
            }),
            actions: [
              {
                text: t("claim.bonusItemName", {
                  bonusItemName: t("bonus.2026-tiara-wave.name"),
                }),
                cb: claimTiara,
              },
            ],
          },
        ]}
      />
    </Modal>
  );
};
