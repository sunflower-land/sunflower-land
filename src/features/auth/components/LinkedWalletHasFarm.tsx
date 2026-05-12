import React, { useContext } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";

export const LinkedWalletHasFarm: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex flex-col text-start items-center p-1">
        <div className="flex mb-3 items-center ml-8">
          <img
            src={SUNNYSIDE.npcs.humanDeath}
            alt="Warning"
            className="w-full"
          />
        </div>
        <p className="text-start mb-3">
          {t("linkedAccounts.error.linkedWalletHasFarm.one")}
        </p>
        <p className="text-start mb-4 text-xs">
          {t("linkedAccounts.error.linkedWalletHasFarm.two")}
        </p>
      </div>
      <Button onClick={() => gameService.send("CONTINUE")}>
        {t("continue")}
      </Button>
    </>
  );
};
