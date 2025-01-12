import React, { useState } from "react";
import { SimpleBox } from "../SimpleBox";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  FLOWER_MILESTONES,
  MilestoneName,
  getExperienceLevelForMilestones,
} from "features/game/types/milestones";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState } from "features/game/types/game";
import { FLOWERS, FlowerName } from "features/game/types/flowers";
import { getFlowerBySeed } from "../lib/utils";
import { Detail } from "../components/Detail";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";

const _farmActivity = (state: MachineState) => state.context.state.farmActivity;
const _milestones = (state: MachineState) => state.context.state.milestones;
const _discovered = (state: MachineState) =>
  state.context.state.flowers.discovered;

const FLOWERS_BY_SEED = getFlowerBySeed();

type Props = {
  onMilestoneReached: (milestoneName: MilestoneName) => void;
  gameService: MachineInterpreter;
  state: GameState;
};

function getTotalFlowersFound(farmActivity: GameState["farmActivity"]) {
  return getKeys(FLOWERS).reduce((total, flower) => {
    return total + (farmActivity[`${flower} Harvested`] ?? 0);
  }, 0);
}

export const Flowers: React.FC<Props> = ({
  onMilestoneReached,
  state,
  gameService,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number>();
  const [selectedFlower, setSelectedFlower] = useState<FlowerName>();
  const { t } = useAppTranslation();

  const { farmActivity, milestones, flowers } = state;
  const { discovered } = flowers;

  const crossBreeds = (selectedFlower && discovered[selectedFlower]) ?? [];

  const [foundFlowersCount] = useState<number>(() =>
    getTotalFlowersFound(farmActivity),
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

  const milestoneNames = getKeys(FLOWER_MILESTONES);
  const unclaimedMilestones = milestoneNames.filter(
    (milestone) => !milestones[milestone],
  );
  const claimedMilestoneCount =
    milestoneNames.length - unclaimedMilestones.length;
  const experienceLevel = getExperienceLevelForMilestones(
    claimedMilestoneCount,
    milestoneNames.length,
  );

  if (selectedFlower) {
    return (
      <Detail
        name={selectedFlower}
        caught={
          (farmActivity[`${selectedFlower} Harvested`] ?? 0) > 0 ||
          (discovered[selectedFlower] ?? []).length > 0
        }
        onBack={() => setSelectedFlower(undefined)}
        additionalLabels={
          <>
            <Label
              type="default"
              className="px-0.5 text-xxs"
              icon={SUNNYSIDE.icons.seedling}
            >
              {`${farmActivity[`${selectedFlower} Harvested`] ?? 0} Found`}
            </Label>
            <Label
              type="chill"
              className="px-0.5 text-xxs whitespace-nowrap"
              icon={ITEM_DETAILS[FLOWERS[selectedFlower].seed].image}
            >
              {FLOWERS[selectedFlower].seed}
            </Label>
            {crossBreeds.map((crossbreed) => (
              <Label
                key={crossbreed}
                type="formula"
                className="px-0.5 text-xxs whitespace-nowrap"
                icon={ITEM_DETAILS[crossbreed].image}
              >
                {crossbreed}
              </Label>
            ))}
          </>
        }
        state={state}
      ></Detail>
    );
  }

  return (
    <InnerPanel
      className={classNames("flex flex-col h-full overflow-y-auto scrollable")}
    >
      <div className="space-y-2 mt-1">
        <div className="flex flex-col space-y-2">
          <Label type="formula" className="ml-1.5">
            {`${t("flowers.found")}: ${foundFlowersCount}`}
          </Label>
          {/* Milestones disabled for spring bloom launch */}
          {/* Claimed Milestones */}
          {/* <div className="flex flex-wrap gap-1 px-1.5">
            <MilestoneTracker
              milestones={milestoneNames}
              experienceLabelText={`${experienceLevel} Gardener`}
              labelType="default"
              labelIcon={SUNNYSIDE.icons.seedling}
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
          </div> */}
        </div>
        <div className="flex flex-col">
          {getKeys(FLOWERS_BY_SEED).map((type) => {
            const typeIcon = ITEM_DETAILS[FLOWERS_BY_SEED[type][0]].image;

            return (
              <div key={type} className="flex flex-col mb-2">
                <Label
                  type="default"
                  className="capitalize ml-3"
                  icon={typeIcon}
                >
                  {type}
                </Label>
                <div className="flex flex-wrap">
                  {FLOWERS_BY_SEED[type].map((name) => (
                    <SimpleBox
                      silhouette={
                        !farmActivity[`${name} Harvested`] &&
                        (discovered[name] ?? []).length < 1
                      }
                      onClick={() => setSelectedFlower(name)}
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
    </InnerPanel>
  );
};
