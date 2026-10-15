import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const DuplicateWithdraw: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();

  // Nothing to retry here (the hold runs its course), so just go back to
  // the game instead of leaving a page reload as the only way out.
  const close = () => gameService.send("CONTINUE");

  return (
    <div className="flex flex-col gap-1">
      <div className="p-1">
        <Label type="danger" className="mb-2">
          {t("withdraw.duplicate.title")}
        </Label>
        <p className="text-xs mb-1">{t("withdraw.duplicate.description")}</p>
        <p className="text-xs mt-2">{t("withdraw.duplicate.waitMessage")}</p>
      </div>
      <Button onClick={close}>{t("continue")}</Button>
    </div>
  );
};
