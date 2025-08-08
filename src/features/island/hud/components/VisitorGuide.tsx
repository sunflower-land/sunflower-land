import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/lib/crafting";
import {
  hasHelpedFarmToday,
  REQUIRED_CHEERS,
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
import { InnerPanel } from "components/ui/Panel";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import {
  getHelpLimit,
  hasHitHelpLimit,
  HELP_LIMIT_COST,
} from "features/game/events/landExpansion/increaseHelpLimit";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { secondsTillReset, secondsToString } from "lib/utils/time";
import { useSelector } from "@xstate/react";

interface VisitorGuideProps {
  onClose: () => void;
}
export const VisitorGuide: React.FC<VisitorGuideProps> = ({ onClose }) => {
  const { gameState, gameService } = useGame();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const { t } = useAppTranslation();

  const collectibles = gameState.context.state.collectibles;

  // If all 5 collected, pop up modal
  const collectedClutter = getCollectedGarbage({
    game: gameState.context.visitorState!,
    farmId: gameState.context.farmId,
  });

  const locations = useSelector(
    gameService,
    (state) => state.context.state.socialFarming.clutter?.locations,
  );
  const villageProjects = useSelector(
    gameService,
    (state) => state.context.state.socialFarming.villageProjects,
  );

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

  const handleIncreaseLimit = () => {
    gameService.send("helpLimit.increased");
    setShowConfirmation(false);
  };

  const hasResources = getObjectEntries(HELP_LIMIT_COST).every(
    ([item, amount]) =>
      gameState.context.visitorState?.inventory[item]?.gte(
        amount ?? new Decimal(0),
      ),
  );

  if (showConfirmation) {
    return (
      <InnerPanel>
        <div className="p-1">
          <Label type="danger" className="mb-2">
            {t("help.increaseLimit")}
          </Label>
          <p className="text-sm mb-1">{t("bin.increaseLimit.description")}</p>
          {getObjectEntries(HELP_LIMIT_COST).map(([item, amount]) => (
            <span className="flex items-center" key={item}>
              {`${amount} x ${item}`}
            </span>
          ))}
        </div>
        <div className="flex">
          <Button className="mr-1" onClick={() => setShowConfirmation(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleIncreaseLimit}>{t("confirm")}</Button>
        </div>
      </InnerPanel>
    );
  }

  if (hasHelpedToday) {
    return (
      <InnerPanel className="max-h-[300px] overflow-y-auto scrollable pr-0.5">
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
      </InnerPanel>
    );
  }

  const helpLimit = getHelpLimit({
    game: gameState.context.visitorState!,
  });

  const hasHitLimit = hasHitHelpLimit({
    game: gameState.context.visitorState!,
  });

  if (hasHitLimit) {
    return (
      <div className="max-h-[300px] overflow-y-auto scrollable pr-0.5">
        <InnerPanel className="mb-1">
          <div className="flex items-center justify-between">
            <Label type="danger">{t("help.limitReached")}</Label>

            <div className="flex items-center">
              <img src={SUNNYSIDE.icons.stopwatch} className="h-6 mr-2" />
              <p className="text-xs my-2">
                {t("visitorGuide.binGuide.reset", {
                  time: secondsToString(secondsTillReset(), {
                    length: "short",
                  }),
                })}
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm  p-1">
            {t("help.limitReached.description", { helpLimit })}
          </p>
        </InnerPanel>
        <InnerPanel>
          <div className="p-1">
            <Label type="default" className="mb-2">
              {t("help.makeRoom")}
            </Label>
            <p className="text-sm mb-1">{t("help.cantWait.description")}</p>
            <div className="flex flex-wrap space-x-2 mb-1">
              {getObjectEntries(HELP_LIMIT_COST).map(([item, amount]) => (
                <RequirementLabel
                  key={item}
                  type="item"
                  item={item}
                  requirement={amount ?? new Decimal(0)}
                  balance={
                    gameState.context.visitorState?.inventory[item] ??
                    new Decimal(0)
                  }
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button disabled={!hasResources} className="mr-1" onClick={onClose}>
              {t("close")}
            </Button>
            <Button
              disabled={!hasResources}
              onClick={() => setShowConfirmation(true)}
            >
              {t("help.increaseLimit")}
            </Button>
          </div>
        </InnerPanel>
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto scrollable pr-0.5">
      <InnerPanel className="mb-1">
        <Label type="default">
          {t("visitorGuide.farmTitle", {
            username:
              gameState.context.state.username ??
              `#${gameState.context.farmId}`,
          })}
        </Label>
        <p className="text-xs sm:text-sm mb-2 p-1">
          {t("visitorGuide.welcomeMessage")}
        </p>
      </InnerPanel>

      <InnerPanel>
        <Label type="default">{t("taskBoard.tasks")}</Label>

        {getKeys(clutter).map((type) => {
          const isPest = type in FARM_PEST;

          return (
            <div key={type} className="flex items-center gap-1 -mt-1">
              <Box
                image={ITEM_DETAILS[type].image}
                secondaryImage={
                  hasCleaned ? SUNNYSIDE.icons.confirm : undefined
                }
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
                    {isPest
                      ? t("visitorGuide.pest")
                      : t("visitorGuide.clutter")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {getKeys(WORKBENCH_MONUMENTS(gameState.context.visitorState!))
          .filter(
            (monument) =>
              // Ensures the monument is placed with Coordinates
              !!collectibles[monument]?.some((item) => !!item.coordinates) &&
              // Ensures that the monument hasn't been completed
              (villageProjects[monument]?.cheers ?? 0) <
                REQUIRED_CHEERS[monument],
          )
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
      </InnerPanel>
    </div>
  );
};
