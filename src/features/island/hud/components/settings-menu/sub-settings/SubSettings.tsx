import React, { useContext, useState } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Context } from "features/game/GameProvider";
import { TransferAccount } from "./TransferAccount";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { WalletContext } from "features/wallet/WalletProvider";
import { translate } from "lib/i18n/translate";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SubSettings: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(Auth.Context);
  const { gameService, showAnimations, toggleAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { walletService } = useContext(WalletContext);

  const { farmAddress } = gameState.context;
  const isFullUser = farmAddress !== undefined;

  const [view, setView] = useState<"settings" | "transfer">("settings");

  const closeAndResetView = () => {
    onClose();
    setView("settings");
  };

  const onToggleAnimations = () => {
    toggleAnimations();
  };

  const refreshSession = () => {
    onClose();
    gameService.send("RESET");
  };

  const Content = () => {
    if (view === "transfer") {
      return (
        <Panel className="p-0">
          <TransferAccount isOpen={true} onClose={closeAndResetView} />
        </Panel>
      );
    }

    return (
      <CloseButtonPanel
        title={translate("subSettings.title")}
        onClose={onClose}
      >
        <Button className="col p-1" onClick={onToggleAnimations}>
          {showAnimations ? "Disable Animations" : "Enable Animations"}
        </Button>

        {isFullUser && (
          <>
            <Button
              className="col p-1 mt-2"
              onClick={() => setView("transfer")}
            >
              {translate("subSettings.transferOwnership")}
            </Button>

            <Button className="col p-1 mt-2" onClick={refreshSession}>
              {translate("subSettings.refresh")}
            </Button>

            <div className="flex items-start">
              <img
                src={SUNNYSIDE.icons.expression_confused}
                className="w-12 pt-2 pr-2"
              />
              <span className="text-xs mt-2">
                {translate("subSettings.refreshDescription")}
              </span>
            </div>
          </>
        )}
      </CloseButtonPanel>
    );
  };

  return (
    <Modal show={isOpen} onHide={closeAndResetView} centered>
      {Content()}
    </Modal>
  );
};
