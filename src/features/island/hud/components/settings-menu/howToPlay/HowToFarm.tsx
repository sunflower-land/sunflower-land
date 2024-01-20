import React from "react";

import { Modal } from "react-bootstrap";

import token from "assets/icons/token_2.png";

import shop from "assets/buildings/shop_building.png";
import { HowToModalHeader } from "./HowToModalHeader";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

export const HowToFarm: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  return (
    <>
      <HowToModalHeader title={t("howToFarm.title")} onClose={onClose} />
      <Modal.Body>
        <div className="flex items-center">
          <p className="text-xs sm:text-sm p-2">{t("howToFarm.stepOne")}</p>
          <div className="relative">
            <img src={CROP_LIFECYCLE.Sunflower.crop} className="w-12" />
            <img
              src={SUNNYSIDE.ui.cursor}
              className="w-4 absolute right-0 bottom-0"
            />
          </div>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">{t("howToFarm.stepTwo")}</p>
          <div className="relative">
            <img src={shop} className="w-14" />
            <img
              src={SUNNYSIDE.ui.cursor}
              className="w-4 absolute right-0 -bottom-2"
            />
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-xs sm:text-sm p-2">{t("howToFarm.stepThree")}</p>

          <div className="relative">
            <img src={token} className="w-12" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs sm:text-sm p-2">{t("howToFarm.stepFour")}</p>
          <div className="relative">
            <img src={SUNNYSIDE.icons.seeds} className="w-8" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs sm:text-sm p-2">{t("howToFarm.stepFive")}</p>
          <div className="relative">
            <img src={SUNNYSIDE.icons.seedling} className="w-12" />
            <img
              src={SUNNYSIDE.ui.cursor}
              className="w-4 absolute right-0 bottom-0"
            />
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
