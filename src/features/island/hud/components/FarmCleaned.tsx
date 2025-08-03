import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import socialScoreIcon from "assets/icons/social_score.webp";

export const FarmCleaned: React.FC = () => {
  const { gameService, gameState } = useGame();

  const { t } = useAppTranslation();

  const handleClean = () => {
    gameService.send("farm.cleaned", {
      effect: {
        type: "farm.cleaned",
        visitedFarmId: gameService.state.context.farmId,
      },
    });
  };

  return (
    <>
      <div className="p-1">
        <Label type="default">{t("visiting.cleaned")}</Label>
        <p className="text-sm my-1">{t("visiting.thanks")} </p>
        <div className="flex items-center flex-wrap">
          <div className="flex items-center mr-4">
            <NPCIcon parts={gameState.context.state.bumpkin.equipped} />
            <div className="ml-1">
              <p className="text-sm">{gameState.context.state.username}</p>
            </div>
          </div>
          <Label type="warning" icon={socialScoreIcon}>
            {t("socialPoints", { points: 1 })}
          </Label>
        </div>

        {/* <div className="flex items-center flex-wrap">
          <div className="flex items-center mr-4">
            <NPCIcon
              parts={
                gameState.context.visitorState?.bumpkin
                  ?.equipped as BumpkinParts
              }
            />
            <div className="ml-1">
              <p className="text-sm">
                {gameState.context.visitorState?.username as string}
              </p>
            </div>
          </div>
          <Label type="transparent" icon={socialScoreIcon}>
            {t("socialPoints", { points: 2 })}
          </Label>
        </div> */}
      </div>

      <Button onClick={handleClean}>{t("ok")}</Button>
    </>
  );
};
