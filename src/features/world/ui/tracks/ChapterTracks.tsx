import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  getCurrentChapter,
  secondsLeftInChapter,
} from "features/game/types/chapters";
import { NPC_WEARABLES } from "lib/npcs";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import React from "react";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { Button } from "components/ui/Button";
import vipIcon from "assets/icons/vip.webp";
import premiumTrackIcon from "assets/icons/premium_track.webp";
import ticketIcon from "assets/icons/free_track.png";
import milestoneBG from "assets/icons/milestone_blue.webp";
import medalMilestone from "assets/icons/medal_side_grey.webp";
import medalMilestoneBlue from "assets/icons/milestone_medal.webp";
import medalMilestoneRed from "assets/icons/red_medal.webp";
import { CHAPTER_TRACKS, TrackMilestone } from "features/game/types/tracks";
import { ButtonPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/lib/crafting";
import { getImageUrl } from "lib/utils/getImageURLS";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { ResizableBar } from "components/ui/ProgressBar";
import lockIcon from "assets/icons/lock.png";

export const ChapterTracks: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameState } = useGame();
  const state = gameState.context.state;
  const now = useNow();

  const hasVip = hasVipAccess({ game: state });

  const chapter = getCurrentChapter(now);

  const track = CHAPTER_TRACKS[chapter];

  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES["stella"]}>
      <div className="flex justify-between pr-9 mb-2">
        <div className="flex items-center">
          <img src={SUNNYSIDE.icons.stopwatch} className="h-8 mr-1" />
          <div>
            <Label type="info" className="text-xs">
              Chapter ends in
            </Label>
            <p className="text-xxs ml-1">
              {secondsToString(secondsLeftInChapter(now), { length: "medium" })}
            </p>
          </div>
        </div>
        <div className="flex  items-end relative">
          <div className="flex flex-col items-end">
            <ResizableBar
              percentage={0}
              outerDimensions={{ width: 30, height: 8 }}
              type="progress"
            />
            <p className="text-xs pr-4">250/300</p>
          </div>

          <img
            src={medalMilestone}
            style={{
              height: "40px",
              zIndex: "10",
              marginLeft: "-13px",
            }}
          />
          <p
            className="yield-text absolute"
            style={{
              right: "27px",
              zIndex: "10",
              top: "12px",
            }}
          >
            4
          </p>
        </div>
      </div>

      <div className="overflow-x-scroll scrollable w-full ">
        <div className="flex items-center gap-x-2 w-fit  pt-3 pb-2">
          <div className="min-w-20 w-20 flex flex-col items-center justify-center">
            <img src={premiumTrackIcon} className="h-12 mb-1" />
            <Label type="warning" className="text-xs">
              VIP
            </Label>
          </div>
          {track?.premium.milestones.map((milestone) => {
            return (
              <TrackItem
                key={milestone.points}
                milestone={milestone}
                isLocked={!hasVip}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-x-2 my-1 w-fit bg-brown-300 rounded-sm">
          <div className="min-w-20 w-20 flex flex-col items-center justify-center"></div>

          {track?.premium.milestones.map((_, index) => {
            return (
              <div className="w-24 min-w-24 h-8  text-center flex flex-col items-center justify-center">
                <Label icon={medalMilestoneRed} type="formula">
                  {index + 1}
                </Label>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-x-2 w-fit  pt-3 pb-2">
          <div className="min-w-20 w-20 flex flex-col items-center justify-center">
            <img src={ticketIcon} className="h-12 mb-1" />
            <Label type="chill" className="text-xs">
              Free
            </Label>
          </div>
          {track?.premium.milestones.map((milestone) => {
            return <TrackItem key={milestone.points} milestone={milestone} />;
          })}
        </div>
      </div>
    </CloseButtonPanel>
  );
};

export const TrackItem: React.FC<{
  milestone: TrackMilestone;
  isLocked?: boolean;
}> = ({ milestone, isLocked = false }) => {
  const { items, wearables } = milestone;
  const images: string[] = [];

  let amount = 0;
  let text = "";

  if (items) {
    images.push(...getKeys(items).map((item) => ITEM_DETAILS[item].image));
    amount += Object.values(items).reduce((acc, curr) => acc + curr, 0);
    text = Object.keys(items).join(", ");
  }

  if (wearables) {
    images.push(
      ...getKeys(wearables).map((wearable) => getImageUrl(ITEM_IDS[wearable])),
    );
    amount += Object.values(wearables).reduce((acc, curr) => acc + curr, 0);
    text = Object.keys(wearables).join(", ");
  }

  return (
    <div className="relative h-24 min-w-24 w-24 overflow-visible">
      {isLocked && (
        <img src={lockIcon} className="absolute -top-2 -right-1 h-8 z-10" />
      )}

      <ButtonPanel
        //   variant="secondary"
        key={milestone.points}
        className="h-24 min-w-24 w-24 flex flex-col items-center justify-center relative"
      >
        <div className="flex items-center justify-center mb-2">
          {images.map((image) => (
            <img src={image} className="h-12  rounded-md" />
          ))}
        </div>
        <p className="text-center text-sm">x{amount}</p>
      </ButtonPanel>
    </div>
  );
};
