import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { DEV_TimeMachine } from "./DEV_TimeMachine";
import { createPortal } from "react-dom";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { DEV_HoardingCheck } from "components/dev/DEV_HoardingCheck";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AmoyTestnetActions: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();
  const [showTimeMachine, setShowTimeMachine] = useState(false);
  const [view, setView] = useState<"settings">("settings");

  const Content = () => {
    return (
      <>
        <CloseButtonPanel title={`Amoy Testnet Actions`} onClose={onClose}>
          <ul className="list-none">
            <li className="p-1">
              <Button
                onClick={() => setShowTimeMachine(!showTimeMachine)}
                className="p-1"
              >
                {t("settingsMenu.timeMachine")}
              </Button>
            </li>
            <li className="p-1">
              <DEV_HoardingCheck network="mainnet" />
            </li>
            <li className="p-1">
              <DEV_HoardingCheck network="amoy" />
            </li>
          </ul>
        </CloseButtonPanel>
        {showTimeMachine && createPortal(<DEV_TimeMachine />, document.body)}
      </>
    );
  };

  const closeAndResetView = () => {
    onClose();
    setView("settings");
  };

  return (
    <Modal show={isOpen} onHide={closeAndResetView}>
      {Content()}
    </Modal>
  );
};
