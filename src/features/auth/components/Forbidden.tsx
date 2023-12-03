import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Forbidden: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { t } = useAppTranslation();
  const goHome = () => {
    authService.send("RETURN");
  };

  return (
    <div className="flex flex-col items-center text-center p-2">
      <span>{t("forbidden")}!</span>
      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
      <span className="text-xs mt-2 mb-2">
        {t("error.forbidden.goblinVillage")}
      </span>
      <Button className="mt-2" onClick={goHome}>
        {t("back")}
      </Button>
    </div>
  );
};
