import React, { useContext } from "react";
import * as Auth from "features/auth/lib/Provider";

import humanDeath from "assets/npcs/human_death.gif";
import { Button } from "components/ui/Button";
import { wallet } from "lib/blockchain/wallet";
import { removeSession } from "../actions/login";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { removeSocialSession } from "../actions/social";

export const SessionExpired: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex flex-col text-center text-shadow items-center p-1">
        <div className="flex mb-3 items-center ml-8">
          <img src={humanDeath} alt="Warning" className="w-full" />
        </div>
        <p className="text-center mb-3">{t("session.expired")}</p>

        <p className="text-center mb-4 text-xs">
          {t("statements.session.expired")}
        </p>
      </div>
      <Button
        onClick={() => {
          removeSession(wallet.myAccount as string);
          removeSocialSession();
          authService.send("REFRESH");
        }}
      >
        {t("refresh")}
      </Button>
    </>
  );
};
