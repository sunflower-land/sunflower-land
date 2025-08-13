import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import socialScoreIcon from "assets/icons/social_score.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasVipAccess } from "features/game/lib/vipAccess";

interface Props {
  onClose: () => void;
}

export const FarmHelped: React.FC<Props> = ({ onClose }) => {
  const { gameService, gameState } = useGame();

  const { t } = useAppTranslation();

  const handleClean = () => {
    gameService.send("farm.helped", {
      effect: {
        type: "farm.helped",
        visitedFarmId: gameService.state.context.farmId,
      },
    });

    onClose();
  };

  return (
    <>
      <div className="p-1">
        <Label type="default">{t("visiting.helped")}</Label>
        <p className="text-sm my-1">{t("visiting.helped.thanks")} </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-1">
          <div className="flex items-center mr-4">
            <NPCIcon parts={gameState.context.state.bumpkin.equipped} />
            <div className="ml-1">
              <p className="text-sm">{gameState.context.state.username}</p>
            </div>
          </div>
          <Label type="warning" className="mr-2" icon={socialScoreIcon}>
            {t("socialPoints", { points: 1 })}
          </Label>
          {hasVipAccess({
            game: gameService.getSnapshot().context.visitorState!,
          }) && (
            <Label type="warning" icon={ITEM_DETAILS["Love Charm"].image}>
              {`+1 Love Charm`}
            </Label>
          )}
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
