import { Label } from "components/ui/Label";
import React, { useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  getHelpLimit,
  getHelpRequired,
  hasHitHelpLimit,
} from "features/game/types/monuments";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { HELP_LIMIT_COST } from "features/game/events/landExpansion/increaseHelpLimit";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { secondsTillReset, secondsToString } from "lib/utils/time";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { ProgressBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/lib/crafting";
import { SmallBox } from "components/ui/SmallBox";

import helpIcon from "assets/icons/help.webp";
import clutterIcon from "assets/clutter/clutter.webp";

interface VisitorGuideProps {
  farmHelpRequired: number;
  homeHelpRequired: number;
  petHouseHelpRequired: number;
  onClose: () => void;
}

const _visitorState = (state: MachineState) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return state.context.visitorState!;
};
const _totalHelpedToday = (state: MachineState) =>
  state.context.totalHelpedToday ?? 0;
const _game = (state: MachineState) => state.context.state;
const _username = (state: MachineState) =>
  state.context.state.username ?? `#${state.context.farmId}`;

export const VisitorGuide: React.FC<VisitorGuideProps> = ({
  farmHelpRequired,
  homeHelpRequired,
  petHouseHelpRequired,
  onClose,
}) => {
  const { gameState, gameService } = useGame();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const { t } = useAppTranslation();

  const visitorState = useSelector(gameService, _visitorState);
  const totalHelpedToday = useSelector(gameService, _totalHelpedToday);
  const username = useSelector(gameService, _username);
  const game = useSelector(gameService, _game);

  // Make a list of in home vs on land
  const hasHelpedToday = gameState.context.hasHelpedPlayerToday ?? false;

  const handleIncreaseLimit = () => {
    gameService.send({ type: "helpLimit.increased" });
    setShowConfirmation(false);
  };

  const hasResources = getObjectEntries(HELP_LIMIT_COST).every(
    ([item, amount]) =>
      gameState.context.visitorState?.inventory[item]?.gte(
        amount ?? new Decimal(0),
      ),
  );

  const {
    tasks: { farm: farmTasks, home: homeTasks, petHouse: petHouseTasks },
  } = getHelpRequired({ game });

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
      <InnerPanel className="pr-0.5">
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
    game: visitorState,
  });

  const hasHitLimit = hasHitHelpLimit({
    game: visitorState,
    totalHelpedToday,
  });

  if (hasHitLimit) {
    return (
      <div className="pr-0.5">
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

  const farmTasksCompleted = farmHelpRequired - farmTasks.count;
  const homeTasksCompleted = homeHelpRequired - homeTasks.count;
  const petHouseTasksCompleted = petHouseHelpRequired - petHouseTasks.count;
  const farmPercentage = (farmTasksCompleted / farmHelpRequired) * 100;
  const homePercentage = (homeTasksCompleted / homeHelpRequired) * 100;
  const petHousePercentage =
    (petHouseTasksCompleted / petHouseHelpRequired) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Label type="default">{username}</Label>
        <img
          src={SUNNYSIDE.icons.close}
          onClick={onClose}
          className="h-6 cursor-pointer"
        />
      </div>
      <InnerPanel>
        <p className="text-xs sm:text-sm p-1 -mt-0.5">
          {t("visitorGuide.welcomeMessage")}
        </p>
      </InnerPanel>
      <InnerPanel className="flex flex-col gap-1">
        <div className="flex justify-between items-stretch">
          <Label type="default">{t("visitorGuide.onTheFarm")}</Label>
          <div className="relative p-1 flex-grow flex justify-end gap-1">
            <span className="text-xs mt-[1px]">
              {`${farmTasksCompleted}/${farmHelpRequired}`}
            </span>
            <ProgressBar
              type="quantity"
              percentage={farmPercentage}
              formatLength="full"
              className="relative"
              style={{
                width: PIXEL_SCALE * 15,
                height: PIXEL_SCALE * 7,
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-1">
          {getKeys(farmTasks.clutter).length > 0 && (
            <div className="flex items-center gap-2 -ml-1">
              <SmallBox image={clutterIcon} />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap">
                  <p className="text-xs sm:text-sm">
                    {`${t("visitorGuide.pickUp")} ${getKeys(farmTasks.clutter)
                      .map((type) => `${farmTasks.clutter[type]} ${type}`)
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
          {farmTasks.projects.length > 0 && (
            <div className="flex items-center gap-2 -ml-1 -mt-1">
              <SmallBox image={helpIcon} />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap">
                  <p className="text-xs sm:text-sm">
                    {t("visitorGuide.project", {
                      count: farmTasks.projects.length,
                    })}
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
          {farmTasks.pets.length > 0 && (
            <div className="flex items-center gap-2 -ml-1 -mt-1">
              <SmallBox image={SUNNYSIDE.icons.drag} />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap">
                  <p className="text-xs sm:text-sm">
                    {t("visitorGuide.pets", { count: farmTasks.pets.length })}
                  </p>
                </div>
                <div className="flex items-center my-0.5">
                  <p className="text-xxs sm:text-xs mr-1">
                    {t("visitorGuide.showLove")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </InnerPanel>
      {homeHelpRequired > 0 && (
        <InnerPanel className="flex flex-col gap-2">
          <div className="flex justify-between items-stretch">
            <Label type="default">{t("visitorGuide.inTheHouse")}</Label>
            <div className="relative p-1 flex-grow flex justify-end gap-1">
              <span className="text-xs mt-[1px]">
                {`${homeTasksCompleted}/${homeHelpRequired}`}
              </span>
              <ProgressBar
                type="quantity"
                percentage={homePercentage}
                formatLength="full"
                className="relative"
                style={{
                  width: PIXEL_SCALE * 15,
                  height: PIXEL_SCALE * 7,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-1">
            {homeTasks.projects.length > 0 && (
              <div className="flex items-center gap-2 -ml-1 -mt-1">
                <SmallBox image={helpIcon} />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap">
                    <p className="text-xs sm:text-sm">
                      {t("visitorGuide.project", {
                        count: homeTasks.projects.length,
                      })}
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
            {homeTasks.pets.length > 0 && (
              <div className="flex items-center gap-2 -ml-1 -mt-1">
                <SmallBox image={SUNNYSIDE.icons.drag} />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap">
                    <p className="text-xs sm:text-sm">
                      {t("visitorGuide.pets", { count: homeTasks.pets.length })}
                    </p>
                  </div>
                  <div className="flex items-center my-0.5">
                    <p className="text-xxs sm:text-xs mr-1">
                      {t("visitorGuide.showLove")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </InnerPanel>
      )}
      {petHouseHelpRequired > 0 && (
        <InnerPanel className="flex flex-col gap-2">
          <div className="flex justify-between items-stretch">
            <Label type="default">{t("visitorGuide.inThePetHouse")}</Label>
            <div className="relative p-1 flex-grow flex justify-end gap-1">
              <span className="text-xs mt-[1px]">
                {`${petHouseTasksCompleted}/${petHouseHelpRequired}`}
              </span>
              <ProgressBar
                type="quantity"
                percentage={petHousePercentage}
                formatLength="full"
                className="relative"
                style={{
                  width: PIXEL_SCALE * 15,
                  height: PIXEL_SCALE * 7,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-1">
            {petHouseTasks.pets.length > 0 && (
              <div className="flex items-center gap-2 -ml-1 -mt-1">
                <SmallBox image={SUNNYSIDE.icons.drag} />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap">
                    <p className="text-xs sm:text-sm">
                      {t("visitorGuide.pets", {
                        count: petHouseTasks.pets.length,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center my-0.5">
                    <p className="text-xxs sm:text-xs mr-1">
                      {t("visitorGuide.showLove")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </InnerPanel>
      )}
    </div>
  );
};
