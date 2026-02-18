import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  ChapterName,
  getCurrentChapter,
  getChapterTicket,
} from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import medalMilestoneComplete from "assets/icons/medals_completed.webp";
import giftIcon from "assets/icons/gift.png";
import vipIcon from "assets/icons/vip.webp";
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
import { gameAnalytics } from "lib/gameAnalytics";

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
  const points = state.farmActivity[`${chapter} Points Earned`] ?? 0;

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

export const ChapterTracks: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameState } = useGame();
  const state = gameState.context.state;
  const now = useNow();
  const { openModal } = useContext(ModalContext);
  const hasTrackedRef = useRef<ChapterName | null>(null);

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
  const chapterTicket = getChapterTicket(now);

  const track = CHAPTER_TRACKS[chapter];

  const progress = getTrackProgress({ state, chapter });

  const finalMilestonePoints =
    track?.milestones[track?.milestones.length - 1]?.points ?? 0;

  const isComplete = progress.points >= finalMilestonePoints;

  useEffect(() => {
    const nowMs = Date.now();
    const lastInteractionKey = `chapterTracks:lastInteractionAt:${chapter}`;
    const premiumActivatedKey = `chapterTracks:premiumActivated:${chapter}`;

    if (hasTrackedRef.current === chapter) {
      return;
    }
    hasTrackedRef.current = chapter;

    gameAnalytics.trackTracksViewed({ chapter, hasVip });

    try {
      const lastInteractionAt = localStorage.getItem(lastInteractionKey);

      if (lastInteractionAt) {
        const inactiveDays = Math.floor(
          (nowMs - Number(lastInteractionAt)) / (24 * 60 * 60 * 1000),
        );

        if (inactiveDays > 0) {
          gameAnalytics.trackTracksReturn({
            chapter,
            lastTier: progress.milestone.number,
            inactiveDays,
          });
        }
      }

      localStorage.setItem(lastInteractionKey, String(nowMs));

      if (hasVip && !localStorage.getItem(premiumActivatedKey)) {
        gameAnalytics.trackTracksPremiumActivated({ chapter });
        localStorage.setItem(premiumActivatedKey, "true");
      }
    } catch {
      // no-op
    }
  }, [chapter, hasVip]);

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex flex-wrap justify-between items-start">
          {/* <div className="flex items-start">
            <img src={SUNNYSIDE.icons.stopwatch} className="w-6 mr-1" />
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
          </div> */}
          <div className="flex">
            <img src={giftIcon} className="h-9 mr-1" />
            <div>
              <Label type="warning">{t("rewards")}</Label>
              <p className="text-xxs ml-1">
                {t("chapterDashboard.tracksEarnPoints")}
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
        </div>
        {/* <div
          className="flex items-center pt-1 mt-1"
          style={{
            borderTop: "1px solid #c28569",
          }}
        >
          <img src={chapterPointsIcon} className="w-6 mr-[8px]" />
          <div className="flex-1">
            <p className="text-xxs">
              {t("tracks.completeTasksToEarnPoints", {
                chapter: chapterTicket,
              })}
            </p>
          </div>
        </div> */}
      </InnerPanel>

      <div className="justify-center h-[330px] sm:h-auto gap-x-2  sm:overflow-y-visible overflow-y-scroll overflow-x-visible sm:overflow-x-scroll scrollable w-full flex sm:flex-col flex-row">
        <InnerPanel className="flex sm:flex-row flex-col items-center gap-x-2 gap-y-2 w-fit  pt-3 pb-2 bg-brown-300 flex-1 min-h-fit">
          <div
            className="sm:-20 sm:min-w-20 h-20 min-h-20 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => {
              if (!hasVip) {
                gameAnalytics.trackTracksPremiumUpsellOpened({ chapter });
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

// A smaller widget based track used for mobile.
export const ChapterTracksPreview: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameState } = useGame();
  const state = gameState.context.state;
  const now = useNow();
  const { openModal } = useContext(ModalContext);
  const hasTrackedRef = useRef<ChapterName | null>(null);

  const [selected, setSelected] = useState<
    | {
        milestone: number;
        reward: MilestoneRewards;
        points: number;
        track: "free" | "premium";
      }
    | undefined
  >();

  const hasVip = hasVipAccess({ game: state });

  const chapter = getCurrentChapter(now);
  const chapterTicket = getChapterTicket(now);

  const track = CHAPTER_TRACKS[chapter];

  const progress = getTrackProgress({ state, chapter });

  const finalMilestonePoints =
    track?.milestones[track?.milestones.length - 1]?.points ?? 0;

  const isComplete = progress.points >= finalMilestonePoints;

  if (isComplete) {
    return (
      <InnerPanel className="flex flex-wrap justify-between ">
        <Label type="success">{t("completed")}</Label>
        <img src={medalMilestoneComplete} className="h-8" />
      </InnerPanel>
    );
  }
  if (!track) {
    return null;
  }
  const rewards = track.milestones[progress.milestone.number - 1];
  if (!rewards) {
    return null;
  }

  const { items, wearables, coins, flower } = rewards.free;
  const freeImages: string[] = [];
  const freeText: string[] = [];

  let amount = 0;

  if (items) {
    freeImages.push(...getKeys(items).map((item) => ITEM_DETAILS[item].image));
    amount += Object.values(items).reduce((acc, curr) => acc + curr, 0);
    freeText.push(...getKeys(items).map((item) => `${items[item]} x ${item}`));
  }

  if (wearables) {
    freeImages.push(
      ...getKeys(wearables).map((wearable) => getImageUrl(ITEM_IDS[wearable])),
    );
    amount += Object.values(wearables).reduce((acc, curr) => acc + curr, 0);
    freeText.push(
      ...getKeys(wearables).map(
        (wearable) => `${wearables[wearable]} x ${wearable}`,
      ),
    );
  }

  if (coins) {
    freeImages.push(coinsIcon);
    amount += coins;
    freeText.push(`${coins}`);
  }

  if (flower) {
    freeImages.push(flowerIcon);
    amount += flower;
    freeText.push(`${flower}`);
  }

  const premiumImages: string[] = [];
  const premiumText: string[] = [];
  const {
    items: premiumItems,
    wearables: premiumWearables,
    coins: premiumCoins,
    flower: premiumFlower,
  } = rewards.premium;

  if (premiumItems) {
    premiumImages.push(
      ...getKeys(premiumItems).map((item) => ITEM_DETAILS[item].image),
    );
    amount += Object.values(premiumItems).reduce((acc, curr) => acc + curr, 0);
    premiumText.push(
      ...getKeys(premiumItems).map((item) => `${premiumItems[item]} x ${item}`),
    );
  }

  if (premiumWearables) {
    premiumImages.push(
      ...getKeys(premiumWearables).map((wearable) =>
        getImageUrl(ITEM_IDS[wearable]),
      ),
    );
    amount += Object.values(premiumWearables).reduce(
      (acc, curr) => acc + curr,
      0,
    );
    premiumText.push(
      ...getKeys(premiumWearables).map(
        (wearable) => `${premiumWearables[wearable]} x ${wearable}`,
      ),
    );
  }

  if (premiumCoins) {
    premiumImages.push(coinsIcon);
    amount += premiumCoins;
    premiumText.push(`${coins} coins`);
  }

  if (premiumFlower) {
    premiumImages.push(flowerIcon);
    amount += premiumFlower;
    premiumText.push(`${flower} FLOWER`);
  }

  const images = [...freeImages, ...premiumImages];

  return (
    <>
      <InnerPanel>
        <div className="flex flex-wrap justify-between items-start">
          <Label type="warning">{t("chapterDashboard.nextReward")}</Label>

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
        </div>
        <div className="flex items-center">
          <div className="w-16 min-w-16 h-16 relative mr-2">
            <img
              src={SUNNYSIDE.ui.grey_background}
              className="w-full h-full rounded-md"
            />
            <img
              src={freeImages[0]}
              className="absolute left-2 top-2 w-10 max-h-8 object-contain"
            />
            <img
              src={premiumImages[0]}
              className="absolute right-2 bottom-2 w-10 max-h-8 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0 mb-1">
            {freeText.map((text, index) => (
              <div
                className="flex items-center w-full min-w-0 overflow-hidden"
                key={`${text}-${index}`}
              >
                <p className="text-xs truncate mr-1 flex-1 min-w-0">{text}</p>
                <div className="flex w-16 justify-end shrink-0">
                  <Label type="success">{t("free")}</Label>
                </div>
              </div>
            ))}
            {premiumText.map((text, index) => (
              <div
                className="flex items-center w-full min-w-0 overflow-hidden"
                key={`${text}-vip-${index}`}
              >
                <p className="text-xs truncate mr-1 flex-1 min-w-0">{text}</p>

                <div className="flex w-16 justify-end shrink-0">
                  <img src={vipIcon} className="h-5 mr-0.5" />
                  {!hasVip && <img src={lockIcon} className="h-5 " />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </InnerPanel>

      <Button
        className="w-full relative mt-1"
        onClick={() => openModal("CHAPTER_TRACKS")}
      >
        <span className="flex items-center justify-center gap-2 w-full">
          <span>{t("chapter.open")}</span>
          <img src={giftIcon} className="h-5" />
        </span>
      </Button>
    </>
  );
};
