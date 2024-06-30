import React from "react";

import syncingAnimation from "assets/npcs/syncing.gif";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Syncing: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center text-lg">{t("syncing")}</span>
      <img
        src={syncingAnimation}
        alt="Syncing"
        className="h-20 mt-2 mb-3 -ml-2"
      />
      <span className="text-xs text-center">{t("statements.sync")}</span>
      <span className="text-sm text-center mt-2">
        {t("statements.dontRefresh")}
      </span>
    </div>
  );
};
