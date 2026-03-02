import React, { useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Context } from "../GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const SFLExceeded = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  return (
    <div className="flex flex-col items-center text-center p-2">
      <span>{t("dailyLim")}</span>
      <img
        src={SUNNYSIDE.npcs.suspiciousGoblin}
        alt="Warning"
        className="w-16 m-2"
      />
      <p className="text-sm mb-2">{t("statements.sflLim.one")}</p>
      <p className="text-sm mb-2">{t("statements.sflLim.two")}</p>
      <Button onClick={() => gameService.send({ type: "CONTINUE" })}>
        {t("continue")}
      </Button>
    </div>
  );
};
