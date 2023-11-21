import React from "react";

import humanDeath from "assets/npcs/human_death.gif";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const DuplicateUser: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-center mb-3">{t("onboarding.createdBefore.one")}</p>

      <p className="text-center mb-4 text-xs">
        {t("onboarding.createdBefore.two")}
      </p>
    </div>
  );
};
