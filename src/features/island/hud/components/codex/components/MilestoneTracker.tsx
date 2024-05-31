import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { LabelType } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { MilestoneName } from "features/game/types/milestones";
import React, { useContext } from "react";

interface Props {
  milestones: MilestoneName[];
  experienceLabelText: string;
  labelIcon?: string;
  labelType: LabelType;
}

const _milestones = (state: MachineState) => state.context.state.milestones;

export const MilestoneTracker: React.FC<Props> = ({
  milestones,
  experienceLabelText,
  labelIcon,
  labelType,
}) => {
  const { gameService } = useContext(Context);
  const claimedMilestones = useSelector(gameService, _milestones);

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
