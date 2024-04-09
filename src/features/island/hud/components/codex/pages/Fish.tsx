import React, { useContext, useState } from "react";
import { SimpleBox } from "../SimpleBox";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
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

const _farmActivity = (state: MachineState) => state.context.state.farmActivity;
const _milestones = (state: MachineState) => state.context.state.milestones;

const FISH_BY_TYPE = getFishByType();

type Props = {
  onMilestoneReached: (milestoneName: MilestoneName) => void;
};

function getTotalFishCaught(farmActivity: GameState["farmActivity"]) {
  return getKeys(FISH).reduce((total, fish) => {
    return total + (farmActivity[`${fish} Caught`] ?? 0);
  }, 0);
}

export const Fish: React.FC<Props> = ({ onMilestoneReached }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [expandedIndex, setExpandedIndex] = useState<number>();
  const [selectedFish, setSelectedFish] = useState<
    FishName | MarineMarvelName
  >();

  const farmActivity = useSelector(gameService, _farmActivity);
  const milestones = useSelector(gameService, _milestones);

  const [caughtFishCount] = useState<number>(() =>
    getTotalFishCaught(farmActivity)
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
  };

  const milestoneNames = getKeys(FISH_MILESTONES);
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
      />
    );
  }

  return (
    <>
      <div className="space-y-2 mt-1">
        <div className="flex flex-col space-y-2">
          <Label type="formula" className="ml-1.5">
            {t("fish.caught")}
            {caughtFishCount}
          </Label>
          {/* Claimed Milestones */}
          <div className="flex flex-wrap gap-1 px-1.5">
            <MilestoneTracker
              milestones={milestoneNames}
              experienceLabelText={`${experienceLevel} Angler`}
              labelType="default"
              labelIcon={SUNNYSIDE.tools.fishing_rod}
            />
          </div>
          <div className="space-y-1.5 px-1.5 flex flex-wrap">
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
      </div>
    </>
  );
};
