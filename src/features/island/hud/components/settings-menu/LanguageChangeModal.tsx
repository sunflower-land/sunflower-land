import React, { useState } from "react";

import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import i18n from "lib/i18n";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import british_flag from "assets/sfts/flags/british_flag.gif";
import usaFlag from "assets/sfts/flags/usa_flag.gif";
import brazilFlag from "assets/sfts/flags/brazil_flag.gif";
import portugalFlag from "assets/sfts/flags/portugal_flag.gif";
import franceFlag from "assets/sfts/flags/france_flag.gif";
import turkeyFlag from "assets/sfts/flags/turkey_flag.gif";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();

  const initialLanguage = localStorage.getItem("language") || "en";
  const [language, setLanguage] = useState(initialLanguage);

  const handleChangeLanguage = (languageCode: string) => {
    localStorage.setItem("language", languageCode);
    i18n.changeLanguage(languageCode);
    setLanguage(languageCode);
    onClose();
  };

  const [showContributeLanguage, setShowContributeLanguage] = useState(false);

  const openContributeLanguageModal = () => {
    setShowContributeLanguage(true);
  };

  const closeContributeLanguageModal = () => {
    setShowContributeLanguage(false);
  };

  const Content = () => {
    return (
      <CloseButtonPanel title={t("change.Language")} onClose={onClose}>
        <div className="p-1 space-y-2">
          <Button
            onClick={() => handleChangeLanguage("en")}
            disabled={language === "en"}
          >
            <img
              style={{ display: "inline-block", marginRight: "5px" }}
              src={british_flag}
              alt="British Flag"
            />
            <img
              style={{ display: "inline-block", marginRight: "5px" }}
              src={usaFlag}
              alt="American Flag"
            />
            {"English"}
          </Button>
          <Button
            onClick={() => handleChangeLanguage("fr")}
            disabled={language === "fr"}
          >
            <img
              style={{ display: "inline-block", marginRight: "5px" }}
              src={franceFlag}
              alt="French Flag"
            />
            {"Français"}
          </Button>
          <Button
            onClick={() => handleChangeLanguage("pt")}
            disabled={language === "pt"}
          >
            <img
              style={{ display: "inline-block", marginRight: "5px" }}
              src={brazilFlag}
              alt="Brazillian Flag"
            />
            <img
              style={{ display: "inline-block", marginRight: "5px" }}
              src={portugalFlag}
              alt="Portuguese Flag"
            />
            {"Português"}
          </Button>
          <Button
            onClick={() => handleChangeLanguage("tk")}
            disabled={language === "tk"}
          >
            <img
              style={{ display: "inline-block", marginRight: "5px" }}
              src={turkeyFlag}
              alt="Turkish Flag"
            />
            {"Türkçe"}
          </Button>
          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white text-xs cursor-pointer"
              onClick={openContributeLanguageModal}
            >{`Want to contribute your Language?`}</a>
            <Modal
              show={showContributeLanguage}
              onHide={closeContributeLanguageModal}
            >
              <CloseButtonPanel className="sm:w-4/5 m-auto">
                <div className="flex flex-col p-2">
                  <span className="text-sm text-center">
                    <p>{t("statements.translation.contribution")}</p>
                    <p>
                      <a
                        className="underline hover:text-white"
                        href="https://discord.gg/sunflowerland"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("statements.translation.joinDiscord")}
                      </a>
                    </p>
                  </span>
                </div>
              </CloseButtonPanel>
            </Modal>
          </span>
        </div>
      </CloseButtonPanel>
    );
  };

  // Close Modal on Hide
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  const [view, setView] = useState<"settings">("settings");

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
