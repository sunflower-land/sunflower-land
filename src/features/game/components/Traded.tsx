import React, { useContext } from "react";

import { Context } from "../GameProvider";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Traded: React.FC = () => {
  const { gameService } = useContext(Context);

  function onAcknowledge() {
    gameService.send({ type: "CONTINUE" });
  }
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <img src={SUNNYSIDE.icons.confirm} className="mx-auto h-12 my-2" />
        <p className="text-sm mb-2 text-center">
          {t("transaction.trade.congrats")}
        </p>
      </div>
      <Button onClick={onAcknowledge}>{t("continue")}</Button>
    </>
  );
};
