import React from "react";

import syncingAnimation from "assets/npcs/syncing.gif";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Purchasing: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center text-lg">{t("purchasing")}</span>
      <img
        src={syncingAnimation}
        alt="Purchasing"
        className="h-20 mt-2 mb-3 -ml-2"
      />

      <span className="text-shadow text-sm text-center mt-2">
        {t("statements.dontRefresh")}
      </span>
    </div>
  );
};
