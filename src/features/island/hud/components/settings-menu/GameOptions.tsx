import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import clipboard from "clipboard";
import { CONFIG } from "lib/config";

import { Button } from "components/ui/Button";
import * as Auth from "features/auth/lib/Provider";

import { Context as GameContext } from "features/game/GameProvider";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { translate } from "lib/i18n/translate";

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
import { TransferAccount } from "./blockchain-settings/TransferAccount";
import { AddSFL } from "../AddSFL";
import { GeneralSettings } from "./general-settings/GeneralSettings";
import { InstallAppModal } from "./general-settings/InstallAppModal";
import { LanguageSwitcher } from "./general-settings/LanguageChangeModal";
import { Share } from "./general-settings/Share";
import { PlazaSettings } from "./plaza-settings/PlazaSettingsModal";
import { DeveloperOptions } from "./developer-options/DeveloperOptions";
import { Discord } from "./general-settings/DiscordModal";
import { DepositWrapper } from "features/goblins/bank/components/Deposit";
import { useSound } from "lib/utils/hooks/useSound";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import ticket from "assets/icons/ticket.png";
import lockIcon from "assets/icons/lock.png";
import { DEV_HoarderCheck } from "./developer-options/DEV_HoardingCheck";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { PickServer } from "./plaza-settings/PickServer";
import { PlazaShaderSettings } from "./plaza-settings/PlazaShaderSettings";
import { AdminSettings } from "./general-settings/AdminSettings";
import { Preferences } from "./general-settings/Preferences";
import { Notifications } from "./general-settings/Notifications";
import { AuthMachineState } from "features/auth/lib/authMachine";
import {
  getSubscriptionsForFarmId,
  Subscriptions,
} from "features/game/actions/subscriptions";
import { preload } from "swr";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Verify } from "features/game/components/bank/components/Withdraw";

export interface ContentComponentProps {
  onSubMenuClick: (id: SettingMenuId) => void;
  onClose: () => void;
}

export const subscriptionsFetcher = ([, token, farmId]: [
  string,
  string,
  number,
]): Promise<Subscriptions> => {
  return getSubscriptionsForFarmId(farmId, token);
};

const _farmId = (state: MachineState) => state.context.farmId;
const _nftId = (state: MachineState) => state.context.nftId;
const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _transaction = (state: MachineState) => state.context.state.transaction;
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;

