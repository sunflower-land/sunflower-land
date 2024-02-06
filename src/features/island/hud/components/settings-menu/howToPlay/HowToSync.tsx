import React from "react";

import { Modal } from "react-bootstrap";

import { HowToModalHeader } from "features/island/hud/components/settings-menu/howToPlay/HowToModalHeader";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  onBack: () => void;
}

export const HowToSync: React.FC<Props> = ({ onClose, onBack }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <HowToModalHeader
        title={t("howToSync.title")}
        onClose={onClose}
        onBack={onBack}
      />
      <Modal.Body>
        <p className="text-xs p-2 sm:text-sm text-center">
          {t("howToSync.description")}
        </p>

        <div className="flex items-center">
          <p className="text-xs sm:text-sm p-2">{t("howToSync.stepOne")}</p>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">{t("howToSync.stepTwo")}</p>
          <div className="relative">
            <img src={SUNNYSIDE.icons.timer} className="w-4" />
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
