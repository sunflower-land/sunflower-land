import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const Maintenance: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col text-center items-center p-1">
      <p className="text-center mb-3">{t("maintenance")}</p>

      <img
        src={SUNNYSIDE.npcs.goblin_hammering}
        alt="Maintenance"
        className="w-2/3"
      />

      <p className="text-center mb-4 text-sm">{t("statements.maintenance")}</p>
    </div>
  );
};
