import React, { useContext } from "react";

import { Context } from "../GameProvider";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PIXEL_SCALE } from "../lib/constants";

export const ListingDeleted: React.FC = () => {
  const { gameService } = useContext(Context);

  function onAcknowledge() {
    gameService.send({ type: "CONTINUE" });
  }
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <img
          src={SUNNYSIDE.icons.confirm}
          className="mx-auto my-2"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <p className="text-sm mb-2 text-center">
          {t("trading.listing.deleted")}
        </p>
      </div>
      <Button onClick={onAcknowledge}>{t("continue")}</Button>
    </>
  );
};
