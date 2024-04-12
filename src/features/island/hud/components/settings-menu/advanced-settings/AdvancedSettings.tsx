import React, { useContext, useState } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Context } from "features/game/GameProvider";
import { TransferAccount } from "../blockchain-settings/TransferAccount";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useActor } from "@xstate/react";
import { WalletContext } from "features/wallet/WalletProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { DequipBumpkin } from "../blockchain-settings/DequipBumpkin";
import { GameWallet } from "features/wallet/Wallet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedSettings: React.FC<Props> = ({ isOpen, onClose }) => {
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

    const showDequipper = !!linkedWallet;

    return (
      <CloseButtonPanel title={t("advanced")} onClose={onClose}>
        <Button className="col p-1" onClick={onToggleAnimations}>
          {showAnimations
            ? t("advancedSettings.disableAnimations")
            : t("advancedSettings.enableAnimations")}
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
              {t("advancedSettings.transferOwnership")}
            </Button>
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
