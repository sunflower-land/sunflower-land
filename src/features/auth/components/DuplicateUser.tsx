import React, { useContext } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";

export const DuplicateUser: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col text-center items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={SUNNYSIDE.npcs.humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-center mb-3">{t("onboarding.duplicateUser.one")}</p>

      <p className="text-center mb-4 text-xs">
        {t("onboarding.duplicateUser.two")}
      </p>
      <Button
        onClick={() => {
          window.history.pushState({}, "", window.location.pathname);

          gameService.send({ type: "REFRESH" });
        }}
      >
        {t("continue")}
      </Button>
    </div>
  );
};
