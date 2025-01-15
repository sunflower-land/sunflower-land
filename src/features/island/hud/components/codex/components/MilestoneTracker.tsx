import { SUNNYSIDE } from "assets/sunnyside";
import { MilestoneName } from "features/game/types/milestones";
import React from "react";

interface Props {
  milestones: MilestoneName[];
  claimedMilestones: Partial<Record<MilestoneName, number>>;
}

export const MilestoneTracker: React.FC<Props> = ({
  milestones,
  claimedMilestones,
}) => {
  return (
    <div className="flex items-center">
      {milestones.map((name) => {
        if (claimedMilestones[name]) {
          return (
            <img
              src={SUNNYSIDE.icons.confirm}
              className="h-3 mr-1"
              key={name}
            />
          );
        }

        return <img src={SUNNYSIDE.ui.dot} className="h-3 mr-1" key={name} />;
      })}
    </div>
  );
};
