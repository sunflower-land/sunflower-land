import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Cooldown: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">{t("welcome")}</span>
      <img
        src={SUNNYSIDE.npcs.suspiciousGoblin}
        alt="Warning"
        className="w-16 m-2"
      />
      <span className="text-sm mt-2 mb-2">
        {t("welcome.takeover.ownership")}
      </span>
      <span className="text-sm mt-2 mb-2">{t("statements.cooldown")}</span>
    </div>
  );
};
