import { Button } from "components/ui/Button";

import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import cheer from "assets/icons/cheer.webp";
import chest from "assets/icons/chest.png";

export const Cheering: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  return (
    <div>
      <Label type="warning" icon={cheer} secondaryIcon={chest} className="ml-2">
        {t("cheers")}
      </Label>
      <div className="flex flex-col p-2 text-xs space-y-1">
        <span>{t("cheering.free.description")}</span>
        <span>{t("cheering.free.description2")}</span>
      </div>
      <Button
        onClick={() => {
          gameService.send("cheers.claimed");
          gameService.send("ACKNOWLEDGE");
        }}
      >
        {t("cheering.free.claim")}
      </Button>
    </div>
  );
};
