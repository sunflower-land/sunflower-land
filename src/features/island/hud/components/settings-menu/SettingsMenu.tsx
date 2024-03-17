/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import clipboard from "clipboard";
import { CONFIG } from "lib/config";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import * as Auth from "features/auth/lib/Provider";

import { Context as GameContext } from "features/game/GameProvider";

import { Share } from "features/island/hud/components/settings-menu/Share";

import { HowToPlay } from "./howToPlay/HowToPlay";
import { SubSettings } from "./sub-settings/SubSettings";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Discord } from "./DiscordModal";
import { AddSFL } from "../AddSFL";
import { SUNNYSIDE } from "assets/sunnyside";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { PokoOnRamp } from "../PokoOnRamp";
import { createPortal } from "react-dom";
import { DEV_TimeMachine } from "./DEV_TimeMachine";
import { PlazaSettings } from "./PlazaSettingsModal";
import { DEV_HoardingCheck } from "components/dev/DEV_HoardingCheck";
import { Label } from "components/ui/Label";
import { shortAddress } from "lib/utils/shortAddress";

import walletIcon from "assets/icons/wallet.png";
import { removeJWT } from "features/auth/actions/social";
import { WalletContext } from "features/wallet/WalletProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { LanguageSwitcher } from "./LanguageChangeModal";
import { usePWAInstall } from "features/pwa/PWAInstallProvider";
import {
  isMobile,
  isIOS,
  isSafari,
  isAndroid,
  isChrome,
} from "mobile-device-detect";
import { fixInstallPromptTextStyles } from "features/pwa/lib/fixInstallPromptStyles";
import { InstallAppModal } from "./InstallAppModal";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";

enum MENU_LEVELS {
  ROOT = "root",
  COMMUNITY = "community",
  ON_RAMP_MATIC = "on-ramp-matic",
  ON_RAMP_SFL = "on-ramp-sfl",
}

interface Props {
  show: boolean;
  onClose: () => void;
  isFarming: boolean;
}

