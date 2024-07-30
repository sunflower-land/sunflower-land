import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Purchasing: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center text-lg">{t("purchasing")}</span>
      <img
        src={SUNNYSIDE.npcs.syncing}
        alt="Purchasing"
        className="h-20 mt-2 mb-3 -ml-2"
      />

      <span className="text-sm text-center mt-2 font-secondary">
        {t("statements.dontRefresh")}
      </span>
    </div>
  );
};
