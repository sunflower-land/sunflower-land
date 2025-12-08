import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { partyModalManager } from "features/world/lib/partyModalManager";
import { secondsTillReset, secondsToString } from "lib/utils/time";
import { ChestRevealing } from "../chests/ChestRevealing";
import { Revealed } from "features/game/components/Revealed";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import confetti from "canvas-confetti";

import dancingGirl from "assets/npcs/dancing_girl.gif";

export const PartyModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const [showModal, setShowModal] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    confetti();

    partyModalManager.listen((isOpen) => {
      setShowModal(isOpen);
      if (!isOpen) {
        setIsPicking(false);
        setIsRevealing(false);
      }
    });
  }, []);

  const closeModal = () => {
    partyModalManager.close();
  };

  const openedAt =
    gameState.context.state.pumpkinPlaza.giftGiver?.openedAt ?? 0;

  const hasOpened =
    !!openedAt &&
    new Date(openedAt).toISOString().substring(0, 10) ===
      new Date().toISOString().substring(0, 10);

  const handleClaim = async () => {
    if (hasOpened) return;
    setIsPicking(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    gameService.send("REVEAL", {
      event: {
        type: "giftGiver.opened",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
    setIsPicking(false);
  };

  if (!showModal) return null;

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    return (
      <Modal show={showModal} onHide={closeModal}>
        <InnerPanel>
          <ChestRevealing type="Gift Giver" />
        </InnerPanel>
      </Modal>
    );
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Modal show={showModal} onHide={closeModal}>
        <InnerPanel>
          <Revealed
            onAcknowledged={() => {
              setIsRevealing(false);
              closeModal();
            }}
          />
        </InnerPanel>
      </Modal>
    );
  }

  return (
    <Modal show={showModal} onHide={closeModal}>
      <CloseButtonPanel title={t("gam3.party.title")} onClose={closeModal}>
        <div className="flex flex-col gap-2 px-1 mb-2">
          <p className="text-sm">{t("gam3.party.body")}</p>
          <p className="text-xs ">{t("gam3.party.tip")}</p>
        </div>
        <div className="flex justify-center m-2">
          {new Array(10).fill(0).map((_, index) => (
            <img src={dancingGirl} key={index} className="w-10 h-10" />
          ))}
        </div>
        <Button onClick={handleClaim} disabled={hasOpened}>
          {hasOpened
            ? t("gam3.party.backIn", {
                time: secondsToString(secondsTillReset(), { length: "short" }),
              })
            : t("gam3.party.button")}
        </Button>
      </CloseButtonPanel>
    </Modal>
  );
};
