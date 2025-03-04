import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { useSWRConfig } from "swr";

export const TradeNotFound: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();

  const { mutate } = useSWRConfig();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col p-2">
        <Label type="danger" className="mb-2">
          {`Trade not found`}
        </Label>

        <p>{`This trade is not found. Please try again.`}</p>
      </div>
      <Button
        onClick={() => {
          mutate(() => true, undefined, { revalidate: true });
          gameService.send("CONTINUE");
        }}
      >
        {t("continue")}
      </Button>
    </div>
  );
};
