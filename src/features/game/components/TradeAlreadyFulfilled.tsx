import React, { useContext } from "react";

import { Context } from "../GameProvider";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TradeAlreadyFulfilled: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  function onAcknowledge() {
    gameService.send({ type: "CONTINUE" });
  }

  return (
    <div>
      <div className="p-2">
        <img src={SUNNYSIDE.icons.confirm} className="mx-auto w-1/5 my-2" />
        <p className="text-sm mb-2 text-center">{`A player has already bought this listing.`}</p>
      </div>
      <Button onClick={onAcknowledge}>{t("continue")}</Button>
    </div>
  );
};
