import React, { useContext } from "react";

import { Context } from "../GameProvider";
import { Button } from "components/ui/Button";
import { acknowledgeGameRules } from "features/announcements/announcementsStorage";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Rules: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  function onAcknowledge() {
    acknowledgeGameRules();
    gameService.send("ACKNOWLEDGE");
  }

  return (
    <div className=" p-2">
      <p className="text-lg text-center">{t("game.rules")}</p>
      <div className="flex mt-4">
        <div className="w-16 flex justify-center">
          <img src={SUNNYSIDE.icons.player} className="h-8" />
        </div>
        <div className="flex-1">
          <p>{t("rules.oneAccountPerPlayer")}</p>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="w-16 flex justify-center">
          <img src={SUNNYSIDE.icons.suspicious} className="h-8" />
        </div>
        <div className="flex-1">
          <p>{t("rules.noBots")}</p>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="w-16 flex justify-center">
          <img src={SUNNYSIDE.icons.heart} className="h-8" />
        </div>
        <div className="flex-1">
          <p>{t("rules.gameNotFinancialProduct")}</p>
        </div>
      </div>
      <Button onClick={onAcknowledge} className="mt-4">
        {t("continue")}
      </Button>
      <p className="text-xs underline mt-2 text-center">
        <a
          href="https://docs.sunflower-land.com/support/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center"
        >
          {t("rules.termsOfService")}
        </a>
      </p>
    </div>
  );
};
