import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  id: number;
}

export const BoatModal: React.FC<Props> = ({ isOpen, closeModal, id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      gameService.send({ type: "SAVE" });
    }
  }, [isOpen]);

  return (
    <CloseButtonPanel onClose={closeModal}>
      <div className="p-2">
        <p className="mb-3">{t("interactableModals.returnhome.message")}</p>
      </div>
      <Button
        onClick={() => navigate(`/`)}
        disabled={gameState.matches("autosaving")}
      >
        {gameState.matches("autosaving") ? t("saving") : t("go.home")}
      </Button>
    </CloseButtonPanel>
  );
};
