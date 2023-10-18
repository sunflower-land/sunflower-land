import React, { useContext, useState } from "react";
import { getFishByType } from "../utils";
import { FishName, FishType } from "features/game/types/fishing";
import { SimpleBox } from "../SimpleBox";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { ITEM_DETAILS } from "features/game/types/images";
import { Milestone } from "../components/Milestone";

const LABEL_RIGHT_SHIFT_PX = -5 * PIXEL_SCALE;
const LABEL_TOP_SHIFT_PX = -4 * PIXEL_SCALE;

const FISH_BY_TYPE: Record<FishType, FishName[]> = getFishByType();

const MILESTONES = [
  {
    task: "Catch 5 of each basic fish",
    percentageComplete: (analytics: any) => {
      // total number of basic fish
      const totalFishRequired = FISH_BY_TYPE.basic.length * 5;

      // Get total of each basic fish caught with each one capped at 5
      const totalFishCaught = FISH_BY_TYPE.basic.reduce(
        (total, name) => total + Math.min(analytics[`${name} Caught`] ?? 0, 5),
        0
      );

      return Math.min((totalFishCaught / totalFishRequired) * 100, 100);
    },
    reward: {
      item: "Luna's Hat",
    },
  },
  {
    task: "Catch 5 of each advanced fish",
    percentageComplete: (analytics: any) => 100,
    reward: {
      item: "Chef Apron",
    },
  },
  {
    task: "Catch 1 of each expert fish",
    percentageComplete: (analytics: any) =>
      FISH_BY_TYPE.expert.every(
        (name) => (analytics[`${name} Caught`] ?? 0) >= 5
      ),
    reward: {
      item: "Eggplant Onesie",
    },
  },
  {
    task: "Discover all fish",
    percentageComplete: (analytics: any) =>
      [
        ...FISH_BY_TYPE.basic,
        ...FISH_BY_TYPE.advanced,
        ...FISH_BY_TYPE.expert,
      ].every((name) => (analytics[`${name} Caught`] ?? 0) >= 1),
    reward: {
      item: "Mushroom Hat",
    },
  },
  {
    task: "Catch 10 of every fish",
    percentageComplete: (analytics: any) =>
      [
        ...FISH_BY_TYPE.basic,
        ...FISH_BY_TYPE.advanced,
        ...FISH_BY_TYPE.expert,
      ].every((name) => (analytics[`${name} Caught`] ?? 0) >= 10),
    reward: {
      item: "Green Amulet",
    },
  },
];

const _analytics = (state: MachineState) => state.context.state.analytics ?? {};

export const Fish: React.FC = () => {
  const { gameService } = useContext(Context);
  const analytics = useSelector(gameService, _analytics);
  const [expandedMilestone, setExpandedMilestone] =
    useState<keyof typeof MILESTONES>();

  const handleMilstoneExpand = (milestoneIndex: keyof typeof MILESTONES) => {
    if (expandedMilestone === milestoneIndex) {
      setExpandedMilestone(undefined);
    } else {
      setExpandedMilestone(milestoneIndex);
    }
  };

  return (
    <div className="space-y-2 mt-1">
      <div className="flex flex-col">
        <div className="space-y-1.5 px-1.5">
          {MILESTONES.map((milestone, index) => (
            <Milestone
              key={milestone.task}
              milestone={milestone}
              isExpanded={expandedMilestone === index}
              analytics={analytics}
              onClick={() => handleMilstoneExpand(index)}
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
                const caughtCount = analytics[`${name} Caught`] ?? 0;

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
