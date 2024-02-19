import React from "react";

import kitchen from "assets/buildings/bakery_building.png";
import pumpkinSoup from "assets/sfts/pumpkin_soup.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const HowToUpgrade: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col space-y-1 p-2">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm">{t("howToUpgrade.stepOne")}</p>
        <div className="relative">
          <img src={SUNNYSIDE.npcs.goblin} className="w-9 h-9 object-contain" />
          <img
            src={SUNNYSIDE.ui.cursor}
            className="w-4 absolute right-0 bottom-0"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm">{t("howToUpgrade.stepTwo")}</p>
        <div className="relative">
          <img src={kitchen} className="w-9 h-9 object-contain" />
          <img
            src={SUNNYSIDE.ui.cursor}
            className="w-4 absolute right-0 -bottom-2"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm">{t("howToUpgrade.stepThree")}</p>
        <div className="relative">
          <img src={pumpkinSoup} className="w-9 h-9 object-contain" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm">{t("howToUpgrade.stepFour")}</p>
        <div className="relative">
          <img
            src={CROP_LIFECYCLE.Carrot.crop}
            className="w-9 h-9 object-contain"
          />
        </div>
      </div>
    </div>
  );
};
