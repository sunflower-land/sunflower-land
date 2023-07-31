import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

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

interface Props {
  id: ChoreV2Name;
  chore: ChoreV2;
}
export const DailyChore: React.FC<Props> = ({ id, chore }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isSkipping, setIsSkipping] = useState(false);

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
      <OuterPanel className="p-2 mb-2">
        <span className="loading">Skipping</span>
      </OuterPanel>
    );
  }

  const bumpkin = gameState.context.state.bumpkin as Bumpkin;

  const progress =
    (bumpkin?.activity?.[chore.activity] ?? 0) - chore.startCount;

  const progressPercentage = Math.min(1, progress / chore.requirement) * 100;

  const isTaskComplete = progress > chore.requirement;

  return (
    <OuterPanel className="p-2 mb-2">
      <div className="flex justify-between">
        <span className="text-sm mb-1 flex-1 whitespace-normal">
          {chore.description}
        </span>
        <div className="flex items-start mr-1">
          <span className="text-xs mr-1">2 x </span>
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
        {chore.completedAt ? (
          <div className="flex">
            <span className="text-xs mr-1">Completed</span>
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
          </div>
        ) : (
          <div className="flex mt-1">
            <Button className="text-sm w-24 h-8 mr-2" onClick={() => skip(id)}>
              Skip
            </Button>
            <Button
              disabled={!isTaskComplete}
              className="text-sm w-24 h-8"
              onClick={() => complete(id)}
            >
              Complete
            </Button>
          </div>
        )}
      </div>
    </OuterPanel>
  );
};
