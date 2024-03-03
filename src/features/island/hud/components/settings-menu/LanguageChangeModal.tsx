/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { changeLanguage } from "i18next";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();

  const handleChangeLanguage = (languageCode: string) => {
    changeLanguage(languageCode);
  };
  const Content = () => {
    return (
      <CloseButtonPanel title={t("change.Language")} onClose={onClose}>
        <div className="p-1">
          <Button onClick={() => handleChangeLanguage("en")}>
            {"English"}
          </Button>
          <Button onClick={() => handleChangeLanguage("pt")}>
            {"Português"}
          </Button>
        </div>
      </CloseButtonPanel>
    );
  };
  return <Modal show={isOpen}>{Content()}</Modal>;
};
