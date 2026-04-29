import React, { useContext, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "lib/object";
import {
  FISH_MILESTONES,
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
import { getFishByType } from "features/island/hud/components/codex/lib/utils";
import { FISH, FishName, MarineMarvelName } from "features/game/types/fishing";
import { Detail } from "features/island/hud/components/codex/components/Detail";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { getChapterMarvelFish } from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";

import fishShelfEmpty from "assets/milestones/fish_shelf_empty.webp";
import fishShelfStart from "assets/milestones/fish_shelf_startt.png";
import fishShelfAlmost from "assets/milestones/fish_shelf_almost.png";
import fishShelfFull from "assets/milestones/fish_shelf_full.webp";
import giftIcon from "assets/icons/gift.png";

const selectState = (state: MachineState) => state.context.state;

const FISH_BY_TYPE = getFishByType();
const milestoneNames = getKeys(FISH_MILESTONES);
const totalMilestones = milestoneNames.length;

function getShelfImage(claimedCount: number): string {
  if (claimedCount === 0) return fishShelfEmpty;
  if (claimedCount === totalMilestones) return fishShelfFull;
  if (claimedCount / totalMilestones >= 0.75) return fishShelfAlmost;
  return fishShelfStart;
}

const FishTrophyCaseContent: React.FC<{
  state: GameState;
  onMilestoneReached: (name: MilestoneName) => void;
}> = ({ state, onMilestoneReached }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const now = useNow();
  const [selectedFish, setSelectedFish] = useState<
    FishName | MarineMarvelName
  >();
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneName>();

  const { farmActivity, milestones } = state;

  const handleClaimReward = (milestone: MilestoneName) => {
    gameService.send("milestone.claimed", { milestone });
    onMilestoneReached(milestone);
    setSelectedMilestone(undefined);
  };

  let chapterMarvelFish: FishName | MarineMarvelName = FISH_BY_TYPE.chapter?.[0];
  try {
    chapterMarvelFish = getChapterMarvelFish(now);
  } catch {
    // chapter not active — fall back to first chapter fish
  }

  if (selectedFish) {
    const hasCaught = (farmActivity[`${selectedFish} Caught`] ?? 0) > 0;
    return (
      <Detail
        name={selectedFish}
        caught={hasCaught}
        onBack={() => setSelectedFish(undefined)}
        additionalLabels={
          <div>
            <div className="flex flex-wrap">
              {FISH[selectedFish].seasons.map((season) => (
                <Label
                  key={`${selectedFish}-${season}`}
                  type="vibrant"
                  className="px-0.5 mr-4 text-xxs whitespace-nowrap mb-1"
                  icon={SEASON_ICONS[season]}
                >
                  {t(`season.${season}`)}
                </Label>
              ))}
            </div>
            <div className="flex flex-wrap items-center">
              {FISH[selectedFish].baits.map((bait) => (
                <Label
                  key={`${selectedFish}-${bait}`}
                  type="chill"
                  className="px-0.5 text-xxs whitespace-nowrap mr-4 mb-1"
                  icon={ITEM_DETAILS[bait].image}
                  secondaryIcon={SUNNYSIDE.icons.heart}
                >
                  {bait}
                </Label>
              ))}
              {hasCaught &&
                FISH[selectedFish].likes.map((chum) => (
                  <Label
                    key={`${selectedFish}-${chum}`}
                    type="chill"
                    className="px-0.5 text-xxs whitespace-nowrap mr-4 mb-1"
                    icon={ITEM_DETAILS[chum].image}
                    secondaryIcon={SUNNYSIDE.icons.heart}
                  >
                    {chum}
                  </Label>
                ))}
              <Label
                type="default"
                className="px-0.5 text-xxs mb-1"
                icon={SUNNYSIDE.tools.fishing_rod}
              >
                {`${farmActivity[`${selectedFish} Caught`] ?? 0} Caught`}
              </Label>
            </div>
          </div>
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
              <Label icon={SUNNYSIDE.tools.fishing_rod} type="default">
                {"Fishing"}
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
            {getKeys(FISH_BY_TYPE).map((type) => {
              const { image: typeIcon } =
                ITEM_DETAILS[
                  type === "chapter" ? chapterMarvelFish : FISH_BY_TYPE[type][0]
                ];
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
                        inventoryCount={state.inventory[name]?.toNumber()}
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

export const FishTrophyCase: React.FC = () => {
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
          alt="Fish Trophy Case"
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
          title="Fish Trophy Case"
          onClose={() => setShowPanel(false)}
        >
          <div className="h-[500px]">
            <FishTrophyCaseContent
              state={state}
              onMilestoneReached={() => {}}
            />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
