import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { getCurrentChapter } from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useGame } from "features/game/GameProvider";

export const ChapterStart: React.FC = () => {
  const { gameService } = useGame();
  const now = useNow();
  const chapterName = getCurrentChapter(now);
  const { t } = useAppTranslation();

  const start = () => {
    gameService.send({ type: "chapter.started" });
    gameService.send({ type: "CONTINUE" });
  };

  return (
    <div>
      <Label type="info" className="mx-1 mb-2">
        {chapterName}
      </Label>
      <Button onClick={start}>{t("start")}</Button>
    </div>
  );
};
