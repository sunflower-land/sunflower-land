import { Button } from "components/ui/Button";
import treasure from "assets/icons/chest.png";

import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Promo: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center">
      <p className="text-base">{t("promo.cdcBonus")}</p>
      <img src={treasure} className="w-12 my-2" />
      <p className="text-sm mb-1">{t("promo.expandLand")}</p>
      <Button onClick={() => gameService.send({ type: "ACKNOWLEDGE" })}>
        {t("gotIt")}
      </Button>
    </div>
  );
};
