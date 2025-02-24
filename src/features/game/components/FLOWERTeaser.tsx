import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { acknowledgeFLOWERTeaser } from "features/announcements/announcementsStorage";
import { useGame } from "../GameProvider";
import { Button } from "components/ui/Button";
import { News } from "features/farming/mail/components/News";
import newsIcon from "assets/icons/chapter_icon_2.webp";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

export const FLOWERTeaserContent: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();
  const onAcknowledge = () => {
    acknowledgeFLOWERTeaser();
    gameService.send("ACKNOWLEDGE");
  };

  return (
    <div className="relative scrollable overflow-auto pr-0.5 max-h-[500px]">
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute top-0 right-0.5 w-8 cursor-pointer"
        onClick={onAcknowledge}
      />
      <Label icon={newsIcon} type="default" className="ml-2 mt-1">
        {t("news.title")}
      </Label>
      <p className="text-sm my-2 px-1">{t("news.whatsOn")}</p>
      <News />

      <Button onClick={onAcknowledge} className="mt-2">
        {t("continue")}
      </Button>
    </div>
  );
};
