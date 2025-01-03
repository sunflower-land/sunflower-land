import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Panel } from "components/ui/Panel";
import i18n from "lib/i18n";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { LanguageCode, languageDetails } from "lib/i18n/dictionaries/language";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { getKeys } from "features/game/types/decorations";

export const LanguageSwitcher: React.FC = () => {
  const { t } = useAppTranslation();
  const initialLanguage = localStorage.getItem("language") || "en";
  const fontType = localStorage.getItem("settings.font") || "Default";
  const [language, setLanguage] = useState(initialLanguage);
  const [selected, setSelected] = useState<LanguageCode>("en");
  const [isConfirmModalOpen, setConfirmModal] = useState(false);
  const [showContributeLanguage, setShowContributeLanguage] = useState(false);

  const handleChangeLanguage = (languageCode: LanguageCode) => {
    localStorage.setItem("language", languageCode);
    i18n.changeLanguage(languageCode);
    setLanguage(languageCode);
    location.reload();
  };

  const getFontNameClass = (languageCode: LanguageCode): string => {
    const formatedFontType = fontType.replace(/[^a-zA-Z]/g, "");

    switch (languageCode) {
      case "ru":
        return `font-${languageCode}${formatedFontType}`;
      default:
        return "";
    }
  };

  const getFontSizeClass = (languageCode: LanguageCode): string => {
    switch (languageCode) {
      case "ko":
      case "zh-CN":
        return "!text-[20px]";
      case "ru":
        return fontType === "Bold" ? "!text-[26px]" : "";
      default:
        return "";
    }
  };

  const languageArray = getKeys(languageDetails);
  return (
    <>
      <div className="p-1 space-y-2 max-h-[400px] overflow-y-auto scrollable">
        <div className="grid grid-cols-2 gap-1">
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
              <span
                className={`${getFontNameClass(languageCode)} ${getFontSizeClass(languageCode)}`}
              >
                {languageDetails[languageCode].languageName}
              </span>
            </Button>
          ))}
        </div>
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
