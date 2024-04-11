import React, { useContext, useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { DepositModal } from "features/goblins/bank/components/Deposit";
import { useSelector } from "@xstate/react";
import { getBumpkinLevel } from "features/game/lib/level";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { DepositArgs } from "lib/blockchain/Deposit";
import { Modal } from "components/ui/Modal";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { AddSFL } from "../../AddSFL";
import { DequipBumpkin } from "../blockchain-settings/DequipBumpkin";
import { Panel } from "components/ui/Panel";
import { GameWallet } from "features/wallet/Wallet";
import { TransferAccount } from "../blockchain-settings/TransferAccount";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const _farmAddress = (state: MachineState) => state.context.farmAddress ?? "";
const _xp = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;

export const BlockchainSettings: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(GameContext);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showRefreshMenu, setShowRefreshMenu] = useState(false);
  const [showAddSFLModal, setShowAddSFLModal] = useState(false);

  const [view, setView] = useState<"settings" | "transfer" | "dequip">(
    "settings"
  );
  const { openModal } = useContext(ModalContext);

  const farmAddress = useSelector(gameService, _farmAddress);
  const isFullUser = farmAddress !== undefined;
  const xp = useSelector(gameService, _xp);

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const handleDepositModal = () => {
    setShowDepositModal(true);
  };

  const refreshSession = () => {
    onClose();
    gameService.send("RESET");
  };

  const openRefreshMenu = () => {
    setShowRefreshMenu(true);
  };

  const closeRefreshMenu = () => {
    setShowRefreshMenu(false);
  };

  const storeOnChain = async () => {
    openModal("STORE_ON_CHAIN");
  };

  const handleSwapSFL = () => {
    setShowAddSFLModal(true);
  };

  const Content = () => {
    if (view === "dequip") {
      return (
        <Panel className="p-0">
          <GameWallet action="dequip">
            <DequipBumpkin onClose={closeAndResetView} />
          </GameWallet>
        </Panel>
      );
    }

    if (view === "transfer") {
      return (
        <Panel className="p-0">
          <TransferAccount isOpen={true} onClose={closeAndResetView} />
        </Panel>
      );
    }

    return (
      <>
        <CloseButtonPanel title={`Blockchain Settings`} onClose={onClose}>
          <Button onClick={handleDepositModal} className="mb-2">
            <span>{t("deposit")}</span>
          </Button>
          <Button onClick={openRefreshMenu} className="mb-2">
            <span>{t("settingsMenu.refreshChain")}</span>
          </Button>
          <Modal show={showRefreshMenu} onHide={closeRefreshMenu}>
            <CloseButtonPanel className="sm:w-4/5 m-auto">
              <div className="flex flex-col p-2">
                <span className="text-sm text-center">
                  {t("advancedSettings.refreshDescription")}
                </span>
              </div>
              <div className="flex justify-content-around mt-2 space-x-1">
                <Button onClick={refreshSession} className="mb-2">
                  {t("settingsMenu.refreshChain")}
                </Button>
              </div>
            </CloseButtonPanel>
          </Modal>
          <Button onClick={storeOnChain} className="mb-2">
            <span>{t("settingsMenu.storeOnChain")}</span>
          </Button>
          <Button onClick={handleSwapSFL} className="mb-2">
            <span>{t("settingsMenu.swapMaticForSFL")}</span>
          </Button>
          <Button className="mb-2 capitalize" onClick={() => setView("dequip")}>
            {t("dequipper.dequip")}
          </Button>
          {isFullUser && (
            <>
              <Button className="mb-2" onClick={() => setView("transfer")}>
                {t("advancedSettings.transferOwnership")}
              </Button>
            </>
          )}
        </CloseButtonPanel>
        <DepositModal
          farmAddress={farmAddress}
          canDeposit={getBumpkinLevel(xp) >= 3}
          handleClose={() => setShowDepositModal(false)}
          handleDeposit={handleDeposit}
          showDepositModal={showDepositModal}
        />
        <AddSFL
          isOpen={showAddSFLModal}
          onClose={() => setShowAddSFLModal(false)}
        />
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
