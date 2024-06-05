import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { AppearanceSettings } from "features/island/hud/components/settings-menu/general-settings/AppearanceSettings";
import { LanguageSwitcher } from "features/island/hud/components/settings-menu/general-settings/LanguageChangeModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";

import settingsIcon from "assets/icons/settings_disc.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { createPortal } from "react-dom";

export const LoginSettings: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showFonts, setShowFonts] = useState(false);

  const { t } = useAppTranslation();

  const close = () => {
    setShowLanguage(false);
    setShowFonts(false);
    setShowModal(false);
  };
  const Content = () => {
    if (showFonts) {
      return <AppearanceSettings />;
    }

    if (showLanguage) {
      return <LanguageSwitcher />;
    }

    return (
      <>
        <Button onClick={() => setShowLanguage(true)} className="mb-1">
          <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
        </Button>
        <Button className="mb-1" onClick={() => setShowFonts(true)}>
          <span>{t("gameOptions.generalSettings.appearance")}</span>
        </Button>
      </>
    );
  };
  return (
    <>
      <Modal show={showModal} onHide={close}>
        <CloseButtonPanel title={t("settings")} onClose={close}>
          <Content />
        </CloseButtonPanel>
      </Modal>

      {createPortal(
        <img
          onClick={() => setShowModal(true)}
          className="absolute bottom-2 right-2 z-[10000] cursor-pointer"
          src={settingsIcon}
          style={{
            width: `${PIXEL_SCALE * 24}px`,
          }}
        />,
        document.body
      )}
    </>
  );
};
