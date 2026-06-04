import React from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { type ErrorCode, ERRORS } from "lib/errors";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useGame } from "features/game/GameProvider";

interface Props {
  errorCode: ErrorCode;
}

export const TwitterShowcaseError: React.FC<Props> = ({ errorCode }) => {
  const { gameService } = useGame();
  const { t } = useAppTranslation();

  let message = t("community.showcase.error.invalidUrl");
  if (errorCode === ERRORS.TWITTER_NOT_CONNECTED) {
    message = t("community.showcase.error.notConnected");
  } else if (errorCode === ERRORS.TWITTER_ALREADY_SHOWCASED) {
    message = t("community.showcase.error.alreadyShowcased");
  }

  return (
    <div className="flex flex-col p-1">
      <Label type="danger" className="mb-2">
        {t("community.showcase.error.title")}
      </Label>
      <p className="text-sm mb-3">{message}</p>
      <Button onClick={() => gameService.send("CONTINUE")}>
        {t("continue")}
      </Button>
    </div>
  );
};
