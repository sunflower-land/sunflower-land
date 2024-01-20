import React from "react";

import { Modal } from "react-bootstrap";

import kitchen from "assets/buildings/bakery_building.png";
import pumpkinSoup from "assets/sfts/pumpkin_soup.png";
import { HowToModalHeader } from "./HowToModalHeader";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  onBack: () => void;
}

export const HowToUpgrade: React.FC<Props> = ({ onClose, onBack }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <HowToModalHeader
        title={t("howToUpgrade.title")}
        onClose={onClose}
        onBack={onBack}
      />
      <Modal.Body>
        <div className="flex items-center">
          <p className="text-xs sm:text-sm p-2">{t("howToUpgrade.stepOne")}</p>
          <div className="relative w-12 h-12">
            <img
              src={SUNNYSIDE.npcs.goblin}
              style={{
                width: `${GRID_WIDTH_PX}px`,
                position: "absolute",
                top: "0",
                right: "0",
              }}
            />
            <img
              src={SUNNYSIDE.ui.cursor}
              className="w-4 absolute right-0 bottom-0"
            />
          </div>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">{t("howToUpgrade.stepTwo")}</p>
          <div className="relative">
            <img src={kitchen} className="w-14" />
            <img
              src={SUNNYSIDE.ui.cursor}
              className="w-4 absolute right-0 -bottom-2"
            />
          </div>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">
            {t("howToUpgrade.stepThree")}
          </p>
          <div className="relative">
            <img src={pumpkinSoup} className="w-14 relative left-1" />
          </div>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">{t("howToUpgrade.stepFour")}</p>
          <div className="relative">
            <img src={CROP_LIFECYCLE.Carrot.crop} className="w-14 relative" />
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
