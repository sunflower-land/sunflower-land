import React, { useContext, useState } from "react";
import { SimpleBox } from "../SimpleBox";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { MilestonePanel } from "../components/Milestone";
import { MilestoneTracker } from "../components/MilestoneTracker";
import {
  FISH_MILESTONES,
  MILESTONES,
  MilestoneName,
} from "features/game/types/milestones";
import { getFishByType } from "../lib/utils";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  CHAPTER_FISH,
  ChapterFish,
  FISH,
  FishName,
  MAP_PIECES,
  MarineMarvelName,
} from "features/game/types/fishing";
import { Detail } from "../components/Detail";
import { GameState } from "features/game/types/game";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import classNames from "classnames";

import giftIcon from "assets/icons/gift.png";
import mapIcon from "assets/icons/map.webp";
import { ResizableBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ModalOverlay } from "components/ui/ModalOverlay";
import {
  getChapterMarvelFish,
  getCurrentChapter,
  secondsLeftInChapter,
} from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { Box } from "components/ui/Box";
import { hasFeatureAccess } from "lib/flags";

const FISH_BY_TYPE = getFishByType();

type Props = {
  onMilestoneReached: (milestoneName: MilestoneName) => void;
  state: GameState;
};

export const Fish: React.FC<Props> = ({ onMilestoneReached, state }) => {
  const { gameService } = useContext(Context);
  const [selectedFish, setSelectedFish] = useState<
    FishName | MarineMarvelName
  >();
  const now = useNow();

  const { t } = useAppTranslation();
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneName>();

  const { farmActivity, milestones } = state;

  const handleClaimReward = (milestone: MilestoneName) => {
    gameService.send("milestone.claimed", { milestone });
    onMilestoneReached(milestone);
    setSelectedMilestone(undefined);
  };

  const milestoneNames = getKeys(FISH_MILESTONES);

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
              {hasCaught && (
                <>
                  {FISH[selectedFish].likes.map((chum) => (
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
                </>
              )}

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
              const { image: typeIcon } =
                ITEM_DETAILS[
                  type === "chapter"
                    ? getChapterMarvelFish(now)
                    : FISH_BY_TYPE[type][0]
                ];

              return (
                <div key={type} className="flex flex-col mb-2">
                  <Label
                    type="default"
                    className="capitalize ml-3"
                    icon={typeIcon}
                  >
                    {type !== "marine marvel"
                      ? `${type} Fish`
                      : "Marine Marvels"}
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

        <MarineMarvelMaps state={state} />
      </div>
      <ModalOverlay
        show={!!selectedMilestone}
        className="z-auto"
        onBackdropClick={() => setSelectedMilestone(undefined)}
      >
        <MilestonePanel
          milestone={MILESTONES[selectedMilestone as MilestoneName]}
          farmActivity={farmActivity}
          onClaim={() => handleClaimReward(selectedMilestone as MilestoneName)}
          onBack={() => setSelectedMilestone(undefined)}
          isClaimed={!!milestones[selectedMilestone as MilestoneName]}
        />
      </ModalOverlay>
    </>
  );
};

export const MarineMarvelMaps: React.FC<{ state: GameState }> = ({ state }) => {
  const { t } = useAppTranslation();
  const now = useNow();

  // Chapter-gating (if chapter can't be determined, hide chapter-gated marvels)
  let currentChapter: ReturnType<typeof getCurrentChapter> | undefined;
  let secondsLeft: number | undefined;
  try {
    currentChapter = getCurrentChapter(now);
    secondsLeft = secondsLeftInChapter(now);
  } catch {
    currentChapter = undefined;
    secondsLeft = undefined;
  }

  const daysLeft =
    secondsLeft !== undefined ? Math.max(0, Math.ceil(secondsLeft / 86400)) : 0;

  // If caught them all already, show nothing here.
  const remainingMarvels = getKeys(MAP_PIECES).filter((marvel) => {
    if (state.farmActivity[`${marvel} Caught`]) return false;

    const chapter = MAP_PIECES[marvel]?.chapter;
    if (!CHAPTER_FISH[marvel as ChapterFish]) return true;

    // Do not show Marine Marvels for non-current Chapters
    return !!currentChapter && chapter === currentChapter;
  });

  if (!hasFeatureAccess(state, "MAP_PIECES")) {
    return null;
  }

  if (remainingMarvels.length === 0) {
    return null;
  }

  return (
    <InnerPanel>
      <div className="p-1">
        <Label type="default" className="mb-2">
          {t("fishing.marineMarvelMaps.title")}
        </Label>
        <p className="text-xs mx-2 mb-1">
          {t("fishing.marineMarvelMaps.description")}
        </p>
        {remainingMarvels.map((map) => (
          <div className="flex items-center -mb-2" key={map}>
            <Box
              hideCount
              image={mapIcon}
              secondaryImage={ITEM_DETAILS[map].image}
            />
            <div className="ml-1">
              <p className="text-sm">
                {t("fishing.mapDiscovered.mapName", { map })}{" "}
              </p>
              <div className="flex items-center">
                <p className="text-xs mr-2">
                  {t("fishing.mapDiscovered.progress", {
                    collected:
                      state.farmActivity[`${map} Map Piece Found`] ?? 0,
                    total: 9,
                  })}
                </p>
                {MAP_PIECES[map]?.chapter && secondsLeft !== undefined && (
                  <>
                    <Label type={daysLeft < 5 ? "danger" : "vibrant"}>
                      {`${daysLeft} days left`}
                    </Label>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </InnerPanel>
  );
};
