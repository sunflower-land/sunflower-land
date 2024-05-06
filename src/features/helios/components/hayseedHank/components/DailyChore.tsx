import { useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ChoreV2, ChoreV2Name, GameState } from "features/game/types/game";

import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { OuterPanel } from "components/ui/Panel";
import { getSeasonalTicket } from "features/game/types/seasons";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";
import { FACTION_POINT_ICONS } from "features/world/ui/factions/FactionDonationPanel";
import { MachineState } from "features/game/lib/gameMachine";

import factions from "assets/icons/factions.webp";
import { FACTION_POINT_MULTIPLIER } from "features/game/events/landExpansion/deliver";
import classNames from "classnames";
import { hasFeatureAccess } from "lib/flags";
import { generateChoreTickets } from "features/game/events/landExpansion/completeChore";

const isDateOnSameDayAsToday = (date: Date) => {
  const today = new Date();

  return (
    date.getUTCFullYear() === today.getUTCFullYear() &&
    date.getUTCMonth() === today.getUTCMonth() &&
    date.getUTCDate() === today.getUTCDate()
  );
};

interface Props {
  id: ChoreV2Name;
  chore: ChoreV2;
  isReadOnly?: boolean;
  isCodex: boolean;
}

const _autosaving = (state: MachineState) => state.matches("autosaving");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _farmId = (state: MachineState) => state.context.farmId;
const _faction = (state: MachineState) => state.context.state.faction;

export const DailyChore: React.FC<Props> = ({
  id,
  chore,
  isReadOnly,
  isCodex = false,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const [isSkipping, setIsSkipping] = useState(false);

  const autosaving = useSelector(gameService, _autosaving);
  const bumpkin = useSelector(gameService, _bumpkin);
  const farmId = useSelector(gameService, _farmId);
  const faction = useSelector(gameService, _faction);

  useEffect(() => {
    if (isSkipping && !autosaving) {
      gameService.send("SAVE");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSkipping, autosaving]);

  const handleComplete = (id: ChoreV2Name) => {
    gameService.send("chore.completed", { id: Number(id) });

    gameService.send("SAVE");
  };

  const handleSkip = (id: ChoreV2Name) => {
    setIsSkipping(true);
    gameService.send("chore.skipped", { id: Number(id) });
    gameService.send("SAVE");
  };

  if (isSkipping && autosaving) {
    return (
      <OuterPanel className="!p-2 mb-2 text-xs">
        <span className="loading text-sm">{t("skipping")}</span>
      </OuterPanel>
    );
  }

  const progress =
    (bumpkin?.activity?.[chore.activity] ?? 0) - chore.startCount;
  const progressPercentage = Math.min(1, progress / chore.requirement) * 100;
  const isTaskComplete = progress >= chore.requirement;
  const { ticketTasksAreFrozen } = getSeasonChangeover({
    id: farmId,
  });

  const descriptionTextClass = isCodex ? "text-xxs sm:text-xs" : "text-xs";

  const tickets = generateChoreTickets({
    game: gameService.state.context.state,
    id,
  });
  return (
    <OuterPanel className="flex flex-col">
      <div
        className={classNames("flex space-x-1 p-1", {
          "pb-0": isCodex,
        })}
      >
        <div className={`${descriptionTextClass} flex-1 space-y-1.5 mb-0.5`}>
          <p>{chore.description}</p>
          <div className="flex items-center">
            <ResizableBar
              percentage={progressPercentage}
              type="progress"
              outerDimensions={{
                width: isCodex ? 40 : 50,
                height: 7,
              }}
            />
            <span className="text-xxs ml-2">{`${setPrecision(
              new Decimal(progress)
            )}/${chore.requirement}`}</span>
          </div>
        </div>
        {/* Rewards */}
        {!chore.completedAt && (
          <div className="flex flex-col text-xs space-y-1">
            <div className="flex items-center justify-end space-x-1">
              <span className="mb-0.5">{tickets}</span>
              <SquareIcon
                icon={ITEM_DETAILS[getSeasonalTicket()].image}
                width={6}
              />
            </div>
            {hasFeatureAccess({} as GameState, "FACTIONS") && (
              <div className="flex items-center justify-end space-x-1">
                <span
                  className={classNames("mb-0.5 text-white", {
                    "text-error": !faction,
                  })}
                >
                  {tickets * FACTION_POINT_MULTIPLIER}
                </span>
                <SquareIcon
                  icon={faction ? FACTION_POINT_ICONS[faction.name] : factions}
                  width={6}
                />
              </div>
            )}
          </div>
        )}
        {chore.completedAt && (
          <div className="flex items-center">
            <SquareIcon icon={SUNNYSIDE.icons.confirm} width={8} />
          </div>
        )}
      </div>
      {!isReadOnly && !chore.completedAt && (
        <div className="flex space-x-1 w-full sm:w-2/3">
          {!isDateOnSameDayAsToday(new Date(chore.createdAt)) && (
            <Button
              className="text-xxs h-8"
              onClick={() => handleSkip(id)}
              disabled={ticketTasksAreFrozen}
            >
              {t("skip")}
            </Button>
          )}
          <Button
            disabled={!isTaskComplete || ticketTasksAreFrozen}
            className="text-xxs h-8"
            onClick={() => handleComplete(id)}
          >
            {t("complete")}
          </Button>
        </div>
      )}
    </OuterPanel>
  );
};
