import React, { useState } from "react";
import { SimpleBox } from "../SimpleBox";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import { MilestonePanel } from "../components/Milestone";
import { MilestoneTracker } from "../components/MilestoneTracker";
import {
  FISH_MILESTONES,
  MILESTONES,
  MilestoneName,
  getExperienceLevelForMilestones,
} from "features/game/types/milestones";
import { getFishByType } from "../lib/utils";
import { SUNNYSIDE } from "assets/sunnyside";
import { FISH, FishName, MarineMarvelName } from "features/game/types/fishing";
import { Detail } from "../components/Detail";
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import classNames from "classnames";

import giftIcon from "assets/icons/gift.png";
import { ResizableBar } from "components/ui/ProgressBar";

const FISH_BY_TYPE = getFishByType();

type Props = {
  onMilestoneReached: (milestoneName: MilestoneName) => void;
  gameService: MachineInterpreter;
  state: GameState;
};

function getTotalFishCaught(farmActivity: GameState["farmActivity"]) {
  return getKeys(FISH).reduce((total, fish) => {
    return total + (farmActivity[`${fish} Caught`] ?? 0);
  }, 0);
}

export const Fish: React.FC<Props> = ({
  onMilestoneReached,
  state,
  gameService,
}) => {
  const { t } = useAppTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number>();
  const [selectedFish, setSelectedFish] = useState<
    FishName | MarineMarvelName
  >();

  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneName>();

  const { farmActivity, milestones } = state;

  const [caughtFishCount] = useState<number>(() =>
    getTotalFishCaught(farmActivity),
  );

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
    setSelectedMilestone(undefined);
  };

  const milestoneNames = getKeys(FISH_MILESTONES);
  const unclaimedMilestones = milestoneNames.filter(
    (milestone) => !milestones[milestone],
  );
  const claimedMilestoneCount =
    milestoneNames.length - unclaimedMilestones.length;
  const experienceLevel = getExperienceLevelForMilestones(
    claimedMilestoneCount,
    milestoneNames.length,
  );

  if (selectedFish) {
    return (
      <Detail
        name={selectedFish}
        caught={(farmActivity[`${selectedFish} Caught`] ?? 0) > 0}
        onBack={() => setSelectedFish(undefined)}
        additionalLabels={
          <>
            <Label
              type="default"
              className="px-0.5 text-xxs"
              icon={SUNNYSIDE.tools.fishing_rod}
            >
              {`${farmActivity[`${selectedFish} Caught`] ?? 0} Caught`}
            </Label>
            {FISH[selectedFish].baits.map((bait) => (
              <Label
                key={`${selectedFish}-${bait}`}
                type="chill"
                className="px-0.5 text-xxs whitespace-nowrap"
                icon={ITEM_DETAILS[bait].image}
              >
                {bait}
              </Label>
            ))}
          </>
        }
        state={state}
      />
    );
  }

  if (selectedMilestone) {
    return (
      <MilestonePanel
        milestone={MILESTONES[selectedMilestone]}
        farmActivity={farmActivity}
        onClaim={() => handleClaimReward(selectedMilestone)}
        onBack={() => setSelectedMilestone(undefined)}
        isClaimed={!!milestones[selectedMilestone]}
      />
    );
  }

  return (
    <div
      className={classNames(
        "flex flex-col h-full overflow-y-auto scrollable pr-1",
      )}
    >
      <InnerPanel className="space-y-2 mt-1 mb-1">
        <div className="flex flex-col space-y-2">
          {/* Claimed Milestones */}
          <div className="flex justify-between px-1.5">
            <Label
              icon={SUNNYSIDE.tools.fishing_rod}
              type="default"
            >{`Fishing`}</Label>
            <MilestoneTracker
              milestones={milestoneNames}
              claimedMilestones={state.milestones}
            />
          </div>

          <div className="px-1.5 py-2 flex overflow-x-auto scrollable">
            {milestoneNames.map((name, index) => {
              const milestone = MILESTONES[name];
              const percentageComplete =
                milestone.percentageComplete(farmActivity);

              const claimed = milestones[name];
              return (
                <ButtonPanel
                  key={name}
                  style={{
                    height: "80px",
                    width: "100px",
                    zIndex: 100 - index,
                  }}
                  className="flex mr-2  flex-col items-center justify-center relative"
                  onClick={() => setSelectedMilestone(name)}
                >
                  <span
                    className="text-xs text-center w-full"
                    style={{
                      textOverflow: "ellipsis",
                      overflowX: "clip",
                    }}
                  >
                    {name}
                  </span>
                  <img
                    src={claimed ? SUNNYSIDE.icons.confirm : giftIcon}
                    className="h-6 absolute -top-4 -right-4"
                  />
                  <div
                    className="absolute w-full left-0 right-0 flex justify-center"
                    style={{ bottom: "-12px" }}
                  >
                    <ResizableBar
                      percentage={percentageComplete}
                      type="progress"
                    />
                  </div>
                </ButtonPanel>
              );
            })}
          </div>
        </div>
      </InnerPanel>
      <InnerPanel>
        <div className="flex flex-col">
          {getKeys(FISH_BY_TYPE).map((type) => {
            const typeIcon = ITEM_DETAILS[FISH_BY_TYPE[type][0]].image;

            return (
              <div key={type} className="flex flex-col mb-2">
                <Label
                  type="default"
                  className="capitalize ml-3"
                  icon={typeIcon}
                >
                  {type !== "marine marvel" ? `${type} Fish` : "Marine Marvels"}
                </Label>
                <div className="flex flex-wrap">
                  {FISH_BY_TYPE[type].map((name) => (
                    <SimpleBox
                      silhouette={!farmActivity[`${name} Caught`]}
                      onClick={() => setSelectedFish(name)}
                      key={name}
                      image={ITEM_DETAILS[name].image}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </InnerPanel>
    </div>
  );
};
