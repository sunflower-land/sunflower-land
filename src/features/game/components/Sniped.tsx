import React, { useContext } from "react";

import { Context } from "../GameProvider";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Sniped: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  function onAcknowledge() {
    gameService.send({ type: "CONTINUE" });
  }

  return (
    <div>
      <div className="p-2">
        <img src={SUNNYSIDE.icons.cancel} className="mx-auto w-1/5 my-2" />
        <p className="text-sm mb-2 text-center">{t("statements.sniped")}</p>
      </div>
      <Button onClick={onAcknowledge}>{t("continue")}</Button>
    </div>
  );
};
