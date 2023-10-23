import React, { useContext, useState } from "react";
import { SimpleBox } from "../SimpleBox";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { MilestonePanel } from "../components/Milestone";
import { MilestoneTracker } from "../components/MilestoneTracker";
import {
  MILESTONES,
  MilestoneName,
  getExperienceLevelForMilestones,
} from "features/game/types/milestones";
import { getFishByType } from "../lib/utils";
import { SUNNYSIDE } from "assets/sunnyside";
import { FishName } from "features/game/types/fishing";
import { Detail } from "../components/Detail";

const LABEL_RIGHT_SHIFT_PX = -5 * PIXEL_SCALE;
const LABEL_TOP_SHIFT_PX = -4 * PIXEL_SCALE;

const _farmActivity = (state: MachineState) => state.context.state.farmActivity;
const _milestones = (state: MachineState) => state.context.state.milestones;

const FISH_BY_TYPE = getFishByType();

type Props = {
  onMilestoneReached: (milestoneName: MilestoneName) => void;
};

export const Fish: React.FC<Props> = ({ onMilestoneReached }) => {
  const { gameService } = useContext(Context);
  const [expandedIndex, setExpandedIndex] = useState<number>();
  const [selectedFish, setSelectedFish] = useState<FishName>();

  const farmActivity = useSelector(gameService, _farmActivity);
  const milestones = useSelector(gameService, _milestones);

  const handleMilestoneExpand = (milestoneIndex: number) => {
    if (expandedIndex === milestoneIndex) {
      setExpandedIndex(undefined);
    } else {
      setExpandedIndex(milestoneIndex);
    }
  };

  const handleClaimReward = (milestone: MilestoneName) => {
    gameService.send("milestone.claimed", { milestone });
    setExpandedIndex(undefined);
    onMilestoneReached(milestone);
  };

  const milestoneNames = getKeys(MILESTONES);
  const unclaimedMilestones = milestoneNames.filter(
    (milestone) => !milestones[milestone]
  );
  const claimedMilestoneCount =
    milestoneNames.length - unclaimedMilestones.length;
  const experienceLevel = getExperienceLevelForMilestones(
    claimedMilestoneCount,
    milestoneNames.length
  );

  if (selectedFish) {
    return (
      <Detail name={selectedFish} onBack={() => setSelectedFish(undefined)} />
    );
  }

  return (
    <>
      <div className="space-y-2 mt-1">
        <div className="flex flex-col space-y-2">
          {/* Claimed Milestones */}
          <div className="flex flex-wrap gap-1 px-1.5">
            <MilestoneTracker
              milestones={milestoneNames}
              experienceLabelText={`${experienceLevel} Angler`}
              labelType="default"
              labelIcon={SUNNYSIDE.tools.fishing_rod}
            />
          </div>
          <div className="space-y-1.5 px-1.5">
            {unclaimedMilestones.map((milestone, index) => (
              <MilestonePanel
                key={milestone}
                milestone={MILESTONES[milestone]}
                isExpanded={expandedIndex === index}
                farmActivity={farmActivity}
                onClick={() => handleMilestoneExpand(index)}
                onClaim={() => handleClaimReward(milestone)}
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
                      onClick={() => setSelectedFish(name)}
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
    </>
  );
};
