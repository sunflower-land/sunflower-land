import { useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ChoreV2, ChoreV2Name } from "features/game/types/game";

import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import { getSeasonalTicket } from "features/game/types/seasons";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";
import { MachineState } from "features/game/lib/gameMachine";

import classNames from "classnames";
import { generateChoreTickets } from "features/game/events/landExpansion/completeChore";
import { Loading } from "features/auth/components";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";

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
      <InnerPanel className="!p-2 mb-2 text-xs">
        <Loading text={t("skipping")} />
      </InnerPanel>
    );
  }

  const progress =
    (bumpkin?.activity?.[chore.activity] ?? 0) - chore.startCount;
  const progressPercentage = Math.min(1, progress / chore.requirement) * 100;
  const isTaskComplete = progress >= chore.requirement;
  const { ticketTasksAreFrozen } = getSeasonChangeover({
    id: farmId,
  });

  const descriptionTextClass = isCodex ? "text-xxs" : "text-xs";

  const tickets = generateChoreTickets({
    game: gameService.state.context.state,
    id,
  });
  return (
    <InnerPanel className="flex flex-col w-full">
      <div
        className={classNames("flex space-x-1 p-1", {
          "pb-0 pl-0": isCodex,
        })}
      >
        {isCodex && (
          <div className="pb-1 relative">
            <NPCIcon parts={NPC_WEARABLES["hank"]} />
          </div>
        )}
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
            <span className="text-xs ml-2 font-secondary">{`${setPrecision(
              new Decimal(progress),
            )}/${chore.requirement}`}</span>
          </div>
        </div>
        {/* Rewards */}
        {!chore.completedAt && (
          <div className="flex flex-col text-xs space-y-1">
            <div className="flex items-center justify-end space-x-1">
              <span className="mb-0.5 font-secondary">{tickets}</span>
              <SquareIcon
                icon={ITEM_DETAILS[getSeasonalTicket()].image}
                width={6}
              />
            </div>
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
    </InnerPanel>
  );
};
