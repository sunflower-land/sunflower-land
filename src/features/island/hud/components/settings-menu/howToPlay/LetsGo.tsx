import React from "react";

import { Modal } from "react-bootstrap";
import { HowToModalHeader } from "features/island/hud/components/settings-menu/howToPlay/HowToModalHeader";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  onBack: () => void;
}

export const LetsGo: React.FC<Props> = ({ onClose, onBack }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <HowToModalHeader
        title={t("letsGo.title")}
        onClose={onClose}
        onBack={onBack}
      />
      <Modal.Body>
        <p className="text-xs p-2 sm:text-sm text-center">
          {t("letsGo.description")}
        </p>

        <p className="text-xs p-2 sm:text-sm text-center">
          {t("letsGo.readMore")}
          <a
            className="text-xs sm:text-sm underline"
            href="https://docs.sunflower-land.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("letsGo.officialDocs")}
          </a>
          .
        </p>
      </Modal.Body>
    </>
  );
};
