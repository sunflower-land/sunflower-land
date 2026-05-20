import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import clipboard from "clipboard";

import { Button } from "components/ui/Button";
import * as Auth from "features/auth/lib/Provider";

import { Context as GameContext } from "features/game/GameProvider";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { translate } from "lib/i18n/translate";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { About } from "./about/About";
import { AppearanceSettings } from "./general-settings/AppearanceSettings";
import { AudioSettings } from "./general-settings/AudioSettings";
import { BehaviourSettings } from "./general-settings/BehaviourSettings";
import { Notifications } from "./general-settings/Notifications";
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
import { AddSFL } from "../AddSFL";
import { Account } from "./account/Account";
import { Advanced } from "./advanced/Advanced";
import { InstallAppModal } from "./general-settings/InstallAppModal";
import { LanguageSwitcher } from "./general-settings/LanguageChangeModal";
import { PlazaSettings } from "./plaza-settings/PlazaSettingsModal";
import { DeveloperOptions } from "./developer-options/DeveloperOptions";
import { LinkedAccounts } from "./linked-accounts/LinkedAccounts";
import { LinkWallet } from "features/wallet/components/LinkWallet";
import { LinkGoogle } from "features/auth/components/LinkGoogle";
import { Discord } from "./general-settings/DiscordModal";
import { DepositWrapper } from "features/goblins/bank/components/DepositGameItems";
import { useSound } from "lib/utils/hooks/useSound";
import { DEV_HoarderCheck } from "./developer-options/DEV_HoardingCheck";
import { PickServer } from "./plaza-settings/PickServer";
import { PlazaShaderSettings } from "./plaza-settings/PlazaShaderSettings";
import { Preferences } from "./general-settings/Preferences";
import { AuthMachineState } from "features/auth/lib/authMachine";
import {
  getSubscriptionsForFarmId,
  Subscriptions,
} from "features/game/actions/subscriptions";
import { preload } from "swr";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { ReferralWidget } from "features/announcements/AnnouncementWidgets";
import { AirdropPlayer } from "./general-settings/AirdropPlayer";
import { FaceRecognitionSettings } from "features/retreat/components/personhood/FaceRecognition";
import { TransferAccountWrapper } from "./blockchain-settings/TransferAccount";
import { DEV_PlayerSearch } from "./developer-options/DEV_PlayerSearch";
import { DEV_ErrorSearch } from "./developer-options/DEV_ErrorSearch";
import { ApiKey } from "./general-settings/ApiKey";
import { ExperimentsSettings } from "./experiments-settings/ExperimentsSettings";
import { EconomyEditorExperimentSettings } from "./experiments-settings/EconomyEditorExperimentSettings";

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

const GameOptions: React.FC<ContentComponentProps> = ({ onSubMenuClick }) => {
  const { gameService } = useContext(GameContext);

  const { t } = useAppTranslation();

  const [showFarm, setShowFarm] = useState(false);

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

  const farmId = useSelector(gameService, (state) => state.context.farmId);

  const menuButtons: {
    id: string;
    content: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }[] = [
    {
      id: "preferences",
      content: <span>{t("gameOptions.generalSettings.preferences")}</span>,
      onClick: () => onSubMenuClick("preferences"),
    },
    {
      id: "plaza",
      content: <span>{t("gameOptions.plazaSettings")}</span>,
      onClick: () => onSubMenuClick("plaza"),
    },
    {
      id: "account",
      content: <span>{t("gameOptions.account")}</span>,
      onClick: () => onSubMenuClick("account"),
    },
    {
      id: "advanced",
      content: <span>{t("gameOptions.advanced")}</span>,
      onClick: () => onSubMenuClick("advanced"),
    },
    {
      id: "about",
      content: <span>{t("gameOptions.about")}</span>,
      onClick: () => onSubMenuClick("about"),
    },
    ...(!isPWA
      ? [
          {
            id: "installApp",
            content: <span>{t("install.app")}</span>,
            onClick: handleInstallApp,
          },
        ]
      : []),
  ];

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
            {t("gameOptions.farmId", { farmId })}
          </Label>
        </div>
      </>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {menuButtons.map((button, index) => {
          const isLast = index === menuButtons.length - 1;
          const spanFull = isLast && menuButtons.length % 2 === 1;
          return (
            <Button
              key={button.id}
              onClick={button.onClick}
              disabled={button.disabled}
              className={`p-1 ${spanFull ? "col-span-1 sm:col-span-2" : ""}`}
            >
              {button.content}
            </Button>
          );
        })}
      </div>
    </>
  );
};

interface GameOptionsModalProps {
  show: boolean;
  onClose: () => void;
}

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

const _farmId = (state: MachineState) => state.context.farmId;

const preloadSubscriptions = async (token: string, farmId: number) => {
  preload(
    ["/notifications/subscriptions", token, farmId],
    subscriptionsFetcher,
  );
};

const _linkingSocial = (state: MachineState) => state.matches("linkingSocial");
const _linkingSocialSuccess = (state: MachineState) =>
  state.matches("linkingSocialSuccess");
const _linkingWallet = (state: MachineState) => state.matches("linkingWallet");
const _linkingWalletSuccess = (state: MachineState) =>
  state.matches("linkingWalletSuccess");

