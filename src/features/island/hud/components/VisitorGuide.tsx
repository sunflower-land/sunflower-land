import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import React, { useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/lib/crafting";
import {
  hasHelpedFarmToday,
  RAFFLE_REWARDS,
  REQUIRED_CHEERS,
  WORKBENCH_MONUMENTS,
} from "features/game/types/monuments";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { hasCleanedToday } from "features/island/clutter/Clutter";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Decimal from "decimal.js-light";
import { getCollectedGarbage } from "features/game/events/landExpansion/collectClutter";
import { ClutterName } from "features/game/types/clutter";
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
import helpIcon from "assets/icons/help.webp";
import clutterIcon from "assets/clutter/clutter.webp";

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

  const pendingProjects = getKeys(
    WORKBENCH_MONUMENTS(gameState.context.visitorState!),
  ).filter(
    (monument) =>
      // Ensures the monument is placed with Coordinates
      !!collectibles[monument]?.some((item) => !!item.coordinates) &&
      // Ensures that the monument hasn't been completed
      !villageProjects[monument]?.helpedAt &&
      (villageProjects[monument]?.cheers ?? 0) <
        REQUIRED_CHEERS(gameState.context.visitorState!)[monument],
  );

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

      <InnerPanel className="mb-1">
        <Label type="default" className="mb-1">
          {t("visitorGuide.tasks")}
        </Label>

        {getKeys(clutter).length > 0 && (
          <div className="flex items-center gap-1 -mt-1">
            <Box image={clutterIcon} />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap">
                <p className="text-xs sm:text-sm">
                  {`${t("visitorGuide.pickUp")} ${getKeys(clutter)
                    .map((type) => `${clutter[type]} ${type}`)
                    .join(", ")}`}
                </p>
              </div>

              <div className="flex items-center my-0.5">
                <p className="text-xxs sm:text-xs mr-1">
                  {t("visitorGuide.clutter")}
                </p>
              </div>
            </div>
          </div>
        )}

        {pendingProjects.length > 0 && (
          <div className="flex items-center gap-1">
            <Box image={helpIcon} count={new Decimal(pendingProjects.length)} />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap">
                <p className="text-xs sm:text-sm">
                  {t("visitorGuide.project")}
                </p>
              </div>
              <div className="flex items-center my-0.5">
                <p className="text-xxs sm:text-xs mr-1">
                  {t("visitorGuide.helpProject")}
                </p>
              </div>
            </div>
          </div>
        )}
      </InnerPanel>

      {pendingProjects.filter((name) => name in RAFFLE_REWARDS).length > 0 && (
        <InnerPanel className="mb-1 p-1">
          <Label type="warning">{t("rewards")}</Label>
          <p className="text-xs p-2">{t("visitorGuide.rewards")}</p>
        </InnerPanel>
      )}

      <Button onClick={onClose}>{t("gotIt")}</Button>
    </div>
  );
};
