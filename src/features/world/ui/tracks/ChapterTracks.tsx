import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  CHAPTER_TICKET_NAME,
  ChapterName,
  getCurrentChapter,
  secondsLeftInChapter,
} from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { Button } from "components/ui/Button";
import coinsIcon from "assets/icons/coins.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import premiumTrackIcon from "assets/icons/premium_track.webp";
import ticketIcon from "assets/icons/free_track.png";
import medalMilestone from "assets/icons/medal_side_grey.webp";
import medalMilestoneRed from "assets/icons/red_medal.webp";
import medalMilestoneComplete from "assets/icons/track_complete.webp";
import giftIcon from "assets/icons/gift.png";
import {
  CHAPTER_TRACKS,
  MilestoneRewards,
  TrackMilestone,
} from "features/game/types/tracks";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/lib/crafting";
import { getImageUrl } from "lib/utils/getImageURLS";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { ResizableBar } from "components/ui/ProgressBar";
import lockIcon from "assets/icons/lock.png";
import { shortenCount } from "lib/utils/formatNumber";
import { Modal } from "components/ui/Modal";
import { Rewards } from "features/game/expansion/components/ClaimReward";
import { GameState } from "features/game/types/game";
import confetti from "canvas-confetti";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { NaturalImage } from "components/ui/NaturalImage";

type TrackProgress = {
  points: number;
  premium: number;
  free: number;
  milestone: {
    number: number;
    points: number;
    requirement: number;
    progress: number;
  };
};
export function getTrackProgress({
  state,
  chapter,
}: {
  state: GameState;
  chapter: ChapterName;
}): TrackProgress {
  const points =
    state.farmActivity[`${CHAPTER_TICKET_NAME[chapter]} Collected`] ?? 0;

  const premium =
    state.farmActivity[`${chapter} premium Milestone Claimed`] ?? 0;
  const free = state.farmActivity[`${chapter} free Milestone Claimed`] ?? 0;

  let milestoneIndex =
    CHAPTER_TRACKS[chapter]?.milestones.findIndex(
      (milestone) => milestone.points > points,
    ) ?? -1;

  const trackLength = CHAPTER_TRACKS[chapter]?.milestones.length ?? 0;

  if (milestoneIndex === -1) {
    milestoneIndex = trackLength;
  }

  const milestoneNumber = milestoneIndex + 1;
  const milestonePoints =
    CHAPTER_TRACKS[chapter]?.milestones[milestoneIndex]?.points ?? 0;
  const previousMilestonePoints =
    CHAPTER_TRACKS[chapter]?.milestones[milestoneIndex - 1]?.points ?? 0;
  const milestoneRequirement = milestonePoints - previousMilestonePoints;
  const milestoneProgress = points - previousMilestonePoints;

  const progress = {
    points,
    premium,
    free,
    milestone: {
      number: milestoneNumber,
      points: milestonePoints,
      requirement: milestoneRequirement,
      progress: milestoneProgress,
    },
  };

  return progress;
}

