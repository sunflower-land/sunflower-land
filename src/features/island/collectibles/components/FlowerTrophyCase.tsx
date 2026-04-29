import React, { useContext, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "lib/object";
import {
  FLOWER_MILESTONES,
  MILESTONES,
  MilestoneName,
} from "features/game/types/milestones";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { InnerPanel, ButtonPanel } from "components/ui/Panel";
import { SimpleBox } from "features/island/hud/components/codex/SimpleBox";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { MilestonePanel } from "features/island/hud/components/codex/components/Milestone";
import { MilestoneTracker } from "features/island/hud/components/codex/components/MilestoneTracker";
import { getFlowerBySeed } from "features/island/hud/components/codex/lib/utils";
import { FLOWERS, FlowerName } from "features/game/types/flowers";
import { Detail } from "features/island/hud/components/codex/components/Detail";
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ModalOverlay } from "components/ui/ModalOverlay";

import flowerShelfEmpty from "assets/milestones/flower_shelf_empty.webp";
import flowerShelfStart from "assets/milestones/flower_shelf_start.png";
import flowerShelfAlmost from "assets/milestones/flower_shelf_almost.png";
import flowerShelfFull from "assets/milestones/flower_shelf_full.webp";
import giftIcon from "assets/icons/gift.png";

const selectState = (state: MachineState) => state.context.state;

const FLOWERS_BY_SEED = getFlowerBySeed();
const milestoneNames = getKeys(FLOWER_MILESTONES);
const totalMilestones = milestoneNames.length;

function getShelfImage(claimedCount: number): string {
  if (claimedCount === 0) return flowerShelfEmpty;
  if (claimedCount === totalMilestones) return flowerShelfFull;
  if (claimedCount / totalMilestones >= 0.75) return flowerShelfAlmost;
  return flowerShelfStart;
}

const FlowerTrophyCaseContent: React.FC<{
  state: GameState;
  onMilestoneReached: (name: MilestoneName) => void;
}> = ({ state, onMilestoneReached }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [selectedFlower, setSelectedFlower] = useState<FlowerName>();
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneName>();

  const { farmActivity, milestones, flowers } = state;
  const { discovered } = flowers;

  const handleClaimReward = (milestone: MilestoneName) => {
    gameService.send("milestone.claimed", { milestone });
    onMilestoneReached(milestone);
    setSelectedMilestone(undefined);
  };

  if (selectedFlower) {
    const crossBreeds = discovered[selectedFlower] ?? [];
    return (
      <Detail
        name={selectedFlower}
        caught={
          (farmActivity[`${selectedFlower} Harvested`] ?? 0) > 0 ||
          crossBreeds.length > 0
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
      />
    );
  }

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto scrollable pr-1 gap-2">
        <InnerPanel className="space-y-2">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between px-1.5">
              <Label icon={SUNNYSIDE.icons.seedling} type="default">
                {"Flowers"}
              </Label>
              <MilestoneTracker
                milestones={milestoneNames}
                claimedMilestones={milestones}
              />
            </div>
            <div className="px-1.5 py-2 flex overflow-x-auto scrollable">
              {milestoneNames.map((name) => {
                const milestone = MILESTONES[name];
                const percentageComplete =
                  milestone.percentageComplete(farmActivity);
                const claimed = milestones[name];
                return (
                  <ButtonPanel
                    key={name}
                    className="flex mr-2 flex-col items-center justify-center relative w-[100px] h-[80px] shrink-0"
                    onClick={() => setSelectedMilestone(name)}
                  >
                    <span
                      className="text-xs text-center w-full"
                      style={{ textOverflow: "ellipsis", overflowX: "clip" }}
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
            {getKeys(FLOWERS_BY_SEED).map((seedType) => {
              const seedFlowers = FLOWERS_BY_SEED[seedType];
              if (seedFlowers.length === 0) return null;
              const typeIcon = ITEM_DETAILS[seedFlowers[0]].image;
              return (
                <div key={seedType} className="flex flex-col mb-2">
                  <Label
                    type="default"
                    className="capitalize ml-3"
                    icon={typeIcon}
                  >
                    {seedType.replace(" Seed", "")}
                  </Label>
                  <div className="flex flex-wrap">
                    {seedFlowers.map((name) => (
                      <SimpleBox
                        silhouette={
                          !farmActivity[`${name} Harvested`] &&
                          (discovered[name] ?? []).length < 1
                        }
                        inventoryCount={state.inventory[name]?.toNumber()}
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
        </InnerPanel>
      </div>

      <ModalOverlay
        show={!!selectedMilestone}
        className="z-auto"
        onBackdropClick={() => setSelectedMilestone(undefined)}
      >
        <MilestonePanel
          milestone={MILESTONES[selectedMilestone as MilestoneName]}
          farmActivity={farmActivity}
          onClaim={() =>
            handleClaimReward(selectedMilestone as MilestoneName)
          }
          onBack={() => setSelectedMilestone(undefined)}
          isClaimed={!!milestones[selectedMilestone as MilestoneName]}
        />
      </ModalOverlay>
    </>
  );
};

export const FlowerTrophyCase: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, selectState);
  const [showPanel, setShowPanel] = useState(false);

  const { farmActivity, milestones } = state;

  const claimedCount = milestoneNames.filter(
    (name) => !!milestones[name],
  ).length;

  const hasReadyMilestone = milestoneNames.some((name) => {
    const milestone = MILESTONES[name];
    return (
      milestone.percentageComplete(farmActivity) === 100 && !milestones[name]
    );
  });

  const shelfImage = getShelfImage(claimedCount);

  return (
    <>
      <div
        className="relative h-full cursor-pointer hover:img-highlight"
        onClick={() => setShowPanel(true)}
      >
        <img
          src={shelfImage}
          style={{
            width: `${PIXEL_SCALE * 38}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 5}px`,
          }}
          className="absolute"
          alt="Flower Trophy Case"
        />
        {hasReadyMilestone && (
          <img
            src={giftIcon}
            className="ready absolute"
            style={{
              width: `${PIXEL_SCALE * 8}px`,
              top: `${PIXEL_SCALE * 2}px`,
              right: `${PIXEL_SCALE * 4}px`,
            }}
          />
        )}
      </div>

      <Modal show={showPanel} onHide={() => setShowPanel(false)}>
        <CloseButtonPanel
          title="Flower Trophy Case"
          onClose={() => setShowPanel(false)}
        >
          <div className="h-[500px]">
            <FlowerTrophyCaseContent
              state={state}
              onMilestoneReached={() => {}}
            />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
