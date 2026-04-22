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
import { AddSFL } from "../AddSFL";
import { Account } from "./account/Account";
import { Advanced } from "./advanced/Advanced";
import { InstallAppModal } from "./general-settings/InstallAppModal";
import { LanguageSwitcher } from "./general-settings/LanguageChangeModal";
import { PlazaSettings } from "./plaza-settings/PlazaSettingsModal";
import { DeveloperOptions } from "./developer-options/DeveloperOptions";
import { Discord } from "./general-settings/DiscordModal";
import { DepositWrapper } from "features/goblins/bank/components/DepositGameItems";
import { useSound } from "lib/utils/hooks/useSound";
import lockIcon from "assets/icons/lock.png";
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

const GameOptions: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
  onClose,
}) => {
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

  const refreshSession = () => {
    gameService.send("RESET");
    onClose();
  };

  const canRefresh = useSelector(
    gameService,
    (state) => !state.context.state.transaction,
  );
  const hideRefresh = useSelector(gameService, (state) => !state.context.nftId);
  const farmId = useSelector(gameService, (state) => state.context.farmId);

  const menuButtons: {
    content: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }[] = [
    {
      content: <span>{t("gameOptions.generalSettings.preferences")}</span>,
      onClick: () => onSubMenuClick("preferences"),
    },
    {
      content: <span>{t("gameOptions.generalSettings.changeLanguage")}</span>,
      onClick: () => onSubMenuClick("changeLanguage"),
    },
    {
      content: <span>{t("gameOptions.plazaSettings")}</span>,
      onClick: () => onSubMenuClick("plaza"),
    },
    {
      content: <span>{t("gameOptions.account")}</span>,
      onClick: () => onSubMenuClick("account"),
    },
    {
      content: <span>{t("gameOptions.advanced")}</span>,
      onClick: () => onSubMenuClick("advanced"),
    },
    ...(!hideRefresh
      ? [
          {
            content: (
              <>
                {t("gameOptions.blockchainSettings.refreshChain")}
                {!canRefresh && (
                  <img
                    src={lockIcon}
                    className="absolute right-1 top-0.5 h-7"
                  />
                )}
              </>
            ),
            onClick: refreshSession,
            disabled: !canRefresh,
          },
        ]
      : []),
    ...(!isPWA
      ? [
          {
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
              key={index}
              onClick={button.onClick}
              disabled={button.disabled}
              className={`p-1 ${spanFull ? "col-span-1 sm:col-span-2" : ""}`}
            >
              {button.content}
            </Button>
          );
        })}
      </div>
      <div className="flex justify-between">
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
  | "amoy"
  | "blockchain"
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

  // Preferences (root-level)
  changeLanguage: {
    title: translate("gameOptions.generalSettings.changeLanguage"),
    parent: "main",
    content: LanguageSwitcher,
  },
  preferences: {
    title: translate("gameOptions.generalSettings.preferences"),
    parent: "main",
    content: Preferences,
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
