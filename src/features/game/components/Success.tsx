import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "../GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Success: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  return (
    <div className="flex flex-col items-center">
      <img src={SUNNYSIDE.npcs.synced} className="w-16 my-4" />
      <span className="text-center mb-2">
        {t("transaction.storeProgress.success")}
      </span>
      <Button onClick={() => gameService.send({ type: "REFRESH" })}>
        {t("continue")}
      </Button>
    </div>
  );
};