const GameOptions: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
  onClose,
}) => {
  const { gameService } = useContext(GameContext);

  const farmId = useSelector(gameService, _farmId);
  const nftId = useSelector(gameService, _nftId);
  const linkedWallet = useSelector(gameService, _linkedWallet);
  const transaction = useSelector(gameService, _transaction);
  const wardrobe = useSelector(gameService, _wardrobe);

  const { authService } = useContext(Auth.Context);
  const { walletService } = useContext(WalletContext);

  const { t } = useAppTranslation();

  const [isConfirmLogoutModalOpen, showConfirmLogoutModal] = useState(false);
  const [showFarm, setShowFarm] = useState(false);
  const [showNftId, setShowNftId] = useState(false);

  const copypaste = useSound("copypaste");

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

  const canRefresh = !transaction;
  const hasDevAccess =
    CONFIG.NETWORK === "amoy" || !!wardrobe.Halo || !!wardrobe["Gift Giver"];

  return (
    <>
      {/* Root menu */}
      <>
        <div className="flex flex-wrap items-center justify-between mx-2">
          <Label
            type="default"
            icon={SUNNYSIDE.icons.search}
            popup={showFarm}
            className="mb-1 mr-4"
            onClick={() => {
              setShowFarm(true);
              setTimeout(() => {
                setShowFarm(false);
              }, 2000);
              copypaste.play();
              clipboard.copy(farmId.toString());
            }}
          >
            {t("gameOptions.farmId", {
              farmId,
            })}
          </Label>
          {nftId && (
            <Label
              type="default"
              icon={ticket}
              popup={showNftId}
              className="mb-1 mr-4"
              onClick={() => {
                setShowNftId(true);
                setTimeout(() => {
                  setShowNftId(false);
                }, 2000);
                copypaste.play();
                clipboard.copy(nftId.toString() || "");
              }}
            >
              {`NFT ID #${nftId}`}
            </Label>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between mx-2">
          {linkedWallet && (
            <WalletAddressLabel
              walletAddress={linkedWallet}
              showLabelTitle={true}
            />
          )}
        </div>
      </>
      <div className="flex flex-col gap-1">
        {!isPWA && (
          <Button onClick={handleInstallApp}>
            <span>{t("install.app")}</span>
          </Button>
        )}
        <Button
          disabled={!canRefresh}
          className="relative"
          onClick={refreshSession}
        >
          {t("gameOptions.blockchainSettings.refreshChain")}

          {!canRefresh && (
            <img src={lockIcon} className="absolute right-1 top-0.5 h-7" />
          )}
        </Button>
        <div className="grid grid-cols-2 gap-1">
          {hasDevAccess && (
            <Button onClick={() => onSubMenuClick("amoy")}>
              <span>{t("gameOptions.developerOptions")}</span>
            </Button>
          )}
          <Button onClick={() => onSubMenuClick("blockchain")}>
            <span>{t("gameOptions.blockchainSettings")}</span>
          </Button>
          <Button onClick={() => onSubMenuClick("general")}>
            <span>{t("gameOptions.generalSettings")}</span>
          </Button>
          <Button onClick={() => onSubMenuClick("plaza")}>
            <span>{t("gameOptions.plazaSettings")}</span>
          </Button>
          <Button
            className={hasDevAccess ? "col-span-2" : ""}
            onClick={() => showConfirmLogoutModal(true)}
          >
            {t("gameOptions.logout")}
          </Button>
        </div>
      </div>
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

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

const preloadSubscriptions = async (token: string, farmId: number) => {
  preload(
    ["/notifications/subscriptions", token, farmId],
    subscriptionsFetcher,
  );
};

export const GameOptionsModal: React.FC<GameOptionsModalProps> = ({
  show,
  onClose,
}) => {
  const { authService } = useContext(Auth.Context);

  const token = useSelector(authService, _token);
  const { gameService } = useContext(GameContext);
  const farmId = useSelector(gameService, _farmId);
  const [selected, setSelected] = useState<SettingMenuId>("main");

  useEffect(() => {
    if (farmId) preloadSubscriptions(token, farmId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmId]);

  const onHide = async () => {
    onClose();
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
  | "admin"

  // Blockchain Settings
  | "deposit"
  | "swapSFL"
  | "dequip"
  | "transfer"

  // General Settings
  | "discord"
  | "changeLanguage"
  | "share"
  | "preferences"
  | "verifyPersonhood"

  // Push Notifications
  | "notifications"
  // Amoy Testnet Actions
  | "hoardingCheck"
  // Plaza Settings
  | "pickServer"
  | "shader";

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
    title: translate("gameOptions.developerOptions"),
    parent: "main",
    content: DeveloperOptions,
  },
  blockchain: {
    title: translate("gameOptions.blockchainSettings"),
    parent: "main",
    content: BlockchainSettings,
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
    title: translate("gameOptions.blockchainSettings.swapPOLForSFL"),
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
  preferences: {
    title: translate("gameOptions.generalSettings.preferences"),
    parent: "general",
    content: Preferences,
  },
  verifyPersonhood: {
    title: "Verify Personhood",
    parent: "general",
    content: Verify,
  },
  notifications: {
    title: translate("gameOptions.notifications"),
    parent: "general",
    content: (props) => <Notifications {...props} />,
  },

  // Developer Options
  admin: {
    title: `Admin`,
    parent: "amoy",
    content: AdminSettings,
  },
  hoardingCheck: {
    title: "Hoarding Check (DEV)",
    parent: "amoy",
    content: (props) => <DEV_HoarderCheck {...props} />,
  },

  // Plaza Settings
  pickServer: {
    title: translate("gameOptions.plazaSettings.pickServer"),
    parent: "plaza",
    content: PickServer,
  },
  shader: {
    title: translate("gameOptions.plazaSettings.shader"),
    parent: "plaza",
    content: PlazaShaderSettings,
  },
};
