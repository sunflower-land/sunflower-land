import { Button } from "components/ui/Button";

import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import cheer from "assets/icons/cheer.webp";
import { getDailyCheersAmount } from "features/game/events/landExpansion/claimDailyCheers";
import { useSelector } from "@xstate/react";

export const Cheering: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { t } = useAppTranslation();

  const { amount } = getDailyCheersAmount(state);

  return (
    <div>
      <div className="flex items-center">
        <Label type="warning" icon={cheer} className="ml-2">
          {t("cheers.plus3")}
        </Label>
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
