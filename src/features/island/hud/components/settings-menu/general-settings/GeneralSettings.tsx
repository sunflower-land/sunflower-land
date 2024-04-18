import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { LanguageSwitcher } from "./LanguageChangeModal";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Discord } from "./DiscordModal";
import { Share } from "./Share";
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

  const [view, setView] = useState<"settings">("settings");
  const { showAnimations, toggleAnimations } = useContext(Context);

  const handleDiscordClick = () => {
    setShowDiscordModal(true);
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
        <CloseButtonPanel
          title={t("gameOptions.generalSettings")}
          onClose={onClose}
        >
          <Button onClick={handleDiscordClick} className="mb-2">
            <span>{t("gameOptions.generalSettings.connectDiscord")}</span>
          </Button>
          <Button onClick={changeLanguage} className="mb-2">
            <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
          </Button>
          <Button className="mb-2" onClick={onToggleAnimations}>
            <span>
              {showAnimations
                ? t("gameOptions.generalSettings.disableAnimations")
                : t("gameOptions.generalSettings.enableAnimations")}
            </span>
          </Button>
          <Button onClick={handleShareClick} className="mb-2">
            <span>{t("gameOptions.generalSettings.share")}</span>
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
