import { Modal } from "components/ui/Modal";
import clipboard from "clipboard";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Context as GameContext } from "features/game/GameProvider";

import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Label } from "components/ui/Label";
import { shortAddress } from "lib/utils/shortAddress";
import { getBumpkinLevel } from "features/game/lib/level";

import walletIcon from "assets/icons/wallet.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useActor, useSelector } from "@xstate/react";
import { DepositModal } from "features/goblins/bank/components/Deposit";
import { DepositArgs } from "lib/blockchain/Deposit";
import React, { useContext, useState } from "react";
import { DequipBumpkin } from "./DequipBumpkin";
import { AddSFL } from "../../AddSFL";
import { TransferAccount } from "./TransferAccount";

enum MENU_LEVELS {
  ROOT = "root",
  COMMUNITY = "community",
  ON_RAMP_MATIC = "on-ramp-matic",
  ON_RAMP_SFL = "on-ramp-sfl",
}

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
  const [showAddSFLModal, setShowAddSFLModal] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showRefreshMenu, setShowRefreshMenu] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferAccountModal, setShowTransferAccountModal] =
    useState(false);
  const [showDequipperModal, setShowDequipperModal] = useState(false);
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);
  const { openModal } = useContext(ModalContext);

  const [gameState] = useActor(gameService);
  const farmAddress = useSelector(gameService, _farmAddress);
  const linkedWallet = gameState.context;
  const xp = useSelector(gameService, _xp);
  const isFullUser = farmAddress !== undefined;
  const showDequipper = !!linkedWallet;

  const handleSwapSFL = () => {
    setShowAddSFLModal(true);
    onClose();
  };

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const handleDepositModal = () => {
    setShowDepositModal(true);
    onClose();
  };

  const handleTransferOwnership = () => {
    setShowTransferAccountModal(true);
    onClose();
  };

  const handleDequipper = () => {
    setShowDequipperModal(true);
    onClose();
  };

  const storeOnChain = async () => {
    openModal("STORE_ON_CHAIN");
    onClose();
  };

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha, blockBucks: 0 });
    onClose();
    setShowCaptcha(false);
  };

  const onHide = () => {
    onClose();
    setMenuLevel(MENU_LEVELS.ROOT);
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
  return (
    <>
      <Modal show={isOpen} onHide={onHide}>
        <CloseButtonPanel title={`Blockchain Settings`}>
          <ul className="list-none">
            {menuLevel === MENU_LEVELS.ROOT && (
              <>
                <div className="flex flex-wrap items-center justify-between mx-2">
                  <Label
                    type="default"
                    icon={SUNNYSIDE.icons.search}
                    className="mb-1"
                    onClick={() => {
                      clipboard.copy(
                        gameService.state?.context?.farmId.toString() as string
                      );
                    }}
                  >
                    {`ID #${gameService.state?.context?.farmId}`}
                  </Label>
                  {gameService.state?.context?.linkedWallet && (
                    <Label
                      type="formula"
                      className="mb-1"
                      icon={walletIcon}
                      onClick={() => {
                        clipboard.copy(
                          gameService.state?.context?.linkedWallet as string
                        );
                      }}
                    >
                      {t("linked.wallet")} {"-"}
                      {shortAddress(gameService.state.context.linkedWallet)}
                    </Label>
                  )}
                </div>
                <li className="p-1">
                  <Button onClick={handleDepositModal}>
                    <span>{t("deposit")}</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={openRefreshMenu}>
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
                        <Button onClick={refreshSession}>
                          {t("settingsMenu.refreshChain")}
                        </Button>
                      </div>
                    </CloseButtonPanel>
                  </Modal>
                </li>
                <li className="p-1">
                  <Button onClick={storeOnChain}>
                    <span>{t("settingsMenu.storeOnChain")}</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={handleSwapSFL}>
                    <span>{t("settingsMenu.swapMaticForSFL")}</span>
                  </Button>
                </li>
                {isFullUser && (
                  <li className="p-1">
                    <Button onClick={handleTransferOwnership}>
                      <span>{t("advancedSettings.transferOwnership")}</span>
                    </Button>
                  </li>
                )}
                {showDequipper && (
                  <li className="p-1">
                    <Button onClick={handleDequipper}>
                      <span>{t("dequipper.dequip")}</span>
                    </Button>
                  </li>
                )}
              </>
            )}
          </ul>
        </CloseButtonPanel>
      </Modal>
      <TransferAccount
        isOpen={showTransferAccountModal}
        onClose={() => setShowTransferAccountModal(false)}
      />
      <DequipBumpkin
        isOpen={showDequipperModal}
        onClose={() => setShowDequipperModal(false)}
      />
      <AddSFL
        isOpen={showAddSFLModal}
        onClose={() => setShowAddSFLModal(false)}
      />
      <DepositModal
        farmAddress={farmAddress}
        canDeposit={getBumpkinLevel(xp) >= 3}
        handleClose={() => setShowDepositModal(false)}
        handleDeposit={handleDeposit}
        showDepositModal={showDepositModal}
      />
      {showCaptcha && (
        <Modal show={showCaptcha} onHide={() => setShowCaptcha(false)}>
          <Panel>
            <img
              src={SUNNYSIDE.icons.close}
              className="absolute cursor-pointer z-20"
              alt="Close Logout Confirmation Modal"
              onClick={() => setShowCaptcha(false)}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />

            <CloudFlareCaptcha onDone={onCaptchaSolved} action="sync" />
          </Panel>
        </Modal>
      )}
    </>
  );
};
