import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Panel } from "components/ui/Panel";
import i18n from "lib/i18n";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { changeFont } from "lib/utils/fonts";
import {
  LanguageCode,
  languageDetails,
} from "lib/i18n/dictionaries/dictionary";
import { ConfirmationModal } from "components/ui/ConfirmationModal";

export const LanguageSwitcher: React.FC = () => {
  const { t } = useAppTranslation();
  const initialLanguage = localStorage.getItem("language") || "en";
  const [language, setLanguage] = useState(initialLanguage);
  const [selected, setSelected] = useState<LanguageCode>("en");
  const [isConfirmModalOpen, setConfirmModal] = useState(false);
  const [showContributeLanguage, setShowContributeLanguage] = useState(false);

  const handleChangeLanguage = (languageCode: LanguageCode) => {
    localStorage.setItem("language", languageCode);
    i18n.changeLanguage(languageCode);
    setLanguage(languageCode);
    location.reload();

    if (languageCode === "zh-CN") {
      changeFont("Sans Serif");
    } else {
      changeFont("Default");
    }
  };

  const languageArray = Object.keys(languageDetails) as LanguageCode[];

  return (
    <>
      <div className="p-1 space-y-2">
        {languageArray.map((languageCode) => (
          <Button
            key={languageCode}
            onClick={() => {
              setSelected(languageCode);
              setConfirmModal(true);
            }}
            disabled={language === languageCode}
          >
            {languageDetails[languageCode].languageImage.map((img, index) => (
              <img
                key={index}
                style={{ display: "inline-block", marginRight: "5px" }}
                src={img}
                alt={languageDetails[languageCode].imageAlt[index]}
              />
            ))}
            {languageDetails[languageCode].languageName}{" "}
            {language === languageCode && t("changeLanguage.currentLanguage")}
          </Button>
        ))}
        <span>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xs cursor-pointer"
            onClick={() => setShowContributeLanguage(true)}
          >
            {t("changeLanguage.contribute")}
          </a>
        </span>
      </div>
      <Modal
        show={showContributeLanguage}
        onHide={() => setShowContributeLanguage(false)}
      >
        <Panel className="sm:w-4/5 m-auto">
          <div className="flex flex-col p-2">
            <span className="text-sm text-center">
              <p>{t("changeLanguage.contribute.message")}</p>
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
        </Panel>
      </Modal>
      <ConfirmationModal
        show={isConfirmModalOpen}
        onHide={() => setConfirmModal(false)}
        messages={[t("changeLanguage.confirm")]}
        onCancel={() => setConfirmModal(false)}
        onConfirm={() => handleChangeLanguage(selected)}
        confirmButtonLabel={t("confirm")}
      />
    </>
  );
};

interface LanguageChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageChangeModal: React.FC<LanguageChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        title={t("gameOptions.generalSettings.changeLanguage")}
        onClose={onClose}
      >
        <LanguageSwitcher />
      </CloseButtonPanel>
    </Modal>
  );
};
