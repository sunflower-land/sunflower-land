import { RoundButton } from "components/ui/RoundButton";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React from "react";
import { useGame } from "features/game/GameProvider";
import { isMobile } from "mobile-device-detect";
import giftIcon from "assets/icons/chapter_icon_3.webp";
import { useNavigate } from "react-router";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { useNow } from "lib/utils/hooks/useNow";
import { CHAPTERS, getCurrentChapter } from "features/game/types/chapters";

const CHAPTER_REWARDS_ACK_KEY = "chapterRewardsAcknowledged";

const getChapterRewardsAcknowledged = () => {
  if (typeof window === "undefined") return 0;
  const value = localStorage.getItem(CHAPTER_REWARDS_ACK_KEY);
  return value ? Number(value) : 0;
};

const setChapterRewardsAcknowledged = (timestamp: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAPTER_REWARDS_ACK_KEY, `${timestamp}`);
};

const _bumpkinExperience = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;

export const RewardsButton: React.FC = () => {
  const { gameService } = useGame();
  const navigate = useNavigate();
  const now = useNow({ live: true });
  const bumpkinExperience = useSelector(gameService, _bumpkinExperience);
  const bumpkinLevel = getBumpkinLevel(bumpkinExperience);

  const chapter = getCurrentChapter(now);
  const { startDate, tasksBegin } = CHAPTERS[chapter];
  const eventTimes = [startDate.getTime(), tasksBegin?.getTime()].filter(
    (time): time is number => typeof time === "number",
  );
  const latestEventAt = Math.max(
    0,
    ...eventTimes.filter((time) => time <= now),
  );
  const acknowledgedAt = getChapterRewardsAcknowledged();
  const shouldPulsate =
    bumpkinLevel >= 3 && latestEventAt > 0 && acknowledgedAt < latestEventAt;

  return (
    <div
      className="absolute z-10"
      style={{
        top: `${PIXEL_SCALE * (isMobile ? 15 : 5)}px`,
        left: `${PIXEL_SCALE * (isMobile ? 34 : 32)}px`,
      }}
    >
      <RoundButton
        buttonSize={isMobile ? 15 : 18}
        onClick={() => {
          if (latestEventAt > 0) {
            setChapterRewardsAcknowledged(latestEventAt);
          }
          navigate("/chapter");
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${PIXEL_SCALE * (isMobile ? 12 : 14)}px`,
          }}
        >
          <img
            src={giftIcon}
            className="group-active:translate-y-[2px] relative"
            style={{
              width: `${PIXEL_SCALE * (isMobile ? 10 : 12)}px`,
              left: `${PIXEL_SCALE * 1.1}px`,
            }}
          />

          <img
            src={SUNNYSIDE.icons.stopwatch}
            className={`group-active:translate-y-[2px] absolute top-1 right-1 ${
              shouldPulsate ? "animate-pulsate" : ""
            }`}
            style={{
              width: `${PIXEL_SCALE * 8}px`,
              right: `${PIXEL_SCALE * -3}px`,
              top: `${PIXEL_SCALE * -3}px`,
            }}
          />
        </div>
      </RoundButton>
    </div>
  );
};
