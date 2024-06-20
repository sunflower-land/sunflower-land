import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";

import settingsIcon from "assets/icons/settings_disc.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { createPortal } from "react-dom";
import {
  SettingMenuId,
  settingMenus,
} from "features/island/hud/components/settings-menu/GameOptions";

export const LoginSettings: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentMenu, setMenu] = useState<SettingMenuId | "login">("login");

  const { t } = useAppTranslation();

  const close = () => {
    setShowModal(false);
    setMenu("login");
  };

  const Content = () => {
    if (currentMenu !== "login") {
      const SelectedMenu = settingMenus[currentMenu].content;
      return <SelectedMenu onSubMenuClick={setMenu} onClose={close} />;
    }

    return (
      <>
        <Button onClick={() => setMenu("changeLanguage")} className="mb-1">
          <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
        </Button>
        <Button className="mb-1" onClick={() => setMenu("appearance")}>
          <span>{t("gameOptions.generalSettings.appearance")}</span>
        </Button>
      </>
    );
  };

  return (
    <>
      <Modal show={showModal} onHide={close}>
        <CloseButtonPanel
          title={
            currentMenu !== "login"
              ? settingMenus[currentMenu].title
              : t("gameOptions.generalSettings")
          }
          onClose={close}
          onBack={
            currentMenu === "font"
              ? () => setMenu("appearance")
              : currentMenu !== "login"
              ? () => setMenu("login")
              : undefined
          }
        >
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