export const ChapterTracks: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { gameState } = useGame();
  const state = gameState.context.state;
  const now = useNow();
  const { openModal } = useContext(ModalContext);

  const [selected, setSelected] = useState<
    | {
        milestone: number;
        reward: MilestoneRewards;
        points: number;
        track: "free" | "premium";
      }
    | undefined
  >();

  useEffect(() => {
    setTimeout(() => {
      // Autoscroll to the gift icon
      const giftIcon = document.getElementById("claim-track-icon");
      if (giftIcon) {
        giftIcon.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }, []);

  const hasVip = hasVipAccess({ game: state });

  const chapter = getCurrentChapter(now);

  const track = CHAPTER_TRACKS[chapter];

  const progress = getTrackProgress({ state, chapter });

  const isComplete =
    progress.milestone.number >= (track?.milestones.length ?? 0);

  return (
    <>
      <InnerPanel className="flex flex-wrap justify-between mb-1">
        <div className="flex items-center">
          <img src={SUNNYSIDE.icons.stopwatch} className="h-8 mr-1" />
          <div>
            <Label type="info" className="text-xs">
              {t("tracks.chapterEnds")}
            </Label>
            <p className="text-xxs ml-1">
              {secondsToString(secondsLeftInChapter(now), {
                length: "medium",
              })}
            </p>
          </div>
        </div>
        {isComplete ? (
          <img src={medalMilestoneComplete} className="h-8" />
        ) : (
          <>
            <div className="flex  items-end relative">
              <div className="flex flex-col items-end">
                <ResizableBar
                  percentage={
                    (progress.milestone.progress /
                      progress.milestone.requirement) *
                    100
                  }
                  outerDimensions={{ width: 30, height: 8 }}
                  type="progress"
                />
                <p className="text-xs pr-4">
                  {`${progress.milestone.progress}/${progress.milestone.requirement}`}
                </p>
              </div>

              <img
                src={medalMilestone}
                style={{
                  height: "40px",
                  zIndex: "10",
                  marginLeft: "-13px",
                }}
              />
              <div
                className="absolute text-center"
                style={{
                  right: "16px",
                  zIndex: "10",
                  top: "11px",
                  width: "32px",
                }}
              >
                <p className="yield-text">{progress.milestone.number}</p>
              </div>
            </div>
          </>
        )}
      </InnerPanel>

      <div className="justify-center h-[330px] sm:h-auto gap-x-2  sm:overflow-y-visible overflow-y-scroll overflow-x-visible sm:overflow-x-scroll scrollable w-full flex sm:flex-col flex-row">
        <InnerPanel className="flex sm:flex-row flex-col items-center gap-x-2 gap-y-2 w-fit  pt-3 pb-2 bg-brown-300 flex-1 min-h-fit">
          <div
            className="sm:-20 sm:min-w-20 h-20 min-h-20 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => {
              if (!hasVip) {
                openModal("VIP_ITEMS");
              }
            }}
          >
            <img src={premiumTrackIcon} className="h-12 mb-1" />
            <Label type="warning" className="text-xs ">
              {t("vip")}
              {!hasVip && (
                <img
                  src={SUNNYSIDE.ui.add_button}
                  className="absolute"
                  style={{
                    width: 20,
                    right: -14,
                    top: -10,
                  }}
                />
              )}
            </Label>
          </div>
          {track?.milestones.map((milestone, index) => {
            return (
              <TrackItem
                key={milestone.points}
                milestone={milestone}
                number={index + 1}
                isLocked={!hasVip}
                track="premium"
                progress={progress}
                onClick={() =>
                  setSelected({
                    reward: milestone.premium,
                    points: milestone.points,
                    milestone: index + 1,
                    track: "premium",
                  })
                }
              />
            );
          })}
        </InnerPanel>

        <div className="flex sm:flex-row flex-col items-center gap-x-2 gap-y-2 my-1 sm:w-fit rounded-sm sm:h-6 h-fit w-6 mx-1">
          <div className="hidden sm:flex min-w-20 w-20  flex-row items-center justify-center space-x-1">
            <img src={SUNNYSIDE.icons.chevron_right} className="h-4" />
            <img src={SUNNYSIDE.icons.chevron_right} className="h-4" />
            <img src={SUNNYSIDE.icons.chevron_right} className="h-4" />
          </div>

          <div className="flex sm:hidden h-20 min-h-24 flex-col space-y-1  items-center justify-center">
            <img src={SUNNYSIDE.icons.chevron_down} className="h-4" />
            <img src={SUNNYSIDE.icons.chevron_down} className="h-4" />
            <img src={SUNNYSIDE.icons.chevron_down} className="h-4" />
          </div>

          {track?.milestones.map((_, index) => {
            const total = track.milestones[index].points;

            return (
              <div
                key={index}
                className="sm:w-24 sm:min-w-24 sm:h-10 h-24 min-h-24  text-center flex flex-col sm:flex-row items-center justify-center relative "
              >
                <Label
                  icon={medalMilestoneRed}
                  type={
                    index + 1 < progress.milestone.number
                      ? "success"
                      : "formula"
                  }
                >
                  {index + 1}
                </Label>
                {/* <p className="text-xxs -mt-0.5 sm:pl-1">
                  {shortenCount(total)}
                </p> */}
              </div>
            );
          })}
        </div>

        <InnerPanel className="flex sm:flex-row flex-col items-center gap-x-2 gap-y-2 w-fit  pt-3 pb-2 mb-1 flex-1 min-h-fit">
          <div className="min-w-20 w-20 flex flex-col items-center justify-center">
            <img src={ticketIcon} className="h-12 mb-1" />
            <Label type="chill" className="text-xs">
              {t("free")}
            </Label>
          </div>
          {track?.milestones.map((milestone, index) => {
            return (
              <TrackItem
                key={milestone.points}
                milestone={milestone}
                number={index + 1}
                track="free"
                progress={progress}
                onClick={() =>
                  setSelected({
                    reward: milestone.free,
                    points: milestone.points,
                    milestone: index + 1,
                    track: "free",
                  })
                }
              />
            );
          })}
        </InnerPanel>
      </div>

      <Modal show={!!selected} onHide={() => setSelected(undefined)}>
        <MilestoneDetails
          details={selected}
          onClose={() => setSelected(undefined)}
          chapter={chapter}
        />
      </Modal>
    </>
  );
};

