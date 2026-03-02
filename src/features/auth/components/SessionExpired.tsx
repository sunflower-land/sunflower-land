import React, { useContext } from "react";
import * as Auth from "features/auth/lib/Provider";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { removeJWT } from "../actions/social";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const SessionExpired: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex flex-col text-center items-center p-1">
        <div className="flex mb-3 items-center ml-8">
          <img
            src={SUNNYSIDE.npcs.humanDeath}
            alt="Warning"
            className="w-full"
          />
        </div>
        <p className="text-center mb-3">{t("session.expired")}</p>

        <p className="text-center mb-4 text-xs">
          {t("statements.session.expired")}
        </p>
      </div>
      <Button
        onClick={() => {
          removeJWT();
          authService.send({ type: "REFRESH" });
        }}
      >
        {t("refresh")}
      </Button>
    </>
  );
};
