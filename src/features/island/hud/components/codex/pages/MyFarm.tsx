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

type Props = {
  onOpenGuide: (guide: GuidePath) => void;
  onTabChange: (index: number) => void;
};

export const MyFarm: React.FC<Props> = ({ onOpenGuide }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { activeTask } = getActiveTask(gameState.context.state);

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
          <div className="flex flex-col text-xxs space-y-1 mx-1.5">
            <p>Deliveries completed: 5/6</p>
            <p>Chores completed: 5/6</p>
          </div>
          <div className="flex flex-col space-y-2 mx-1.5 pt-2">
            <p className="text-sm">Your Collections</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xxs pb-0.5">Mutants</span>
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
                <span className="text-xs ml-1">{`${mutantsOwned}/${mutantsAvailable}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xxs pb-0.5">Fish</span>
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
                <span className="text-xs ml-1">{`${mutantsOwned}/${mutantsAvailable}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