export const TrackItem: React.FC<{
  milestone: TrackMilestone;
  number: number;
  isLocked?: boolean;
  track: "free" | "premium";
  onClick: () => void;
  progress: TrackProgress;
}> = ({ milestone, number, isLocked = false, track, onClick, progress }) => {
  const { items, wearables, coins, flower } = milestone[track];
  const images: string[] = [];

  let amount = 0;

  if (items) {
    images.push(...getKeys(items).map((item) => ITEM_DETAILS[item].image));
    amount += Object.values(items).reduce((acc, curr) => acc + curr, 0);
  }

  if (wearables) {
    images.push(
      ...getKeys(wearables).map((wearable) => getImageUrl(ITEM_IDS[wearable])),
    );
    amount += Object.values(wearables).reduce((acc, curr) => acc + curr, 0);
  }

  if (coins) {
    images.push(coinsIcon);
    amount += coins;
  }

  if (flower) {
    images.push(flowerIcon);
    amount += flower;
  }

  const totalClaimed = track === "premium" ? progress.premium : progress.free;
  const isClaimed = totalClaimed >= number;
  const canClaim =
    progress.milestone.number > number &&
    !isClaimed &&
    totalClaimed === number - 1;

  return (
    <div
      className="relative h-24 min-h-24 min-w-24 w-24 overflow-visible cursor-pointer"
      onClick={onClick}
    >
      {isLocked && (
        <img src={lockIcon} className="absolute -bottom-1 -right-1 h-8 z-10" />
      )}

      {!isLocked && canClaim && (
        <img
          src={giftIcon}
          className="absolute -bottom-1 -right-1 h-8 z-10 animate-bounce"
          id="claim-track-icon"
        />
      )}

      {isClaimed && (
        <img
          src={SUNNYSIDE.icons.confirm}
          className="absolute -bottom-0 -right-1 h-6 z-10"
        />
      )}

      <ButtonPanel
        variant={isClaimed ? "secondary" : "primary"}
        key={milestone.points}
        className="h-24 min-w-24 w-24 flex flex-col relative"
      >
        <div className="flex justify-center h-[75%] items-center">
          {images.map((image) => (
            <NaturalImage
              key={image}
              src={image}
              className="rounded-md"
              maxWidth={20}
            />
          ))}
        </div>
        <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center text-sm">{`x${amount}`}</p>
      </ButtonPanel>
    </div>
  );
};

export const MilestoneDetails: React.FC<{
  details?: {
    milestone: number;
    reward: MilestoneRewards;
    points: number;
    track: "free" | "premium";
  };
  onClose: () => void;
  chapter: ChapterName;
}> = ({ details, onClose, chapter }) => {
  const { t } = useAppTranslation();
  const { gameState, gameService } = useGame();
  const state = gameState.context.state;
  const progress = getTrackProgress({ state, chapter });
  if (!details) return null;

  const pointsProgress = Math.min(progress.points, details.points);

  const claimed =
    details.track === "premium" ? progress.premium : progress.free;

  const needsVip =
    details.track === "premium" && !hasVipAccess({ game: state });
  const canClaim =
    !needsVip &&
    progress.milestone.number > details.milestone &&
    claimed < details.milestone &&
    claimed === details.milestone - 1;

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-1">
        <div className="flex items-center flex-wrap mb-2">
          <Label type="formula" className=" mr-2" icon={medalMilestoneRed}>
            {details.milestone}
          </Label>

          <div className="flex items-center">
            <ResizableBar
              percentage={(pointsProgress / details.points) * 100}
              type="progress"
            />
            <p className="text-xs ml-1">{`${shortenCount(pointsProgress)}/${shortenCount(details.points)} points`}</p>
          </div>
        </div>

        <Rewards
          reward={{
            items: details.reward.items ?? {},
            wearables: details.reward.wearables ?? {},
            coins: details.reward.coins ?? 0,
            sfl: details.reward.flower ?? 0,
          }}
        />
      </div>
      {needsVip && (
        <Label type="danger" className="text-xs">
          {t("vip.required")}
        </Label>
      )}
      {canClaim && (
        <Button
          onClick={() => {
            gameService.send("trackMilestone.claimed", {
              track: details.track,
            });
            confetti();
            onClose();
          }}
        >
          {t("claim")}
        </Button>
      )}
    </CloseButtonPanel>
  );
};
