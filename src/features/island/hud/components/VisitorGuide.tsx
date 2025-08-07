import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/lib/crafting";
import {
  hasHelpedFarmToday,
  WORKBENCH_MONUMENTS,
} from "features/game/types/monuments";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { hasCleanedToday } from "features/island/clutter/Clutter";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Decimal from "decimal.js-light";
import { getCollectedGarbage } from "features/game/events/landExpansion/collectClutter";
import { ClutterName, FARM_PEST } from "features/game/types/clutter";
import { _hasCheeredToday } from "features/island/collectibles/components/Project";

interface VisitorGuideProps {
  onClose: () => void;
}
export const VisitorGuide: React.FC<VisitorGuideProps> = ({ onClose }) => {
  const { gameState } = useGame();

  const { t } = useAppTranslation();

  const collectibles = gameState.context.state.collectibles;

  // If all 5 collected, pop up modal
  const collectedClutter = getCollectedGarbage({
    game: gameState.context.visitorState!,
    farmId: gameState.context.farmId,
  });

  const locations = gameState.context.state.socialFarming.clutter?.locations;

  const hasCleaned = hasCleanedToday(gameState);

  // Reduce clutter to get a count of each type
  const clutter = getKeys(locations ?? {}).reduce(
    (acc, id) => {
      const type = locations?.[id]?.type as ClutterName;
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    },
    {} as Record<ClutterName, number>,
  );

  const hasHelpedToday = hasHelpedFarmToday({
    game: gameState.context.visitorState!,
    farmId: gameState.context.farmId,
  });

  if (hasHelpedToday) {
    return (
      <div className="max-h-[300px] overflow-y-auto scrollable pr-0.5">
        <Label type="default">
          {t("visitorGuide.farmTitle", {
            username:
              gameState.context.state.username ??
              `#${gameState.context.farmId}`,
          })}
        </Label>
        <p className="text-xs sm:text-sm mb-2 p-1">
          {t("visitorGuide.alreadyHelped")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto scrollable pr-0.5">
      <Label type="default">
        {t("visitorGuide.farmTitle", {
          username:
            gameState.context.state.username ?? `#${gameState.context.farmId}`,
        })}
      </Label>
      <p className="text-xs sm:text-sm mb-2 p-1">
        {t("visitorGuide.welcomeMessage")}
      </p>

      <Label type="default">{t("taskBoard.tasks")}</Label>

      {getKeys(clutter).map((type) => {
        const isPest = type in FARM_PEST;

        return (
          <div key={type} className="flex items-center gap-1 -mt-1">
            <Box
              image={ITEM_DETAILS[type].image}
              secondaryImage={hasCleaned ? SUNNYSIDE.icons.confirm : undefined}
              count={hasCleaned ? undefined : new Decimal(clutter[type])}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap">
                <p className="text-xs sm:text-sm">
                  {t("visitorGuide.pickupClutter", {
                    type,
                    amount: clutter[type],
                  })}
                </p>
                {isPest && (
                  <Label type="danger">{t("visitorGuide.netRequired")}</Label>
                )}
              </div>

              <div className="flex items-center my-0.5">
                <p className="text-xxs sm:text-xs mr-1">
                  {isPest ? t("visitorGuide.pest") : t("visitorGuide.clutter")}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {getKeys(WORKBENCH_MONUMENTS)
        .filter((monument) => !!collectibles[monument])
        .map((monument) => {
          const hasCheered = _hasCheeredToday(monument)(gameState);
          return (
            <div className="flex items-center gap-1" key={monument}>
              <Box
                image={ITEM_DETAILS[monument].image}
                secondaryImage={
                  hasCheered ? SUNNYSIDE.icons.confirm : undefined
                }
              />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap">
                  <p className="text-xs sm:text-sm">
                    {t("visitorGuide.cheerMonument", { monument })}
                  </p>
                </div>
                <div className="flex items-center my-0.5">
                  <p className="text-xxs sm:text-xs mr-1">
                    {t("visitorGuide.monument")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

      <Button onClick={onClose}>{t("gotIt")}</Button>
    </div>
  );
};