export const SettingsMenu: React.FC<Props> = ({ show, onClose, isFarming }) => {
  const { t } = useAppTranslation();

  const { authService } = useContext(Auth.Context);
  const { walletService } = useContext(WalletContext);
  const { gameService } = useContext(GameContext);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPlazaSettingsModal, setShowPlazaSettingsModal] = useState(false);
  const [showAddSFLModal, setShowAddSFLModal] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showTimeMachine, setShowTimeMachine] = useState(false);
  const [showInstallAppModal, setShowInstallAppModal] = useState(false);
  const [isConfirmLogoutModalOpen, showConfirmLogoutModal] = useState(false);
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);
  const { openModal } = useContext(ModalContext);
  const isPWA = useIsPWA();

  const isWeb3MobileBrowser = isMobile && !!window.ethereum;

  const pwaInstall = usePWAInstall();

  const handleHowToPlay = () => {
    setShowHowToPlay(true);
    onClose();
  };

  const handleShareClick = () => {
    setShowShareModal(true);
    onClose();
    setMenuLevel(MENU_LEVELS.ROOT);
  };

  const handleAddMatic = async () => {
    setMenuLevel(MENU_LEVELS.ON_RAMP_MATIC);
  };

  const handleAddSFL = async () => {
    setMenuLevel(MENU_LEVELS.ON_RAMP_SFL);
  };

  const handleSwapSFL = () => {
    setShowAddSFLModal(true);
    onClose();
  };

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
    onClose();
  };

  const handlePlazaSettingsClick = () => {
    setShowPlazaSettingsModal(true);
    onClose();
  };

  const handleDiscordClick = () => {
    setShowDiscordModal(true);
    onClose();
  };

  const storeOnChain = async () => {
    openModal("STORE_ON_CHAIN");
    onClose();
  };

  const changeLanguage = () => {
    setShowLanguageModal(true);
    onClose();
  };

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

  const onLogout = () => {
    removeJWT();
    authService.send("LOGOUT");
    walletService.send("RESET");
    onClose();
  };

  const openConfirmLogoutModal = () => {
    showConfirmLogoutModal(true);
  };
  const closeConfirmLogoutModal = () => {
    showConfirmLogoutModal(false);
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Panel>
          <ul className="list-none">
            {/* Root menu */}
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
                    {`ID #${gameService.state?.context?.farmId}`}{" "}
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
                      {t("linked.wallet")} {"-"}{" "}
                      {shortAddress(gameService.state.context.linkedWallet)}
                    </Label>
                  )}
                </div>
                {CONFIG.NETWORK === "mumbai" && (
                  <>
                    <li className="p-1">
                      <Button
                        onClick={() => setShowTimeMachine(!showTimeMachine)}
                      >
                        {t("settingsMenu.timeMachine")}
                      </Button>
                    </li>
                    <li className="p-1">
                      <DEV_HoardingCheck network="mainnet" />
                    </li>
                    <li className="p-1">
                      <DEV_HoardingCheck network="mumbai" />
                    </li>
                  </>
                )}
                {!isPWA && (
                  <li className="p-1">
                    <Button onClick={handleInstallApp}>
                      <span>{t("install.app")}</span>
                    </Button>
                  </li>
                )}
                <li className="p-1">
                  <Button onClick={changeLanguage}>
                    <span>{t("change.Language")}</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={storeOnChain}>
                    <span>{t("settingsMenu.storeOnChain")}</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={handleHowToPlay}>
                    <div className="flex items-center justify-center">
                      <span>{t("settingsMenu.howToPlay")}</span>
                      <img
                        src={SUNNYSIDE.icons.expression_confused}
                        className="w-3 ml-2"
                        alt="question-mark"
                      />
                    </div>
                  </Button>
                </li>
                <>
                  <li className="p-1">
                    <Button onClick={handleShareClick}>
                      <span>{t("settingsMenu.share")}</span>
                    </Button>
                  </li>

                  <li className="p-1">
                    <Button onClick={handleDiscordClick}>
                      <span>{"Discord"}</span>
                    </Button>
                  </li>
                  <li className="p-1">
                    <Button onClick={handleSwapSFL}>
                      <span>{t("settingsMenu.swapMaticForSFL")}</span>
                    </Button>
                  </li>
                </>
                <li className="p-1">
                  <Button onClick={handlePlazaSettingsClick}>
                    <span>{t("plazaSettings.title.main")}</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={handleSettingsClick}>
                    <span>{t("advanced")}</span>
                  </Button>
                </li>
                <li className="p-1">
                  <Button onClick={openConfirmLogoutModal}>
                    {t("logout")}
                  </Button>
                  <Modal
                    show={isConfirmLogoutModalOpen}
                    onHide={closeConfirmLogoutModal}
                  >
                    <CloseButtonPanel className="sm:w-4/5 m-auto">
                      <div className="flex flex-col p-2">
                        <span className="text-sm text-center">
                          {t("settingsMenu.confirmLogout")}
                        </span>
                      </div>
                      <div className="flex justify-content-around mt-2 space-x-1">
                        <Button onClick={onLogout}>{t("logout")}</Button>
                        <Button onClick={closeConfirmLogoutModal}>
                          {t("cancel")}
                        </Button>
                      </div>
                    </CloseButtonPanel>
                  </Modal>
                </li>
              </>
            )}

            {menuLevel === MENU_LEVELS.ON_RAMP_MATIC && (
              <PokoOnRamp
                crypto="MATIC-polygon"
                onClose={() => setMenuLevel(MENU_LEVELS.ROOT)}
              />
            )}
            {menuLevel === MENU_LEVELS.ON_RAMP_SFL && (
              <PokoOnRamp
                crypto="SFL-polygon"
                onClose={() => setMenuLevel(MENU_LEVELS.ROOT)}
              />
            )}
          </ul>
          <p className="mx-1 text-xxs">
            {CONFIG.RELEASE_VERSION?.split("-")[0]}
          </p>
        </Panel>
      </Modal>
      <Share
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        farmId={gameService.state?.context?.farmId.toString() as string}
      />
      <HowToPlay
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
      {isFarming && (
        <Discord
          isOpen={showDiscordModal}
          onClose={() => setShowDiscordModal(false)}
        />
      )}
      <SubSettings
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      <LanguageSwitcher
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
      <AddSFL
        isOpen={showAddSFLModal}
        onClose={() => setShowAddSFLModal(false)}
      />
      <PlazaSettings
        isOpen={showPlazaSettingsModal}
        onClose={() => setShowPlazaSettingsModal(false)}
      />
      <InstallAppModal
        isOpen={showInstallAppModal}
        onClose={() => setShowInstallAppModal(false)}
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
      {showTimeMachine && createPortal(<DEV_TimeMachine />, document.body)}
    </>
  );
};
