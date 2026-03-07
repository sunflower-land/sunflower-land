import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const ClockIssue: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center text-center p-2">
      <span>{t("error.clock.not.synced")}</span>
      <img
        src={SUNNYSIDE.npcs.suspiciousGoblin}
        alt="Warning"
        className="w-16 m-2"
      />
      <span className="text-sm mt-2 mb-2">{t("statements.clock.one")}</span>
    </div>
  );
};
