import React from "react";

import token from "assets/icons/sfl.webp";

import shop from "assets/buildings/shop_building.png";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const HowToFarm: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col space-y-1 p-2">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm">{t("howToFarm.stepOne")}</p>
        <div className="relative">
          <img
            src={CROP_LIFECYCLE.Sunflower.crop}
            className="w-9 h-9 object-contain"
          />
          <img
            src={SUNNYSIDE.ui.cursor}
            className="w-4 absolute right-0 bottom-0"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm">{t("howToFarm.stepTwo")}</p>
        <div className="relative">
          <img src={shop} className="w-9 h-9 object-contain" />
          <img
            src={SUNNYSIDE.ui.cursor}
            className="w-4 absolute right-0 -bottom-2"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm">{t("howToFarm.stepThree")}</p>

        <div className="relative">
          <img src={token} className="w-9 h-9 object-contain" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm">{t("howToFarm.stepFour")}</p>
        <div className="relative">
          <img src={SUNNYSIDE.icons.seeds} className="w-9 h-9 object-contain" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs sm:text-sm">{t("howToFarm.stepFive")}</p>
        <div className="relative">
          <img
            src={SUNNYSIDE.icons.seedling}
            className="w-9 h-9 object-contain"
          />
          <img
            src={SUNNYSIDE.ui.cursor}
            className="w-4 absolute right-0 bottom-0"
          />
        </div>
      </div>
    </div>
  );
};
