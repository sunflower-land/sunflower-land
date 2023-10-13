import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { Task } from "features/helios/components/hayseedHank/components/Task";
import { getActiveTask } from "features/helios/components/hayseedHank/Otis";
import { useActor } from "@xstate/react";
import { OuterPanel } from "components/ui/Panel";
import { GuidePath } from "features/helios/components/hayseedHank/lib/guide";
import { ResizableBar } from "components/ui/ProgressBar";
import { mutants } from "../types";
import { getTotalMutantCounts } from "../utils";
import { SUNNYSIDE } from "assets/sunnyside";
import { ChoreV2, ChoreV2Name } from "features/game/types/game";

type Props = {
  onOpenGuide: (guide: GuidePath) => void;
  onTabChange: (index: number) => void;
};

export const MyFarm: React.FC<Props> = ({ onOpenGuide }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { activeTask } = getActiveTask(gameState.context.state);

  const ordersCompleted = gameState.context.state.delivery.orders.filter(
    (order) => !!order.completedAt
  ).length;

  const chores =
    gameState.context.state.chores?.chores ??
    ({} as Record<ChoreV2Name, ChoreV2>);
  const choresCompleted = Object.entries(chores).filter(
    ([, chore]) => !!chore.completedAt
  ).length;

  const dailyRewardCollected =
    !!gameState.context.state.dailyRewards?.chest?.collectedAt;

  // collections progress
  const { owned: mutantsOwned, available: mutantsAvailable } =
    getTotalMutantCounts(mutants, gameState.context.state.inventory);

  return (
    <div className="flex flex-col">
      <h2 className="mb-2 ml-1.5">My Farm Today</h2>
      <div className="flex flex-col space-y-2">
        {!!activeTask && (
          <OuterPanel>
            <Task
              onOpenGuide={(guide) => onOpenGuide(guide)}
              task={activeTask}
            />
          </OuterPanel>
        )}
        <div className="divide-y divide-brown-600 space-y-3">
          <div className="flex flex-col text-xxs sm:text-xs space-y-1 mx-1.5">
            <p className="flex items-center gap-1">
              {`Deliveries completed`}
              <span className="ml-1">
                <img
                  src={
                    ordersCompleted
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.close
                  }
                  alt={ordersCompleted ? "All Completed" : "Not Completed"}
                />
              </span>
            </p>
            <p className="flex items-center gap-1">
              {`Chores completed`}
              <span className="ml-1">
                <img
                  src={
                    choresCompleted
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.cancel
                  }
                  alt={choresCompleted ? "All Completed" : "Not Completed"}
                />
              </span>
            </p>
            <p className="flex items-center gap-1">
              Daily chest collected:{" "}
              <span className="ml-1">
                <img
                  src={
                    dailyRewardCollected
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.cancel
                  }
                  alt={dailyRewardCollected ? "Collected" : "Not Collected"}
                />
              </span>
            </p>
          </div>
          <div className="flex flex-col space-y-2 mx-1.5 pt-2">
            <p className="text-xs sm:text-sm">Your Collections</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xxs md:text-xs pb-0.5">Mutants</span>
                <div className="flex-grow">
                  <ResizableBar
                    percentage={(mutantsOwned / mutantsAvailable) * 100}
                    type="progress"
                    outerDimensions={{
                      width: 50,
                      height: 7,
                    }}
                  />
                </div>
                <span className="text-xs sm:text-sm ml-1">{`${mutantsOwned}/${mutantsAvailable}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xxs sm:text-xs pb-0.5">Fish</span>
                <div className="flex-grow">
                  <ResizableBar
                    percentage={(mutantsOwned / mutantsAvailable) * 100}
                    type="progress"
                    outerDimensions={{
                      width: 50,
                      height: 7,
                    }}
                  />
                </div>
                <span className="text-xs sm:text-sm ml-1">{`${mutantsOwned}/${mutantsAvailable}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
