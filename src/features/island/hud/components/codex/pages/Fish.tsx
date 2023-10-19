import React, { useContext, useState } from "react";
import { SimpleBox } from "../SimpleBox";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Milestone } from "../components/Milestone";
import { MILESTONES } from "features/game/types/milestones";
import { getFishByType } from "../lib/utils";

const LABEL_RIGHT_SHIFT_PX = -5 * PIXEL_SCALE;
const LABEL_TOP_SHIFT_PX = -4 * PIXEL_SCALE;

const _farmActivity = (state: MachineState) =>
  state.context.state.farmActivity ?? {};

const FISH_BY_TYPE = getFishByType();

export const Fish: React.FC = () => {
  const { gameService } = useContext(Context);
  const farmActivity = useSelector(gameService, _farmActivity);
  const [expandedIndex, setExpandedIndex] = useState<number>();

  const handleMilestoneExpand = (milestoneIndex: number) => {
    if (expandedIndex === milestoneIndex) {
      setExpandedIndex(undefined);
    } else {
      setExpandedIndex(milestoneIndex);
    }
  };

  return (
    <div className="space-y-2 mt-1">
      <div className="flex flex-col">
        <div className="space-y-1.5 px-1.5">
          {Object.values(MILESTONES).map((milestone, index) => (
            <Milestone
              key={milestone.task}
              milestone={milestone}
              isExpanded={expandedIndex === index}
              farmActivity={farmActivity}
              onClick={() => handleMilestoneExpand(index)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        {getKeys(FISH_BY_TYPE).map((type) => (
          <div key={type} className="flex flex-col mb-2">
            <h3 className="capitalize pl-1.5 text-sm">{`${type} Fish`}</h3>
            <div className="flex flex-wrap">
              {FISH_BY_TYPE[type].map((name) => {
                const caughtCount = farmActivity[`${name} Caught`] ?? 0;

                return (
                  <SimpleBox
                    onClick={console.log}
                    key={name}
                    image={ITEM_DETAILS[name].image}
                  >
                    {caughtCount > 0 && (
                      <div
                        className="absolute"
                        style={{
                          right: `${LABEL_RIGHT_SHIFT_PX}px`,
                          top: `${LABEL_TOP_SHIFT_PX}px`,
                          pointerEvents: "none",
                        }}
                      >
                        <Label type="default" className="px-0.5 text-xxs">
                          {caughtCount}
                        </Label>
                      </div>
                    )}
                  </SimpleBox>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
