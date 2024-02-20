import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const HowToSync: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col space-y-1 p-2">
      <p className="text-xs sm:text-sm">{t("howToSync.description")}</p>

      <div className="flex items-center">
        <p className="text-xs sm:text-sm">{t("howToSync.stepOne")}</p>
      </div>
      <div className="flex items-center">
        <p className="text-xs sm:text-sm">{t("howToSync.stepTwo")}</p>
        <div className="ml-2 relative">
          <img src={SUNNYSIDE.icons.timer} className="w-4" />
        </div>
      </div>
    </div>
  );
};
