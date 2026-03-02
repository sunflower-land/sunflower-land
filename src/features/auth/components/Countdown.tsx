import React, { useContext, useEffect, useState } from "react";
import minting from "assets/npcs/minting.gif";
import { secondsToString } from "lib/utils/time";
import * as AuthProvider from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * HACK: Small component that pauses the user before proceeding
 * It lessens the load during high critical usage times
 */
export const Countdown: React.FC = () => {
  const [time, setTime] = useState("30secs");
  const { authService } = useContext(AuthProvider.Context);

  const { t } = useAppTranslation();
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const timeLeft = 30 - (Date.now() - start) / 1000;
      setTime(secondsToString(timeLeft, { length: "full" }));

      if (timeLeft <= 0) {
        authService.send({ type: "REFRESH" });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col text-center items-center p-2">
      <span>{t("transaction.mintFarm")}</span>
      <img src={minting} className="w-1/2 mt-2" />
      <span className="text-xs mb-1">{t("transaction.farm.ready")}</span>
      <span className="text-lg">{time}</span>
      <span className="text-xs mt-4 underline mb-1">
        {t("transfer.Refresh")}
      </span>
    </div>
  );
};
