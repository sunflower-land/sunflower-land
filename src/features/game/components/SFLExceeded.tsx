import React, { useContext } from "react";
import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";
import { Context } from "../GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const SFLExceeded = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  return (
    <div className="flex flex-col items-center text-center p-2">
      <span>Daily SFL Limit</span>
      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
      <p className="text-sm mb-2">You have reached the daily SFL limit.</p>
      <p className="text-sm mb-2">
        You can continue playing, but will need to wait until tomorrow to sync
        again.
      </p>
      <Button onClick={() => gameService.send("CONTINUE")}>
        {t("continue")}
      </Button>
    </div>
  );
};
