import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import clipboard from "clipboard";
import { CONFIG } from "lib/config";

import { Button } from "components/ui/Button";
import * as Auth from "features/auth/lib/Provider";

import { Context as GameContext } from "features/game/GameProvider";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { shortAddress } from "lib/utils/shortAddress";

import walletIcon from "assets/icons/wallet.png";
import { removeJWT } from "features/auth/actions/social";
import { WalletContext } from "features/wallet/WalletProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { AmoyTestnetActions } from "./amoy-actions/AmoyTestnetActions";
import { BlockchainSettings } from "./blockchain-settings/BlockchainSettings";
import { usePWAInstall } from "features/pwa/PWAInstallProvider";
import { fixInstallPromptTextStyles } from "features/pwa/lib/fixInstallPromptStyles";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import {
  isMobile,
  isIOS,
  isSafari,
  isAndroid,
  isChrome,
} from "mobile-device-detect";
import { InstallAppModal } from "./general-settings/InstallAppModal";

enum MENU_LEVELS {
  ROOT = "root",
}

interface GameOptionsProps {
  onSelect: (id: number) => void;
}

type SettingsType =
  | "Game Options"
  | "Amoy Testnet Actions"
  | "Blockchain Settings"
  | "General Settings"
  | "Plaza Settings";

export const GameOptions: React.FC<GameOptionsProps> = ({ onSelect }) => {
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const { walletService } = useContext(WalletContext);

  const { t } = useAppTranslation();

  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);
  const [showInstallAppModal, setShowInstallAppModal] = useState(false);
  const [isConfirmLogoutModalOpen, showConfirmLogoutModal] = useState(false);

  const isPWA = useIsPWA();
  const isWeb3MobileBrowser = isMobile && !!window.ethereum;
  const pwaInstall = usePWAInstall();

  const handleInstallApp = () => {
    if (isMobile && !isWeb3MobileBrowser) {
      if (isIOS && isSafari) {
        pwaInstall.current?.showDialog();
      } else if (isAndroid && isChrome) {
        pwaInstall.current?.install();
      }

      fixInstallPromptTextStyles();
    } else {
      setShowInstallAppModal(true);
    }
  };

  const refreshSession = () => {
    gameService.send("RESET");
  };

  const onLogout = () => {
    removeJWT();
    authService.send("LOGOUT");
    walletService.send("RESET");
  };
  return (
    <>
      {/* Root menu */}
      {menuLevel === MENU_LEVELS.ROOT && (
        <>
          <div className="flex flex-wrap items-center justify-start mx-2">
            <Label
              type="default"
              icon={SUNNYSIDE.icons.search}
              className="mb-1 mr-4"
              onClick={() => {
                clipboard.copy(
                  gameService.state?.context?.farmId.toString() as string
                );
              }}
            >
              {t("gameOptions.farmId", {
                farmId: gameService.state?.context?.farmId,
              })}
            </Label>
            {gameService.state?.context?.nftId !== undefined && (
              <Label
                type="default"
                icon={SUNNYSIDE.icons.search}
                className="mb-1 mr-4"
                onClick={() => {
                  clipboard.copy(
                    gameService.state?.context?.nftId?.toString() || ""
                  );
                }}
              >
                {`NFT ID #${gameService.state?.context?.nftId}`}
              </Label>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between mx-2">
            {gameService.state?.context?.linkedWallet && (
              <Label
                type="formula"
                className="mb-1 mr-4"
                icon={walletIcon}
                onClick={() => {
                  clipboard.copy(
                    gameService.state?.context?.linkedWallet as string
                  );
                }}
              >
                {t("linked.wallet")} {"-"}{" "}
                {shortAddress(gameService.state.context.linkedWallet)}
              </Label>
            )}
          </div>
        </>
      )}
      {!isPWA && (
        <Button className="p-1 mb-2" onClick={handleInstallApp}>
          <span>{t("install.app")}</span>
        </Button>
      )}
      {/* <li className="p-1">
                  <Button disabled={true} onClick={handleHowToPlay}>
                    <div className="flex items-center justify-center">
                      <span>{t("gameOptions.howToPlay")}</span>
                      <img
                        src={SUNNYSIDE.icons.expression_confused}
                        className="w-3 ml-2"
                        alt="question-mark"
                      />
                    </div>
                  </Button>
                  </li> */}
      {CONFIG.NETWORK === "amoy" && (
        <Button className="p-1 mb-2" onClick={() => onSelect(1)}>
          <span>{t("gameOptions.amoyActions")}</span>
        </Button>
      )}
      <Button className="p-1 mb-2" onClick={refreshSession}>
        {t("gameOptions.blockchainSettings.refreshChain")}
      </Button>
      <Button className="p-1 mb-2" onClick={() => onSelect(2)}>
        <span>{t("gameOptions.blockchainSettings")}</span>
      </Button>
      <Button className="p-1 mb-2" onClick={() => onSelect(3)}>
        <span>{t("gameOptions.generalSettings")}</span>
      </Button>
      <Button className="p-1 mb-2" onClick={() => onSelect(4)}>
        <span>{t("gameOptions.plazaSettings")}</span>
      </Button>
      <Button className="p-1 mb-2" onClick={() => showConfirmLogoutModal(true)}>
        {t("gameOptions.logout")}
      </Button>
      <Modal
        show={isConfirmLogoutModalOpen}
        onHide={() => showConfirmLogoutModal(false)}
      >
        <CloseButtonPanel className="sm:w-4/5 m-auto">
          <div className="flex flex-col p-2">
            <span className="text-sm text-center">
              {t("gameOptions.confirmLogout")}
            </span>
          </div>
          <div className="flex justify-content-around mt-2 space-x-1">
            <Button onClick={onLogout}>{t("gameOptions.logout")}</Button>
            <Button onClick={() => showConfirmLogoutModal(false)}>
              {t("cancel")}
            </Button>
          </div>
        </CloseButtonPanel>
      </Modal>
      <InstallAppModal
        isOpen={showInstallAppModal}
        onClose={() => setShowInstallAppModal(false)}
      />
    </>
  );
};

interface GameOptionsModalProps {
  show: boolean;
  onClose: () => void;
}

export const GameOptionsModal: React.FC<GameOptionsModalProps> = ({
  show,
  onClose,
}) => {
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);

  const settingsOptions: SettingsType[] = [
    "Game Options",
    "Amoy Testnet Actions",
    "Blockchain Settings",
    "General Settings",
    "Plaza Settings",
  ];
  const [selected, setSelected] = useState(0);

  const onHide = () => {
    onClose();
    setMenuLevel(MENU_LEVELS.ROOT);
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <CloseButtonPanel
          title={settingsOptions[selected]}
          onBack={selected ? () => setSelected(0) : undefined}
        >
          {selected === 0 && <GameOptions onSelect={setSelected} />}
          {selected === 1 && <AmoyTestnetActions />}
          {selected === 2 && <BlockchainSettings />}
          <p className="mx-1 text-xxs">
            {CONFIG.RELEASE_VERSION?.split("-")[0]}
          </p>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
