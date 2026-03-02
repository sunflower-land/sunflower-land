import React, { useContext } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";

export const MultipleDevices: React.FC = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);

  const onAcknowledge = () => {
    window.history.pushState({}, "", window.location.pathname);
    if (gameService) {
      gameService.send({ type: "REFRESH" });
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <div className="flex flex-col text-center items-center p-1">
        <p>{t("error.multipleDevices.one")}</p>

        <img
          src={SUNNYSIDE.npcs.suspiciousGoblin}
          alt="Warning"
          className="w-16 m-2"
        />

        <p className="mt-2 mb-2 text-sm">{t("error.multipleDevices.two")}</p>
      </div>
      <Button onClick={onAcknowledge}>{t("refresh")}</Button>
    </>
  );
};
