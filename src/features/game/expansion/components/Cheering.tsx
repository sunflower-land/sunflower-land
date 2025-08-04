import { Button } from "components/ui/Button";

import React from "react";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import cheer from "assets/icons/cheer.webp";
import crownIcon from "assets/icons/vip.webp";
import { hasVipAccess } from "features/game/lib/vipAccess";

export const Cheering: React.FC = () => {
  const { gameService, gameState } = useGame();
  const { t } = useAppTranslation();

  const hasVip = hasVipAccess({ game: gameState.context.state });

  let amount = 3;

  if (hasVip) {
    amount = 6;
  }

  return (
    <div>
      <div className="flex items-center">
        <Label type="warning" icon={cheer} className="ml-2">
          {t("cheers.plus3")}
        </Label>
        {hasVip && (
          <Label type="vibrant" icon={crownIcon} className="ml-2">
            {t("cheers.vipBonus")}
          </Label>
        )}
      </div>
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
        {t("cheering.free.claim", { amount })}
      </Button>
    </div>
  );
};
