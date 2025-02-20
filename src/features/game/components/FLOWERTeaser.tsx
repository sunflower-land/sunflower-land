import { Button } from "components/ui/Button";
import { acknowledgeFLOWERTeaser } from "features/announcements/announcementsStorage";
import React from "react";
import { useGame } from "../GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const FLOWERTeaserContent: React.FC = () => {
  const { gameService } = useGame();
  const { t } = useAppTranslation();
  function onAcknowledge() {
    acknowledgeFLOWERTeaser();
    gameService.send("ACKNOWLEDGE");
  }
  return (
    <div className="p-2">
      <p className="text-lg text-center">{`$FLOWER is coming soon!`}</p>
      <Button onClick={onAcknowledge} className="mt-4">
        {t("continue")}
      </Button>
    </div>
  );
};
