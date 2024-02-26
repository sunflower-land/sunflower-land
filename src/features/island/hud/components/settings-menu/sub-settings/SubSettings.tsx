import React, { useContext, useState } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Context } from "features/game/GameProvider";
import { TransferAccount } from "./TransferAccount";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { WalletContext } from "features/wallet/WalletProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { DequipBumpkin } from "./DequipBumpkin";
import { GameWallet } from "features/wallet/Wallet";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SubSettings: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();

  const { authService } = useContext(Auth.Context);
  const { gameService, showAnimations, toggleAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { walletService } = useContext(WalletContext);

  const { farmAddress, linkedWallet } = gameState.context;
  const isFullUser = farmAddress !== undefined;

  const [view, setView] = useState<"settings" | "transfer" | "dequip">(
    "settings"
  );

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

    if (view === "dequip") {
      return (
        <Panel className="p-0">
          <GameWallet action="dequip">
            <DequipBumpkin onClose={closeAndResetView} />
          </GameWallet>
        </Panel>
      );
    }

    const showDequipper =
      !!linkedWallet && hasFeatureAccess(gameState.context.state, "DEQUIPPER");
    return (
      <CloseButtonPanel title={t("advanced")} onClose={onClose}>
        <Button className="col p-1" onClick={onToggleAnimations}>
          {showAnimations
            ? t("subSettings.disableAnimations")
            : t("subSettings.enableAnimations")}
        </Button>

        {showDequipper && (
          <Button
            className="col p-1 mt-2 capitalize"
            onClick={() => setView("dequip")}
          >
            {t("dequipper.dequip")}
          </Button>
        )}

        {isFullUser && (
          <>
            <Button
              className="col p-1 mt-2"
              onClick={() => setView("transfer")}
            >
              {t("subSettings.transferOwnership")}
            </Button>

            <Button className="col p-1 mt-2" onClick={refreshSession}>
              {t("refresh")}
            </Button>

            <div className="flex items-start">
              <img
                src={SUNNYSIDE.icons.expression_confused}
                className="w-12 pt-2 pr-2"
              />
              <span className="text-xs mt-2">
                {t("subSettings.refreshDescription")}
              </span>
            </div>
          </>
        )}
      </CloseButtonPanel>
    );
  };

  return (
    <Modal show={isOpen} onHide={closeAndResetView}>
      {Content()}
    </Modal>
  );
};
