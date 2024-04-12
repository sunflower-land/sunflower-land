import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { LanguageSwitcher } from "./LanguageChangeModal";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Discord } from "./DiscordModal";
import { InstallAppModal } from "./InstallAppModal";
import { Share } from "./Share";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { usePWAInstall } from "features/pwa/PWAInstallProvider";
import { fixInstallPromptTextStyles } from "features/pwa/lib/fixInstallPromptStyles";
import {
  isMobile,
  isIOS,
  isSafari,
  isAndroid,
  isChrome,
} from "mobile-device-detect";
import { Context as GameContext } from "features/game/GameProvider";

enum MENU_LEVELS {
  ROOT = "root",
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isFarming: boolean;
}

export const GeneralSettings: React.FC<Props> = ({
  isOpen,
  onClose,
  isFarming,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);
  const [showInstallAppModal, setShowInstallAppModal] = useState(false);

  const [view, setView] = useState<"settings">("settings");
  const { showAnimations, toggleAnimations } = useContext(Context);
  const isPWA = useIsPWA();
  const isWeb3MobileBrowser = isMobile && !!window.ethereum;
  const pwaInstall = usePWAInstall();

  const handleDiscordClick = () => {
    setShowDiscordModal(true);
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
  };

  const handleShareClick = () => {
    setShowShareModal(true);
    setMenuLevel(MENU_LEVELS.ROOT);
  };

  const changeLanguage = () => {
    setShowLanguageModal(true);
  };

  const onToggleAnimations = () => {
    toggleAnimations();
  };

  const Content = () => {
    return (
      <>
        <CloseButtonPanel title={`General Settings`} onClose={onClose}>
          {!isPWA && (
            <Button onClick={handleInstallApp} className="mb-2">
              <span>{t("install.app")}</span>
            </Button>
          )}
          <Button onClick={handleDiscordClick} className="mb-2">
            <span>{"Connect to Discord"}</span>
          </Button>
          <Button onClick={changeLanguage} className="mb-2">
            <span>{t("change.Language")}</span>
          </Button>
          <Button className="mb-2" onClick={onToggleAnimations}>
            {showAnimations
              ? t("advancedSettings.disableAnimations")
              : t("advancedSettings.enableAnimations")}
          </Button>
          <Button onClick={handleShareClick} className="mb-2">
            <span>{t("settingsMenu.share")}</span>
          </Button>
        </CloseButtonPanel>
        <LanguageSwitcher
          isOpen={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
        />
        {isFarming && (
          <Discord
            isOpen={showDiscordModal}
            onClose={() => setShowDiscordModal(false)}
          />
        )}
        <InstallAppModal
          isOpen={showInstallAppModal}
          onClose={() => setShowInstallAppModal(false)}
        />
        <Share
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          farmId={gameService.state?.context?.farmId.toString() as string}
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
