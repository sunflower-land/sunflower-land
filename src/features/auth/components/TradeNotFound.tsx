import { Button } from "components/ui/Button";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const TradeNotFound: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();
  return (
    <div>
      <p>{`Trade not found`}</p>
      <Button onClick={() => gameService.send("CONTINUE")}>
        {t("continue")}
      </Button>
    </div>
  );
};
