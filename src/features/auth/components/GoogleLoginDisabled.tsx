import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import { SUNNYSIDE } from "assets/sunnyside";

import * as AuthProvider from "features/auth/lib/Provider";
import { removeJWT } from "../actions/social";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const GoogleLoginDisabled: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { t } = useAppTranslation();

  const tryAnother = () => {
    removeJWT();
    authService.send("REFRESH");
  };

  return (
    <div className="flex flex-col text-center items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img
          src={SUNNYSIDE.npcs.humanDeath}
          alt={t("warning")}
          className="w-full"
        />
      </div>
      <Label type="danger" className="mb-2">
        {t("errorAndAccess.googleLoginDisabled.title")}
      </Label>
      <p className="text-center mb-4 text-xs">
        {t("errorAndAccess.googleLoginDisabled.body")}
      </p>
      <Button onClick={tryAnother} className="overflow-hidden mb-2">
        <span>{t("errorAndAccess.googleLoginDisabled.tryAnother")}</span>
      </Button>
    </div>
  );
};
