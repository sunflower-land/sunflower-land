import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/lib/crafting";
import { WORKBENCH_MONUMENTS } from "features/game/types/monuments";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { _hasCheeredToday } from "features/island/collectibles/components/Monument";
import { hasCleanedToday } from "features/island/clutter/Clutter";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Decimal from "decimal.js-light";
import { getCollectedGarbage } from "features/game/events/landExpansion/collectClutter";

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

  const hasCleaned = hasCleanedToday(gameState);

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
      <div className="flex items-center gap-1 -mt-1">
        <Box
          image={ITEM_DETAILS.Dung.image}
          secondaryImage={hasCleaned ? SUNNYSIDE.icons.confirm : undefined}
          count={hasCleaned ? undefined : new Decimal(collectedClutter)}
        />
        <div>
          <p className="text-xs sm:text-sm">
            {t("visitorGuide.pickupClutter")}
          </p>
          <div className="flex items-center my-0.5">
            <p className="text-xxs sm:text-xs mr-1">
              {t("visitorGuide.clutter")}
            </p>
          </div>
        </div>
      </div>

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

      <div className="flex items-center">
        <Box image={SUNNYSIDE.icons.expression_confused} />
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap">
            <p className="text-xs sm:text-sm">{t("visitorGuide.catchPests")}</p>
            <Label type="danger">{t("visitorGuide.netRequired")}</Label>
          </div>
          <div className="flex items-center my-0.5">
            <p className="text-xxs sm:text-xs mr-1 italic">
              {t("coming.soon")}
            </p>
          </div>
        </div>
      </div>

      <Button onClick={onClose}>{t("gotIt")}</Button>
    </div>
  );
};
