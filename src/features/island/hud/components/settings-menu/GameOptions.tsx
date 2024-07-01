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

import { BlockchainSettingsModal } from "./blockchain-settings/BlockchainSettings";
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
import { TransferAccount } from "./blockchain-settings/TransferAccount";
import { AddSFL } from "../AddSFL";
import { GeneralSettings } from "./general-settings/GeneralSettings";
import { InstallAppModal } from "./general-settings/InstallAppModal";
import { LanguageSwitcher } from "./general-settings/LanguageChangeModal";
import { Share } from "./general-settings/Share";
import { PlazaSettings } from "./plaza-settings/PlazaSettingsModal";
import { AmoyTestnetActions } from "./amoy-actions/AmoyTestnetActions";
import { Discord } from "./general-settings/DiscordModal";
import { DepositWrapper } from "features/goblins/bank/components/Deposit";
import { useSound } from "lib/utils/hooks/useSound";
import { AppearanceSettings } from "./general-settings/AppearanceSettings";
import { FontSettings } from "./general-settings/FontSettings";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import ticket from "assets/icons/ticket.png";

export interface ContentComponentProps {
  onSubMenuClick: (id: SettingMenuId) => void;
  onClose: () => void;
}

const GameOptions: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
  onClose,
}) => {
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const { walletService } = useContext(WalletContext);

  const { t } = useAppTranslation();

  const [isConfirmLogoutModalOpen, showConfirmLogoutModal] = useState(false);

  const copypaste = useSound("copypaste");
  const button = useSound("button");

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
      onSubMenuClick("installApp");
    }
  };

  const refreshSession = () => {
    gameService.send("RESET");
    onClose();
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
        <div className="flex flex-wrap items-center justify-between mx-2">
          <Label
            type="default"
            icon={SUNNYSIDE.icons.search}
            className="mb-1 mr-4"
            onClick={() => {
              copypaste.play();
              clipboard.copy(
                gameService.state?.context?.farmId.toString() as string,
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
              icon={ticket}
              className="mb-1 mr-4"
              onClick={() => {
                copypaste.play();
                clipboard.copy(
                  gameService.state?.context?.nftId?.toString() || "",
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
                copypaste.play();
                clipboard.copy(
                  gameService.state?.context?.linkedWallet as string,
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
        <Button className="p-1 mb-1" onClick={handleInstallApp}>
          <span>{t("install.app")}</span>
        </Button>
      )}
      {/* To revamp and add back later*/}
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
      <Button className="p-1 mb-1" onClick={refreshSession}>
        {t("gameOptions.blockchainSettings.refreshChain")}
      </Button>
      {CONFIG.NETWORK === "amoy" && (
        <Button className="p-1 mb-1" onClick={() => onSubMenuClick("amoy")}>
          <span>{t("gameOptions.amoyActions")}</span>
        </Button>
      )}
      <Button className="p-1 mb-1" onClick={() => onSubMenuClick("blockchain")}>
        <span>{t("gameOptions.blockchainSettings")}</span>
      </Button>
      <Button className="p-1 mb-1" onClick={() => onSubMenuClick("general")}>
        <span>{t("gameOptions.generalSettings")}</span>
      </Button>
      <Button className="p-1 mb-1" onClick={() => onSubMenuClick("plaza")}>
        <span>{t("gameOptions.plazaSettings")}</span>
      </Button>
      <Button className="p-1 mb-1" onClick={() => showConfirmLogoutModal(true)}>
        {t("gameOptions.logout")}
      </Button>
      <p className="mx-1 text-xxs">
        <a
          href="https://github.com/sunflower-land/sunflower-land/releases"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {CONFIG.RELEASE_VERSION?.split("-")[0]}
        </a>
      </p>
      <ConfirmationModal
        show={isConfirmLogoutModalOpen}
        onHide={() => showConfirmLogoutModal(false)}
        messages={[t("gameOptions.confirmLogout")]}
        onCancel={() => showConfirmLogoutModal(false)}
        onConfirm={onLogout}
        confirmButtonLabel={t("gameOptions.logout")}
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
  const [selected, setSelected] = useState<SettingMenuId>("main");

  const onHide = () => {
    onClose();
    setSelected("main");
  };

  const SelectedComponent = settingMenus[selected].content;

  return (
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
        <SelectedComponent onSubMenuClick={setSelected} onClose={onHide} />
      </CloseButtonPanel>
    </Modal>
  );
};

export type SettingMenuId =
  // Game Options
  | "main"
  | "installApp"
  | "amoy"
  | "blockchain"
  | "general"
  | "plaza"

  // Blockchain Settings
  | "deposit"
  | "swapSFL"
  | "storeChain"
  | "dequip"
  | "transfer"

  // General Settings
  | "discord"
  | "changeLanguage"
  | "share"
  | "appearance"
  | "font";

interface SettingMenu {
  title: string;
  parent: SettingMenuId;
  content: React.FC<ContentComponentProps>;
}

export const settingMenus: Record<SettingMenuId, SettingMenu> = {
  // Game Options
  main: {
    title: translate("gameOptions.title"),
    parent: "main",
    content: GameOptions,
  },
  installApp: {
    title: translate("install.app"),
    parent: "main",
    content: InstallAppModal,
  },
  amoy: {
    title: translate("gameOptions.amoyActions"),
    parent: "main",
    content: AmoyTestnetActions,
  },
  blockchain: {
    title: translate("gameOptions.blockchainSettings"),
    parent: "main",
    content: BlockchainSettingsModal,
  },
  general: {
    title: translate("gameOptions.generalSettings"),
    parent: "main",
    content: GeneralSettings,
  },
  plaza: {
    title: translate("gameOptions.plazaSettings"),
    parent: "main",
    content: PlazaSettings,
  },

  // Blockchain Settings
  deposit: {
    title: translate("deposit"),
    parent: "blockchain",
    content: DepositWrapper,
  },
  storeChain: {
    title: translate("transaction.storeProgress"),
    parent: "blockchain",
    content: () => <></>, // To add later
  },
  dequip: {
    title: translate("dequipper.dequip"),
    parent: "blockchain",
    content: DequipBumpkin,
  },
  transfer: {
    title: translate("gameOptions.blockchainSettings.transferOwnership"),
    parent: "blockchain",
    content: TransferAccount,
  },
  swapSFL: {
    title: translate("gameOptions.blockchainSettings.swapMaticForSFL"),
    parent: "blockchain",
    content: AddSFL,
  },

  // General Settings
  discord: {
    title: "Discord",
    parent: "general",
    content: Discord,
  },
  changeLanguage: {
    title: translate("gameOptions.generalSettings.changeLanguage"),
    parent: "general",
    content: LanguageSwitcher,
  },
  share: {
    title: translate("share.ShareYourFarmLink"),
    parent: "general",
    content: Share,
  },
  appearance: {
    title: translate("gameOptions.generalSettings.appearance"),
    parent: "general",
    content: AppearanceSettings,
  },
  font: {
    title: translate("gameOptions.generalSettings.font"),
    parent: "appearance",
    content: FontSettings,
  },
};
