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
import { translate } from "lib/i18n/translate";

import walletIcon from "assets/icons/wallet.png";
import { removeJWT } from "features/auth/actions/social";
import { WalletContext } from "features/wallet/WalletProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
import { DequipBumpkin } from "./blockchain-settings/DequipBumpkin";

export const GameOptions: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const { walletService } = useContext(WalletContext);

  const { t } = useAppTranslation();

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
      onSubMenuClick("main");
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
        <Button className="p-1 mb-2" onClick={() => onSubMenuClick("main")}>
          <span>{t("gameOptions.amoyActions")}</span>
        </Button>
      )}
      <Button className="p-1 mb-2" onClick={refreshSession}>
        {t("gameOptions.blockchainSettings.refreshChain")}
      </Button>
      <Button className="p-1 mb-2" onClick={() => onSubMenuClick("blockchain")}>
        <span>{t("gameOptions.blockchainSettings")}</span>
      </Button>
      <Button className="p-1 mb-2" onClick={() => onSubMenuClick("main")}>
        <span>{t("gameOptions.generalSettings")}</span>
      </Button>
      <Button className="p-1 mb-2" onClick={() => onSubMenuClick("main")}>
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
          <p className="mx-1 text-xxs">
            {CONFIG.RELEASE_VERSION?.split("-")[0]}
          </p>
        </CloseButtonPanel>
      </Modal>
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
  // const settingsOptions: SettingsType[] = [
  //   t("gameOptions.title"),
  //   t("gameOptions.amoyActions"),
  //   t("gameOptions.blockchainSettings"),
  //   t("gameOptions.generalSettings"),
  //   t("gameOptions.plazaSettings"),
  //   t("install.app"),
  // ];
  const [selected, setSelected] = useState<SettingMenuId>("main");

  const onHide = () => {
    onClose();
    setSelected("main");
  };

  const SelectedComponent = settingMenus[selected].content;

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <CloseButtonPanel
          title={settingMenus[selected].title}
          onBack={
            selected !== "main"
              ? () => setSelected(settingMenus[selected].parent)
              : undefined
          }
          onClose={onHide}
        >
          <SelectedComponent onSubMenuClick={setSelected} />
          {/* {selected === "m" && <GameOptions onSelect={setSelected} />}
          {selected === 1 && <AmoyTestnetActions />}
          {selected === 2 && <BlockchainSettings />}
          {selected === 3 && <GeneralSettings />}
          {selected === 4 && <PlazaSettings />}
          {selected === 5 && <InstallAppModal />} */}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

export type SettingMenuId =
  | "main"
  | "blockchain"
  | "dequip"
  | "transfer"
  | "deposit"
  | "swapSFL";

interface SettingMenu {
  title: string;
  parent: SettingMenuId;
  content: React.FC<ContentComponentProps>;
}

export interface ContentComponentProps {
  onSubMenuClick: (id: SettingMenuId) => void;
}

export const settingMenus: Record<SettingMenuId, SettingMenu> = {
  main: {
    title: translate("gameOptions.title"),
    parent: "main",
    content: GameOptions,
  },
  blockchain: {
    title: translate("gameOptions.blockchainSettings"),
    parent: "main",
    content: BlockchainSettings,
  },
  dequip: {
    title: "todo",
    parent: "blockchain",
    content: DequipBumpkin,
  },
  transfer: {
    title: "todo",
    parent: "blockchain",
    content: () => <></>,
  },
  swapSFL: {
    title: "todo",
    parent: "blockchain",
    content: () => <></>,
  },
  deposit: {
    title: "todo",
    parent: "main",
    content: () => <></>,
  },
};
