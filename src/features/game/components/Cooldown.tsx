import React from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Cooldown: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">{t("welcome")}</span>
      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
      <span className="text-sm mt-2 mb-2">
        {`It looks like you are new to Sunflower Land and have claimed ownership of another player's account.`}
      </span>
      <span className="text-sm mt-2 mb-2">{t("statements.cooldown")}</span>
    </div>
  );
};
