import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const MarketplaceListingNotClaimed: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();

  const reload = () => {
    gameService.send({ type: "CONTINUE" });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col p-2">
        <Label type="danger" className="mb-2">
          {t("marketplaceListingNotClaimed.label")}
        </Label>

        <p>{t("marketplaceListingNotClaimed")}</p>
      </div>
      <Button onClick={reload}>{t("continue")}</Button>
    </div>
  );
};
