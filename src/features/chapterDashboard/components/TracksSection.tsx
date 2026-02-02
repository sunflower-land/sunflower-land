import React, { useMemo, useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { SectionHeader } from "./SectionHeader";
import { ChapterName, secondsLeftInChapter } from "features/game/types/chapters";
import { CHAPTER_TRACKS, MilestoneRewards } from "features/game/types/tracks";
import { GameState } from "features/game/types/game";
import { getTrackProgress, ChapterTracks } from "features/world/ui/tracks/ChapterTracks";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { Label } from "components/ui/Label";
import { ResizableBar } from "components/ui/ProgressBar";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/lib/crafting";
import { getImageUrl } from "lib/utils/getImageURLS";
import { ITEM_IDS } from "features/game/types/bumpkin";
import coinsIcon from "assets/icons/coins.webp";
import flowerIcon from "assets/icons/flower_token.webp";

type Props = {
  chapter: ChapterName;
  gameState: GameState;
};

const rewardPreview = (reward: MilestoneRewards) => {
  const item = getKeys(reward.items ?? {})[0];
  if (item) return { image: ITEM_DETAILS[item].image, label: `${reward.items?.[item]} x ${item}` };

  const wearable = getKeys(reward.wearables ?? {})[0];
  if (wearable) return { image: getImageUrl(ITEM_IDS[wearable]), label: `${reward.wearables?.[wearable]} x ${wearable}` };

  if (reward.coins) return { image: coinsIcon, label: `${reward.coins} Coins` };
  if (reward.flower) return { image: flowerIcon, label: `${reward.flower} FLOWER` };

  return { image: SUNNYSIDE.icons.expression_confused, label: "Mystery reward" };
};

export const TracksSection: React.FC<Props> = ({ chapter, gameState }) => {
  const now = useNow({ live: true });
  const [showMore, setShowMore] = useState(false);

  const track = CHAPTER_TRACKS[chapter];
  const progress = useMemo(() => getTrackProgress({ state: gameState, chapter }), [gameState, chapter]);
  const hasVip = hasVipAccess({ game: gameState });

  const nextIndex = Math.max(progress.milestone.number - 1, 0);
  const nextMilestone = track?.milestones?.[nextIndex];
  const finalMilestonePoints =
    track?.milestones?.[track?.milestones.length - 1]?.points ?? 0;
  const isComplete = progress.points >= finalMilestonePoints;

  const percentage =
    progress.milestone.requirement > 0
      ? (progress.milestone.progress / progress.milestone.requirement) * 100
      : 0;

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="p-1 space-y-2">
          <SectionHeader
            title="Chapter Tracks"
            labelType="info"
            icon={SUNNYSIDE.icons.stopwatch}
            actionText="View all"
            onAction={() => setShowMore(true)}
          />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`${secondsToString(secondsLeftInChapter(now), { length: "short" })} left`}
            </Label>

            {!isComplete && (
              <Label type="default">{`Next milestone: ${progress.milestone.number}`}</Label>
            )}
            {isComplete && <Label type="success">All milestones complete</Label>}
          </div>

          {!isComplete && nextMilestone && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ResizableBar
                    percentage={Math.min(100, Math.max(0, percentage))}
                    outerDimensions={{ width: 30, height: 8 }}
                    type="progress"
                  />
                  <p className="text-xs">{`${progress.milestone.progress}/${progress.milestone.requirement}`}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Label type="chill">Free reward</Label>
                  <div className="flex items-center gap-2">
                    <img
                      src={rewardPreview(nextMilestone.free).image}
                      className="h-6 img-highlight"
                    />
                    <p className="text-xs">{rewardPreview(nextMilestone.free).label}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Label type={hasVip ? "warning" : "default"}>
                    {hasVip ? "VIP reward" : "VIP reward (locked)"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <img
                      src={rewardPreview(nextMilestone.premium).image}
                      className="h-6 img-highlight"
                      style={{ opacity: hasVip ? 1 : 0.5 }}
                    />
                    <p className="text-xs" style={{ opacity: hasVip ? 1 : 0.6 }}>
                      {rewardPreview(nextMilestone.premium).label}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isComplete && (
            <p className="text-xs">
              You’ve completed all track milestones for this chapter.
            </p>
          )}
        </div>
      </InnerPanel>

      <Modal show={showMore} onHide={() => setShowMore(false)} size="lg">
        <CloseButtonPanel onClose={() => setShowMore(false)}>
          <div className="p-2">
            <ChapterTracks />
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

