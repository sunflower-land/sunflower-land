import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Bumpkin, ChoreV2, ChoreV2Name } from "features/game/types/game";

import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { OuterPanel } from "components/ui/Panel";
import { getSeasonalTicket } from "features/game/types/seasons";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
export const DailyChore: React.FC<Props> = ({
  id,
  chore,
  isReadOnly,
  isCodex = false,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isSkipping, setIsSkipping] = useState(false);
  const { t } = useAppTranslation();

  useEffect(() => {
    if (isSkipping && !gameState.matches("autosaving")) {
      gameService.send("SAVE");
    }
  }, [isSkipping, gameState.context.state]);

  const complete = (id: ChoreV2Name) => {
    gameService.send("chore.completed", { id: Number(id) });

    gameService.send("SAVE");
  };

  const skip = (id: ChoreV2Name) => {
    setIsSkipping(true);
    gameService.send("chore.skipped", { id: Number(id) });
    gameService.send("SAVE");
  };

  if (isSkipping && gameState.matches("autosaving")) {
    return (
      <OuterPanel className="!p-2 mb-2 text-xs">
        <span className="loading">{t("skipping")}</span>
      </OuterPanel>
    );
  }

  const bumpkin = gameState.context.state.bumpkin as Bumpkin;

  const progress =
    (bumpkin?.activity?.[chore.activity] ?? 0) - chore.startCount;

  const progressPercentage = Math.min(1, progress / chore.requirement) * 100;

  const isTaskComplete = progress >= chore.requirement;

  const { tasksAreFrozen } = getSeasonChangeover({
    id: gameService.state.context.farmId,
  });

  const descriptionTextClass = isCodex
    ? "text-xxs sm:text-xs"
    : "text-xs sm:text-sm";

  return (
    <OuterPanel className="mb-2">
      <div className="flex justify-between">
        <span
          className={`${descriptionTextClass} mb-1 flex-1 whitespace-normal pr-2`}
        >
          {chore.description}
        </span>
        <div className="flex items-start mr-1">
          <span className="text-xs mr-1">{`${chore.tickets} x`}</span>
          <img src={ITEM_DETAILS[getSeasonalTicket()].image} className="h-5" />
        </div>
      </div>
      <div className="flex justify-between flex-wrap items-center">
        <div className="flex mt-1 items-center">
          <ResizableBar
            percentage={progressPercentage}
            type="progress"
            outerDimensions={{
              width: 40,
              height: 8,
            }}
          />
          <span className="text-xxs ml-2">{`${setPrecision(
            new Decimal(progress)
          )}/${chore.requirement}`}</span>
        </div>
        {isReadOnly && chore.completedAt && (
          <div className="flex">
            <span className="text-xs mr-1">{t("completed")}</span>
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
          </div>
        )}
        {!isReadOnly &&
          (chore.completedAt ? (
            <div className="flex">
              <span className="text-xs mr-1">{t("completed")}</span>
              <img src={SUNNYSIDE.icons.confirm} className="h-4" />
            </div>
          ) : (
            <div className="flex mt-1">
              {!isDateOnSameDayAsToday(new Date(chore.createdAt)) && (
                <Button
                  className="text-sm w-24 h-8 mr-2"
                  onClick={() => skip(id)}
                  disabled={tasksAreFrozen}
                >
                  {t("skip")}
                </Button>
              )}

              <Button
                disabled={!isTaskComplete || tasksAreFrozen}
                className="text-sm w-24 h-8"
                onClick={() => complete(id)}
              >
                {t("complete")}
              </Button>
            </div>
          ))}
      </div>
    </OuterPanel>
  );
};