export const GameOptionsModal: React.FC<GameOptionsModalProps> = ({
  show,
  onClose,
}) => {
  const { authService } = useContext(Auth.Context);

  const token = useSelector(authService, _token);
  const { gameService } = useContext(GameContext);
  const farmId = useSelector(gameService, _farmId);
  const [selected, setSelected] = useState<SettingMenuId>("main");
  const isLinkingSocial = useSelector(gameService, _linkingSocial);
  const isLinkingSocialSuccess = useSelector(
    gameService,
    _linkingSocialSuccess,
  );
  const isLinkingWallet = useSelector(gameService, _linkingWallet);
  const isLinkingWalletSuccess = useSelector(
    gameService,
    _linkingWalletSuccess,
  );
  const isLinkingInFlight =
    isLinkingSocial ||
    isLinkingSocialSuccess ||
    isLinkingWallet ||
    isLinkingWalletSuccess;

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
    <Modal show={show} onHide={isLinkingInFlight ? undefined : onHide}>
      <CloseButtonPanel
        title={settingMenus[selected].title}
        onBack={
          !isLinkingInFlight && selected !== "main"
            ? () => setSelected(settingMenus[selected].parent)
            : undefined
        }
        onClose={isLinkingInFlight ? undefined : onHide}
      >
        <SelectedComponent onSubMenuClick={setSelected} onClose={onHide} />
      </CloseButtonPanel>
      <ReferralWidget />
    </Modal>
  );
};

export type SettingMenuId =
  // Game Options
  | "main"
  | "installApp"
  | "account"
  | "advanced"
  | "about"
  | "amoy"
  | "blockchain"
  | "linkedAccounts"
  | "linkAccountWallet"
  | "linkAccountGoogle"
  | "plaza"
  | "experiments"
  | "economyEditor"
  | "admin"
  | "faceRecognition"
  // Blockchain Settings
  | "deposit"
  | "swapSFL"
  | "dequip"
  | "transfer"

  // Account / Preferences
  | "discord"
  | "changeLanguage"
  | "preferences"
  | "appearance"
  | "behaviour"
  | "audio"
  | "notifications"
  | "apiKey"

  // Amoy Testnet Actions
  | "hoardingCheck"
  | "playerSearch"
  | "errorSearch"
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
  account: {
    title: translate("gameOptions.account"),
    parent: "main",
    content: Account,
  },
  advanced: {
    title: translate("gameOptions.advanced"),
    parent: "main",
    content: Advanced,
  },
  about: {
    title: translate("gameOptions.about"),
    parent: "main",
    content: About,
  },
  amoy: {
    title: translate("gameOptions.developerOptions"),
    parent: "advanced",
    content: DeveloperOptions,
  },
  blockchain: {
    title: translate("gameOptions.blockchainSettings"),
    parent: "advanced",
    content: BlockchainSettings,
  },
  linkedAccounts: {
    title: translate("linkedAccounts.title"),
    parent: "account",
    content: LinkedAccounts,
  },
  linkAccountWallet: {
    title: translate("linkedAccounts.linkWallet"),
    parent: "linkedAccounts",
    content: LinkWallet,
  },
  linkAccountGoogle: {
    title: translate("linkedAccounts.linkGoogle"),
    parent: "linkedAccounts",
    content: LinkGoogle,
  },
  plaza: {
    title: translate("gameOptions.plazaSettings"),
    parent: "main",
    content: PlazaSettings,
  },
  experiments: {
    title: "Experiments",
    parent: "amoy",
    content: ExperimentsSettings,
  },
  economyEditor: {
    title: translate("gameOptions.experiments.economyEditor"),
    parent: "experiments",
    content: EconomyEditorExperimentSettings,
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
    content: TransferAccountWrapper,
  },
  swapSFL: {
    title: translate("gameOptions.blockchainSettings.swapPOLForSFL"),
    parent: "blockchain",
    content: AddSFL,
  },

  // Account
  faceRecognition: {
    title: translate("gameOptions.faceRecognition"),
    parent: "account",
    content: FaceRecognitionSettings,
  },
  discord: { title: "Discord", parent: "account", content: Discord },

  // Preferences hub + leaves
  preferences: {
    title: translate("gameOptions.generalSettings.preferences"),
    parent: "main",
    content: Preferences,
  },
  appearance: {
    title: translate("gameOptions.generalSettings.appearance"),
    parent: "preferences",
    content: () => <AppearanceSettings />,
  },
  behaviour: {
    title: translate("gameOptions.generalSettings.behaviour"),
    parent: "preferences",
    content: () => <BehaviourSettings />,
  },
  audio: {
    title: translate("gameOptions.generalSettings.audio"),
    parent: "preferences",
    content: AudioSettings,
  },
  changeLanguage: {
    title: translate("gameOptions.generalSettings.changeLanguage"),
    parent: "preferences",
    content: LanguageSwitcher,
  },
  notifications: {
    title: translate("gameOptions.generalSettings.notifications"),
    parent: "preferences",
    content: Notifications,
  },

  apiKey: {
    title: translate("share.apiKey"),
    parent: "amoy",
    content: ApiKey,
  },

  // Developer Options
  admin: { title: `Airdrop Player`, parent: "amoy", content: AirdropPlayer },
  hoardingCheck: {
    title: "Hoarding Check (DEV)",
    parent: "amoy",
    content: (props) => <DEV_HoarderCheck {...props} />,
  },
  playerSearch: {
    title: "Player Search (DEV)",
    parent: "amoy",
    content: (props) => <DEV_PlayerSearch {...props} />,
  },
  errorSearch: {
    title: "Error Search (DEV)",
    parent: "amoy",
    content: (props) => <DEV_ErrorSearch {...props} />,
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
